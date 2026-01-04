// ==UserScript==
// @name         Picrew WIP manager
// @namespace    https://github.com/7evy
// @version      1.1.0
// @description  Save and manage WIPs on Picrew's image makers
// @author       7evy
// @run-at       document-idle
// @include      /^https://picrew\.me/(../)?image_maker/[0-9]+/
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/543716/Picrew%20WIP%20manager.user.js
// @updateURL https://update.greasyfork.org/scripts/543716/Picrew%20WIP%20manager.meta.js
// ==/UserScript==

(function() {
  'use strict';

  ///////////////////////////////
  // UI Setup
  ///////////////////////////////

  const uiHTML = `
    <div id="wip-toolbox">
      <div id="wip-toolbox-bar-1">
        <input type="text" id="wip-name" placeholder="WIP name" />
        <button id="save-wip">💾 Save</button>
        <select id="wip-list"><option value="">-- Load WIP --</option></select>
        <button id="load-wip">📂 Load</button>
        <button id="delete-wip">🗑️ Delete</button>
      </div>
      <div id="wip-toolbox-bar-2">
        <button id="export-wip">📤 Export</button>
        <button id="export-all">📤 Export all</button>
        <input type="file" id="file-input" />
        <button id="import">📥 Import</button>
      </div>
    </div>
  `;

  const css = `
    #wip-toolbox {
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0,0,0,0.8);
      border-radius: 8px;
      padding: 10px;
    }
    #wip-toolbox-bar-1, #wip-toolbox-bar-2 {
      display: flex;
      flex-direction: row;
      z-index: 9999;
      font-size: 14px;
      color: white;
      font-family: sans-serif;
    }
    #wip-toolbox-bar-1 {
      gap: 10px;
    }
    #wip-toolbox-bar-2 {
      gap: 20px;
      margin-top: 4px;
    }
    #wip-toolbox input, #wip-toolbox select, #wip-toolbox button {
      margin: 3px 0;
      padding: 4px;
    }
    #wip-toolbox input, #wip-toolbox select {
      width: 120px;
    }
    #file-input {
      display: none;
    }
    #wip-toolbox button {
      color: white !important;
    }
    #wip-toolbox button:hover {
      background: rgba(100,100,100,0.8);
    }
    #wip-toolbox button:active {
      background: rgba(150,150,150,0.8);
    }
  `;

  GM_addStyle(css);

  if (window.top === window.self) {
    document.body.insertAdjacentHTML('beforeend', uiHTML);
  }

  const saveButton = document.getElementById('save-wip');
  const loadButton = document.getElementById('load-wip');
  const deleteButton = document.getElementById('delete-wip');
  const exportButton = document.getElementById('export-wip');
  const exportAllButton = document.getElementById('export-all');
  const importButton = document.getElementById('import');
  const importFileInput = document.getElementById('file-input');
  const wipInput = document.getElementById('wip-name');
  const wipSelect = document.getElementById('wip-list');

  function detectImageMakerId() {
    const match = location.href.match(/image_maker\/([0-9]+)/);
    return match ? parseInt(match[1], 10) : null;
  }
  const imageMakerId = detectImageMakerId();
  if (!imageMakerId) return;
  const GMkey = `picrew_wips_${imageMakerId}`

  ///////////////////////////////
  // Event Listeners
  ///////////////////////////////

  saveButton.onclick = () => {
    const name = wipInput.value.trim();
    if (!name) return alert('A name is required');
    saveWIP(name);
  };

  loadButton.onclick = () => {
    const name = wipSelect.value;
    if (!name) return alert('Select a WIP to load');
    loadWIP(name);
    location.reload();
  };

  deleteButton.onclick = () => {
    const name = wipSelect.value;
    if (!name) return alert('Select a WIP to delete');
    deleteWIP(name);
  };

  exportButton.onclick = () => {
    const name = wipSelect.value;
    if (!name) return alert('Select a WIP to export');
    exportWIP(name);
  };

  exportAllButton.onclick = () => {
    exportAllWIPs();
  };

  importButton.onclick = () => {
    importFileInput.click();
  };

  importFileInput.addEventListener("change", function (e) {
    const selectedImportFile = e.target.files[0];
    if (selectedImportFile) importFromFile(selectedImportFile);
  });

  ///////////////////////////////
  // WIP Logic
  ///////////////////////////////

  async function saveWIP(name) {
    const wipData = await exportParts(imageMakerId);
    const allWIPs = await GM_getValue(GMkey, {});
    allWIPs[name] = wipData;
    await GM_setValue(GMkey, allWIPs);
    await refreshDropdown(allWIPs);
  }

  async function loadWIP(name) {
    const allWIPs = await GM_getValue(GMkey, {});
    const wip = allWIPs[name];
    if (!wip) return alert("WIP not found.");
    await restoreParts(wip);
  }

  async function deleteWIP(name) {
    const allWIPs = await GM_getValue(GMkey, {});
    delete allWIPs[name];
    await GM_setValue(GMkey, allWIPs);
    await removeFromDropdown(name);
  }

  async function refreshDropdown(allWIPs) {
    wipSelect.innerHTML = `<option value="">-- Load WIP --</option>`;
    for (const name of Object.keys(allWIPs)) {
      const option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      wipSelect.appendChild(option);
    }
  }

  async function removeFromDropdown(name) {
    const option = wipSelect.querySelector(`option[value="${name}"]`);
    option.remove();
    wipSelect.selectedIndex = 0;
    wipSelect.dispatchEvent(new Event("option deleted"));
  }

  async function exportWIP(name) {
    const allWIPs = await GM_getValue(GMkey, {});

    const wip = allWIPs[name];
    if (!wip) return alert("WIP not found.");

    const exportData = [{
      name: name,
      data: wip
    }];

    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${imageMakerId + '_' + name}.json`;
    a.click();

    URL.revokeObjectURL(url);
  }

  async function exportAllWIPs() {
    const allWIPs = await GM_getValue(GMkey, {});

    const exportData = Object.entries(allWIPs).map(([name, data]) => ({ name, data }));

    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${imageMakerId}.json`;
    a.click();

    URL.revokeObjectURL(url);
  }

  async function importFromFile(file) {
    const allWIPs = await GM_getValue(GMkey, {});
    const reader = new FileReader();

    reader.onload = async function (e) {
      try {
        const jsonImports = JSON.parse(e.target.result);

        if (!Array.isArray(jsonImports)) {
          alert("Invalid import file.");
          return;
        }

        for (const jsonImport of jsonImports) {
          if (typeof jsonImport.name === "string" && Array.isArray(jsonImport.data)) {
            if (allWIPs.hasOwnProperty(jsonImport.name)) {
              allWIPs[jsonImport.name + ' (backup)'] = allWIPs[jsonImport.name];
            }
            allWIPs[jsonImport.name] = jsonImport.data;
          } else {
            console.warn("Skipping invalid context:", jsonImport.name);
          }
        }

        await GM_setValue(GMkey, allWIPs);
        location.reload();
      } catch (err) {
        alert("Failed to import WIPs: " + err.message);
      }
    };

    reader.readAsText(file);
  }

  ///////////////////////////////
  // IndexedDB Access
  ///////////////////////////////

  // Picrew's image maker history is stored in the indexed DB under picrew > image_maker_parts
  function openPicrewDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("picrew");
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function exportParts(imageMakerId) {
    const db = await openPicrewDB();
    const tx = db.transaction("image_maker_parts", "readonly");
    const store = tx.objectStore("image_maker_parts");

    return new Promise(resolve => {
      store.getAll().onsuccess = (valuesEvent) => resolve(valuesEvent.target.result);
    });
  }

  async function restoreParts(wipData) {
    const db = await openPicrewDB();
    const tx = db.transaction("image_maker_parts", "readwrite");
    const store = tx.objectStore("image_maker_parts");

    // keyPath is computed from value
    wipData.forEach((value) => store.put(value));

    return new Promise(resolve => {
      tx.oncomplete = resolve;
    });
  }

  ///////////////////////////////
  // Init
  ///////////////////////////////

  refreshDropdown(GM_getValue(GMkey, {}));
})();
