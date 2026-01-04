// ==UserScript==
// @name        Gimkit Modded File Copier
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds a button to download and modify game files before saving
// @author       You
// @match        *://*/*
// @grant        GM_download
// @grant        GM_info
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/504322/Gimkit%20Modded%20File%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/504322/Gimkit%20Modded%20File%20Copier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to modify file contents (example for JSON files)
    function modifyFileContent(fileName, fileContent) {
        if (fileName.endsWith('.json')) {
            let json = JSON.parse(fileContent);
            // Example modification: add a new property
            json.modified = true;
            return JSON.stringify(json, null, 2);
        }
        return fileContent; // No modification for other file types
    }

    // Function to download and modify files
    function downloadAndModifyFiles() {
        // List of file URLs (replace with actual URLs if needed)
        let files = [
            { url: 'https://example.com/game-file1.json', name: 'game-file1.json' },
            { url: 'https://example.com/game-file2.txt', name: 'game-file2.txt' }
        ];

        const zip = new JSZip();
        let fetchPromises = [];

        files.forEach(file => {
            let fetchPromise = fetch(file.url)
                .then(response => response.text()) // Use text() to handle JSON and text files
                .then(content => {
                    let modifiedContent = modifyFileContent(file.name, content);
                    zip.file(file.name, modifiedContent);
                });
            fetchPromises.push(fetchPromise);
        });

        // Wait for all fetch requests to complete
        Promise.all(fetchPromises).then(() => {
            // Generate the ZIP file and save it
            zip.generateAsync({ type: "blob" })
                .then(content => {
                    saveAs(content, "modded-files.zip");
                });
        });
    }

    // Add a button to trigger file download and modification
    let button = document.createElement('button');
    button.textContent = 'Download and Modify Files';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = '9999';
    button.style.padding = '10px';
    button.style.backgroundColor = '#007BFF';
    button.style.color = '#FFFFFF';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    document.body.appendChild(button);

    button.addEventListener('click', downloadAndModifyFiles);
})();
