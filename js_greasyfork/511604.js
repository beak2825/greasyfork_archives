/**
 * TM Exporter/Importer
 * version 0.0.1 BETA
 */

// ==UserScript==
// @name         TM LocalStorage Exporter/Importer
// @namespace    http://tampermonkey.net/
// @version      00.00.01 Beta - English Only (2024-10-05)
// @description  Export/Import your trophymanager R5/R6 local storage
// @author       Erik (ABC FC 4402678)
// @include      https://trophymanager.com/club/*/squad/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=trophymanager.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511604/TM%20LocalStorage%20ExporterImporter.user.js
// @updateURL https://update.greasyfork.org/scripts/511604/TM%20LocalStorage%20ExporterImporter.meta.js
// ==/UserScript==

function exportLocalStorage() {
  const filteredData = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    if (/^\d+_(REREC|skills|SI|R5)$/.test(key)) {
      filteredData[key] = localStorage.getItem(key);
    }
  }

  const data = JSON.stringify(filteredData);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];

  const a = document.createElement("a");
  a.href = url;
  a.download = "trophymangerLocalStorage_" + formattedDate + ".json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importLocalStorage(event) {
  const file = event.target.files[0];

  if (file) {
    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      alert("Please upload a valid JSON file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const data = JSON.parse(e.target.result);
        const confirmMessage = `If the local storage already contains keys that match those in the uploaded JSON file, their values will be replaced.\n\nWould you like to continue with the import?`;

        if (confirm(confirmMessage)) {
          saveToLocalStorage(data);
          alert("Data imported to localStorage successfully!");
        } else {
          alert("Import canceled.");
        }
      } catch (error) {
        alert("Error parsing JSON: " + error.message);
      }
    };
    reader.readAsText(file);
  }
}

function saveToLocalStorage(data) {
  for (const key in data) {
    localStorage.setItem(key, data[key]);
  }
}

const input = document.createElement("input");
input.type = "file";
input.accept = ".json";
input.addEventListener("change", importLocalStorage);
document.body.appendChild(input);

const expBtn = document.createElement("button");
expBtn.textContent = "Export local data";
expBtn.id = "expBtn";
expBtn.class = "button button_border";
expBtn.style =
  "width:168px; height:24px; padding: 1; color:white; background-color:#4A6C1F; cursor:pointer; border:1px solid #6c9922;";
expBtn.addEventListener("click", function () {
  exportLocalStorage();
});

const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.id = "fileInput";
fileInput.style.display = "none";
fileInput.addEventListener("change", importLocalStorage);

const impBtn = document.createElement("button");
impBtn.textContent = "Import data file";
impBtn.id = "impBtn";
impBtn.class = "button button_border";
impBtn.style =
  "width:168px; height:24px; padding: 1; color:white; background-color:#4A6C1F; cursor:pointer; border:1px solid #6c9922;";
impBtn.addEventListener("click", function () {
  fileInput.click();
});

$(".column3_a .box_body .std").first().attr("id", "databox");
$("#databox").append(expBtn);
$("#databox").append(impBtn);
