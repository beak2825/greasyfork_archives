// ==UserScript==
// @name         Bing Image Creator Image and Prompt Downloader
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Download full-size images from Bing and make the filename the initial image prompt
// @author       quackfiend
// @match        https://www.bing.com/images/create*
// @grant        GM_download
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/480058/Bing%20Image%20Creator%20Image%20and%20Prompt%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/480058/Bing%20Image%20Creator%20Image%20and%20Prompt%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to sanitize text to be used in filenames
    function sanitizeFilename(text) {
        return text.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    }

    // Function to modify the URL for the full-size image and download it
    function downloadFullSizeImage(thumbnail, index) {
        let fullSizeImageUrl = thumbnail.src.replace(/w=\d+/, 'w=1024').replace(/h=\d+/, 'h=1024');
        let promptText = sanitizeFilename(thumbnail.alt || 'image');
        let filename = promptText + '.jpg'; // Adding index to the filename
        GM_download({
            url: fullSizeImageUrl,
            name: filename
        });
    }

    // Function to add a centered save button to the page
    function addSaveButton() {
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save Image(s)';
        saveButton.style.position = 'fixed';
        saveButton.style.top = '5px';
        saveButton.style.left = '50%';
        saveButton.style.transform = 'translateX(-50%)';
        saveButton.style.zIndex = '1000';
        saveButton.style.padding = '10px 20px';
        saveButton.style.fontSize = '16px';
        saveButton.style.cursor = 'pointer';
        saveButton.addEventListener('click', function() {
            const thumbnails = document.querySelectorAll('img.mimg, img.gir_mmimg'); // Targeting both selectors
            thumbnails.forEach((thumbnail, index) => {
                downloadFullSizeImage(thumbnail, index);
            });
        });
        document.body.appendChild(saveButton);
    }

    // Add the centered save button to the page
    addSaveButton();
})();
