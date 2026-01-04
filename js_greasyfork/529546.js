// ==UserScript==
// @name         Youtube Scroll Volume
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hold Right-Click and Scroll to Adjust Volume on Youtube. (MADE WITH CHATGPT)
// @author       YIKIKRULES (or ChatGPT)
// @match        *://www.youtube.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529546/Youtube%20Scroll%20Volume.user.js
// @updateURL https://update.greasyfork.org/scripts/529546/Youtube%20Scroll%20Volume.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let rightClickHeld = false;
    let volumeTimeout;

    // Function to adjust volume on mouse wheel scroll
    function adjustVolume(event) {
        if (rightClickHeld) {
            const videoPlayer = document.querySelector('.html5-video-player');
            if (videoPlayer) {
                const currentVolume = videoPlayer.getVolume(); // YouTube API volume range is 0-100
                const delta = event.deltaY;

                // Adjust volume in the YouTube player (range 0-100)
                let newVolume = currentVolume + (delta < 0 ? 1 : -1);
                newVolume = Math.max(0, Math.min(100, newVolume));
                videoPlayer.setVolume(newVolume);

                event.preventDefault(); // Prevent default scroll behavior

                // Show volume indicator
                showVolumeIndicator(newVolume);
            }
        }
    }

    function showVolumeIndicator(volume) {
        const player = document.querySelector(".html5-video-player");
        if (!player) return;

        let existingIndicator = document.querySelector("#customVolumeIndicator");
        if (existingIndicator) {
            clearTimeout(volumeTimeout);
            existingIndicator.remove();
        }

        let volumeIndicator = document.createElement("div");
        volumeIndicator.id = "customVolumeIndicator";
        volumeIndicator.textContent = `${volume}%`;
        volumeIndicator.style.cssText = `
            position: absolute;
            top: 15%;
            left: 50%;
            transform: translateX(-50%);
            padding: 10px 20px;
            font-size: 18px;
            font-weight: bold;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            border-radius: 8px;
            z-index: 9999;
            pointer-events: none;
        `;

        player.appendChild(volumeIndicator);

        volumeTimeout = setTimeout(() => {
            volumeIndicator.remove();
        }, 2000);
    }

    // Listen for mouse down event to detect right-click
    window.addEventListener('mousedown', function(event) {
        if (event.button === 2) { // Right mouse button
            rightClickHeld = true;
        }
    });

    // Listen for mouse up event to stop adjusting volume when right-click is released
    window.addEventListener('mouseup', function(event) {
        if (event.button === 2) { // Right mouse button
            rightClickHeld = false;
        }
    });

    // Attach event listener to the page to track scroll wheel events
    window.addEventListener('wheel', function(event) {
        if (event.target.tagName.toLowerCase() === 'video') {
            adjustVolume(event);
        }
    }, { passive: false });

})();
