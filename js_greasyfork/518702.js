// ==UserScript==
// @name         Discord/Shapes - LocalStorage Import/Export
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Script to export/import specific entries from localStorage
// @author       Vishanka
// @match        https://discord.com/channels/*
// @grant        unsafeWindow
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/518702/DiscordShapes%20-%20LocalStorage%20ImportExport.user.js
// @updateURL https://update.greasyfork.org/scripts/518702/DiscordShapes%20-%20LocalStorage%20ImportExport.meta.js
// ==/UserScript==

(function() {
    'use strict';

// Create buttons to trigger export and import
unsafeWindow.exportButton = document.createElement('div');
exportButton.innerHTML = `
  <div style="display: flex; align-items: center; justify-content: center;">
    <button style="margin-top: 20px; margin-left: 4px; margin-right: 5px; padding: 7px 51px; font-size: 16px; cursor: pointer; background-color: transparent; color: #b0b0b0; border-radius: 8px; text-align: center; transition: background-color 0.1s, color 0.1s;">Export localStorage</button>
  </div>
`;

unsafeWindow.exportButton.onmouseover = () => {
  exportButton.querySelector('button').style.backgroundColor = '#212121';
  exportButton.querySelector('button').style.color = '#ffffff';
};
exportButton.onmouseout = () => {
  exportButton.querySelector('button').style.backgroundColor = 'transparent';
  exportButton.querySelector('button').style.color = '#b0b0b0';
};
DCstoragePanel.appendChild(exportButton);

unsafeWindow.importButton = document.createElement('div');
importButton.innerHTML = `
  <div style="display: flex; align-items: center; justify-content: center;">
    <button style="margin-top: 20px; margin-left: 4px; margin-right: 5px; padding: 7px 50px; font-size: 16px; cursor: pointer; background-color: transparent; color: #b0b0b0; border-radius: 8px; text-align: center; transition: background-color 0.1s, color 0.1s;">Import localStorage</button>
  </div>
`;

importButton.onmouseover = () => {
  importButton.querySelector('button').style.backgroundColor = '#212121';
  importButton.querySelector('button').style.color = '#ffffff';
};
importButton.onmouseout = () => {
  importButton.querySelector('button').style.backgroundColor = 'transparent';
  importButton.querySelector('button').style.color = '#b0b0b0';
};
DCstoragePanel.appendChild(importButton);

    // Export specific localStorage entries
    exportButton.addEventListener('click', () => {
        const filteredData = {};
        for (const key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                if (key.startsWith('profile:') || key.includes('lorebook:') || key === 'selectedProfile') {
                    filteredData[key] = localStorage.getItem(key);
                }
            }
        }
        const data = JSON.stringify(filteredData);
        const blob = new Blob([data], {type: 'application/json'});
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'localStorage_filtered.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    // Import localStorage
    importButton.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (!file) {
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedData = JSON.parse(e.target.result);
                    for (const key in importedData) {
                        localStorage.setItem(key, importedData[key]);
                    }
                    alert('localStorage has been successfully imported.');
                } catch (err) {
                    alert('Failed to import localStorage: ' + err.message);
                }
            };
            reader.readAsText(file);
        });
        input.click();
    });
})();
