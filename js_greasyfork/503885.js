// ==UserScript==
// @name         YouTube Video Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a download button to YouTube video descriptions
// @author       Your Name
// @match        https://www.youtube.com/watch*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503885/YouTube%20Video%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/503885/YouTube%20Video%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create the download button
    function createDownloadButton() {
        const descriptionBox = document.querySelector('#description');
        if (!descriptionBox) return;

        const downloadButton = document.createElement('button');
        downloadButton.innerText = 'Download';
        downloadButton.style.marginTop = '10px';
        downloadButton.style.padding = '10px';
        downloadButton.style.backgroundColor = '#ff0000';
        downloadButton.style.color = '#ffffff';
        downloadButton.style.border = 'none';
        downloadButton.style.cursor = 'pointer';

        downloadButton.addEventListener('click', () => {
            const videoUrl = window.location.href;
            const downloadUrl = `https://example.com/download?url=${encodeURIComponent(videoUrl)}`;
            window.open(downloadUrl, '_blank');
        });

        descriptionBox.appendChild(downloadButton);
    }

    // Function to observe changes in the DOM
    function observeDOMChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    createDownloadButton();
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Initialize the script
    observeDOMChanges();
})();
