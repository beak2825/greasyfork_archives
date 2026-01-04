// ==UserScript==
// @name         YouTube Download Button
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Adds a download button next to the settings icon on YouTube videos
// @author       @deamiware
// @license      MIT
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525816/YouTube%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/525816/YouTube%20Download%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addButton() {
        const buttonContainer = document.querySelector('.ytp-right-controls');
        if (!buttonContainer) return;

        if (document.getElementById('ytdDownloadButton')) return;

        const button = document.createElement('button');
        button.id = 'ytdDownloadButton';
        button.innerHTML = '⬇️ (Download)';
        button.style = `
            background: rgba(0, 123, 255, 0.7);
            border: none;
            color: white; 
            font-size: 14px; 
            cursor: pointer;
            border-radius: 5px;
            padding: 5px 10px; 
            transition: background-color 0.3s;
        `;

        button.onmouseover = function() {
            button.style.background = 'rgba(0, 123, 255, 1.0)';
        };
        button.onmouseout = function() {
            button.style.background = 'rgba(0, 123, 255, 0.7)';
        };

        button.addEventListener('click', () => {
            const videoId = getVideoIdFromUrl(window.location.href);
            if (videoId) {
                const videoLink = `https://www.youtube.com/watch?v=${videoId}`;
                const downloadUrl = `https://www.y2mate.com/en949?url=${videoLink}`;

                // Automatically copy the video link to clipboard
                navigator.clipboard.writeText(videoLink)
                    .then(() => console.log("Video link copied to clipboard!"))
                    .catch(err => console.error('Failed to copy: ', err));

                // Open the download URL
                window.open(downloadUrl, '_blank');
            }
        });

        buttonContainer.prepend(button);
    }

    function getVideoIdFromUrl(url) {
        const match = url.match(/[?&]v=([^&]+)/);
        return match ? match[1] : null;
    }

    function checkForPlayer() {
        const player = document.querySelector('#player');
        if (player) {
            addButton();
        } else {
            setTimeout(checkForPlayer, 1000);
        }
    }

    // Initial check for the player
    checkForPlayer();
})();