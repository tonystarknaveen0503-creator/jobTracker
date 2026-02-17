// ===============================
// INITIAL DATA (Dummy Applications)
// ===============================

let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

// Insert dummy data only first time
if (!localStorage.getItem("dummyLoaded")) {

  jobs = [
    { company: "Google", role: "Frontend Developer", status: "Interview" },
    { company: "Amazon", role: "Backend Developer", status: "Applied" },
    { company: "Microsoft", role: "Full Stack Developer", status: "Offer" },
    { company: "Infosys", role: "Software Engineer", status: "Rejected" }
  ];

  localStorage.setItem("jobs", JSON.stringify(jobs));
  localStorage.setItem("dummyLoaded", "true");
}

let editIndex = null;

// ===============================
// ADD OR EDIT APPLICATION
// ===============================

const form = document.getElementById("jobForm");

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const company = document.getElementById("company").value;
    const role = document.getElementById("role").value;
    const status = document.getElementById("status").value;

    if (editIndex !== null) {
      jobs[editIndex] = { company, role, status };
      editIndex = null;
    } else {
      jobs.push({ company, role, status });
    }

    localStorage.setItem("jobs", JSON.stringify(jobs));
    document.getElementById("successModal").style.display = "flex";
    form.reset();
  });
}

function closeModal() {
  document.getElementById("successModal").style.display = "none";
}

// ===============================
// DISPLAY APPLICATIONS
// ===============================

const list = document.getElementById("applicationList");

if (list) {
  list.innerHTML = "";

  jobs.forEach((job, index) => {

    const row = document.createElement("tr");
    const statusClass = job.status.toLowerCase();

    row.innerHTML = `
      <td>${job.company}</td>
      <td>${job.role}</td>
      <td><span class="badge ${statusClass}">${job.status}</span></td>
      <td>
        <button onclick="startEdit(${index})">Edit</button>
        <button onclick="deleteJob(${index})">Delete</button>
      </td>
    `;

    list.appendChild(row);
  });
}

function deleteJob(index) {
  jobs.splice(index, 1);
  localStorage.setItem("jobs", JSON.stringify(jobs));
  location.reload();
}

function startEdit(index) {
  localStorage.setItem("editData", JSON.stringify({ job: jobs[index], index }));
  window.location.href = "add-application.html";
}

// ===============================
// LOAD EDIT DATA
// ===============================

const editData = JSON.parse(localStorage.getItem("editData"));

if (editData && form) {
  document.getElementById("company").value = editData.job.company;
  document.getElementById("role").value = editData.job.role;
  document.getElementById("status").value = editData.job.status;
  editIndex = editData.index;
  localStorage.removeItem("editData");
}

// ===============================
// DASHBOARD STATS
// ===============================

const total = document.getElementById("totalCount");
const interview = document.getElementById("interviewCount");
const offer = document.getElementById("offerCount");

if (total) {
  total.textContent = jobs.length;
  interview.textContent = jobs.filter(j => j.status === "Interview").length;
  offer.textContent = jobs.filter(j => j.status === "Offer").length;
}

// ===============================
// CHART
// ===============================

const chartCanvas = document.getElementById("jobChart");

if (chartCanvas) {
  new Chart(chartCanvas, {
    type: "doughnut",
    data: {
      labels: ["Applied", "Interview", "Offer", "Rejected"],
      datasets: [{
        data: [
          jobs.filter(j => j.status === "Applied").length,
          jobs.filter(j => j.status === "Interview").length,
          jobs.filter(j => j.status === "Offer").length,
          jobs.filter(j => j.status === "Rejected").length
        ],
        backgroundColor: ["#3b82f6", "#f59e0b", "#10b981", "#ef4444"]
      }]
    }
  });
}

// ===============================
// SEARCH
// ===============================

const search = document.getElementById("searchInput");

if (search) {
  search.addEventListener("keyup", function () {
    const value = this.value.toLowerCase();
    const rows = document.querySelectorAll("#applicationList tr");

    rows.forEach(row => {
      row.style.display =
        row.textContent.toLowerCase().includes(value)
          ? ""
          : "none";
    });
  });
}

// ===============================
// DARK MODE
// ===============================

function toggleDark() {
  document.body.classList.toggle("dark");
}
