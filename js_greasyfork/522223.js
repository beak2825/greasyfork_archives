// ==UserScript==
// @name         ChatGPT Tools Export/Import
// @namespace    ChatGPT Tools by Vishanka
// @version      1.0
// @description  Export and import localStorage keys rulesProfiles and lorebookEntries
// @author       Vishanka
// @match        https://chatgpt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522223/ChatGPT%20Tools%20ExportImport.user.js
// @updateURL https://update.greasyfork.org/scripts/522223/ChatGPT%20Tools%20ExportImport.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create an export button
    const exportButton = document.createElement('button');
    exportButton.innerText = 'Export Data';
    exportButton.style.position = 'fixed';
    exportButton.style.top = '10px';
    exportButton.style.right = '10px';
    exportButton.style.zIndex = '10000';
    document.body.appendChild(exportButton);

    // Create an import button
    const importButton = document.createElement('button');
    importButton.innerText = 'Import Data';
    importButton.style.position = 'fixed';
    importButton.style.top = '50px';
    importButton.style.right = '10px';
    importButton.style.zIndex = '10000';
    document.body.appendChild(importButton);

    // Function to export data
    exportButton.addEventListener('click', () => {
        const keysToExport = ['rulesProfiles', 'lorebookEntries'];
        const exportedData = {};

        keysToExport.forEach(key => {
            if (localStorage.getItem(key)) {
                exportedData[key] = JSON.parse(localStorage.getItem(key));
            }
        });

        const blob = new Blob([JSON.stringify(exportedData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'exported_data.json';
        a.click();
        URL.revokeObjectURL(url);
    });

    // Function to import data
    importButton.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.addEventListener('change', (event) => {
            const file = event.target.files[0];
            const reader = new FileReader();

            reader.onload = function(e) {
                try {
                    const importedData = JSON.parse(e.target.result);

                    Object.keys(importedData).forEach(key => {
                        if (importedData[key]) {
                            localStorage.setItem(key, JSON.stringify(importedData[key]));
                        }
                    });

                    alert('Data imported successfully!');
                } catch (error) {
                    alert('Failed to import data: Invalid JSON file.');
                }
            };

            reader.readAsText(file);
        });

        input.click();
    });
})();
