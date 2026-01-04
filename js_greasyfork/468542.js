// ==UserScript==
// @name         Extract Magnet Links
// @namespace    huichen3161.top
// @version      1.0
// @description  Extracts magnet links for selected rows and copies them to clipboard
// @author       huichen3161
// @match        https://u9a9.*
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468542/Extract%20Magnet%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/468542/Extract%20Magnet%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a button for selecting rows and copying magnet links
    const button = document.createElement('button');
    button.innerHTML = 'Copy Magnet Links';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.zIndex = '9999';
    button.addEventListener('click', copyMagnetLinks);
    document.body.appendChild(button);

    // Function to extract magnet links
    function extractMagnetLinks() {
        const rows = document.querySelectorAll('tr.default'); // Adjust this selector according to the structure of the webpage

        rows.forEach(row => {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.style.marginRight = '5px';
            row.prepend(checkbox);
        });
    }

    // Function to copy selected magnet links to clipboard
    function copyMagnetLinks() {
        const selectedRows = document.querySelectorAll('tr.default input[type="checkbox"]:checked');

        const magnetLinks = [];
        selectedRows.forEach(row => {
            const link = row.parentNode.querySelector('a[href^="magnet:"]'); // Adjust this selector according to the structure of the webpage
            if (link) {
                magnetLinks.push(link.href);
            }
        });

        if (magnetLinks.length > 0) {
            const magnetLinksText = magnetLinks.join('\n');
            GM_setClipboard(magnetLinksText, 'text');
            alert('Magnet links copied to clipboard!');
        } else {
            alert('No magnet links found for the selected rows.');
        }
    }

    extractMagnetLinks();
})();
