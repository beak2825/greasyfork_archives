// ==UserScript==
// @name         Text Resizer with Settings
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Resize text on a webpage and export settings as JSON
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/461611/Text%20Resizer%20with%20Settings.user.js
// @updateURL https://update.greasyfork.org/scripts/461611/Text%20Resizer%20with%20Settings.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Default font size
    let fontSize = 16;

    // Check if user has set font size preferences previously
    if (GM_getValue('fontSize')) {
        fontSize = GM_getValue('fontSize');
        resizeText(fontSize);
    }

    // Add button to increase text size
    const increaseButton = document.createElement('button');
    increaseButton.innerText = 'Больше';
    increaseButton.addEventListener('click', () => {
        fontSize += 2;
        resizeText(fontSize);
        GM_setValue('fontSize', fontSize);
    });
document.body.insertBefore(increaseButton, document.body.firstChild);

    // Add button to decrease text size
    const decreaseButton = document.createElement('button');
    decreaseButton.innerText = 'Меньше';
    decreaseButton.addEventListener('click', () => {
        fontSize -= 2;
        resizeText(fontSize);
        GM_setValue('fontSize', fontSize);
    });
    document.body.insertBefore(decreaseButton, document.body.firstChild);

    // Add button to open settings dialog
    const settingsButton = document.createElement('button');
    settingsButton.innerText = 'Настройки';
    settingsButton.addEventListener('click', () => {
        openSettingsDialog();
    });
    document.body.insertBefore(settingsButton, document.body.firstChild);

    // Resize all text on the page
    function resizeText(fontSize) {
        document.querySelectorAll('*').forEach((element) => {
            element.style.fontSize = fontSize + 'px';
        });
    }

    // Open settings dialog
    function openSettingsDialog() {
        const dialog = document.createElement('dialog');
        dialog.innerHTML = `
            <form>
                <button id="export-button" type="button">Export</button>
                <button id="import-button" type="button">Import</button>
                <button id="cancel-button" type="button">Cancel</button>
            </form>
        `;
        document.body.appendChild(dialog);

        // Add event listeners to dialog buttons
        const exportButton = dialog.querySelector('#export-button');
        exportButton.addEventListener('click', () => {
            const fontSizePreferences = { 'fontSize': fontSize };
            const jsonPreferences = JSON.stringify(fontSizePreferences);
            downloadSettings(jsonPreferences, 'font-size-preferences.json');
        });

        const importButton = dialog.querySelector('#import-button');
        importButton.addEventListener('click', () => {
            uploadSettings().then((jsonPreferences) => {
                const parsedPreferences = JSON.parse(jsonPreferences);
                const importedFontSize = parsedPreferences.fontSize;
                resizeText(importedFontSize);
                fontSize = importedFontSize;
                GM_setValue('fontSize', fontSize);
            });
        });

        const cancelButton = dialog.querySelector('#cancel-button');
        cancelButton.addEventListener('click', () => {
            dialog.close();
        });

        dialog.showModal();
    }

    // Download settings as JSON
    function downloadSettings(jsonData, filename) {
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = filename;
        link.href = url;
           link.click();
}

// Upload settings as JSON
function uploadSettings() {
    return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.addEventListener('change', () => {
            const reader = new FileReader();
            reader.onload = () => {
                const fileData = reader.result;
                resolve(fileData);
            };
            reader.readAsText(input.files[0]);
        });
        input.click();
    });
}

// Register menu command for resetting font size preferences
GM_registerMenuCommand('Reset Font Size Preferences', () => {
    fontSize = 16;
    resizeText(fontSize);
    GM_deleteValue('fontSize');
});
 })();