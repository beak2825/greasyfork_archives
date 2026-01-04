// ==UserScript==
// @name         Aria2C Cookie - IA
// @namespace    http://tampermonkey.net/
// @version      2025-07-08
// @description  A userscript for IA cookies.
// @author       You
// @match        https://archive.org/download/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        none
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/542015/Aria2C%20Cookie%20-%20IA.user.js
// @updateURL https://update.greasyfork.org/scripts/542015/Aria2C%20Cookie%20-%20IA.meta.js
// ==/UserScript==

(function() {
    (async () => {
    'use strict';

    const cookies = document.cookie;

    // Create button
    const btn = document.createElement('button');
    btn.textContent = 'Save Cookies to File';
    btn.style.position = 'fixed';
    btn.style.top = '10px';
    btn.style.right = '10px';
    btn.style.zIndex = 9999;
    btn.style.padding = '10px';
    document.body.appendChild(btn);

    btn.onclick = async () => {
        try {
            // Show save file picker
            const handle = await window.showSaveFilePicker({
                suggestedName: 'archive_cookies.txt',
                types: [{
                    description: 'Text Files',
                    accept: {'text/plain': ['.txt']},
                }],
            });

            const writable = await handle.createWritable();
            await writable.write(cookies);
            await writable.close();
            alert('Cookies saved successfully!');
        } catch (e) {
            alert('Save cancelled or failed: ' + e.message);
        }
    };
})();

})();