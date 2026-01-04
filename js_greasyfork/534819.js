// ==UserScript==
// @name         YouSnatch - YouTube Video Downloader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a download button next to YouTube's volume control
// @author       You
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/534819/YouSnatch%20-%20YouTube%20Video%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/534819/YouSnatch%20-%20YouTube%20Video%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create the download button
    function createDownloadButton() {
        const button = document.createElement('button');
        button.textContent = 'YouSnatch';
        button.style.backgroundColor = '#FF5C00';  // Color
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.padding = '5px 10px';
        button.style.fontSize = '14px';
        button.style.cursor = 'pointer';
        button.style.marginLeft = '10px';
        button.style.borderRadius = '4px';
        button.setAttribute('title', 'Download Video');
        button.setAttribute('aria-label', 'Download Video');

        // Add functionality for video download (stub)
        button.addEventListener('click', () => {
            alert("Downloading the highest quality video...");
            // Video download logic will go here
        });

        return button;
    }

    // Function to insert the button next to the volume control
    function insertButtonNextToVolume() {
        const volumePanel = document.querySelector('.ytp-volume-panel');

        if (volumePanel) {
            const button = createDownloadButton();
            if (!document.querySelector('.yousnatch-btn')) {  // Prevent multiple button creations
                button.classList.add('yousnatch-btn');  // Add a class for reference
                volumePanel.appendChild(button);  // Append the button next to the volume
            }
        } else {
            // If volume panel is not found, wait a little and try again
            setTimeout(insertButtonNextToVolume, 1000);
        }
    }

    // Insert button after the page is fully loaded
    window.addEventListener('load', () => {
        insertButtonNextToVolume();
    });
})();
