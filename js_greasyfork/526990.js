// ==UserScript==
// @name         YouTube Unlimited Speed Changer
// @namespace    http://tampermonkey.net/
// @version      2025-02-15
// @description  Increase or decrease speed using [ and ], without limit in increments of 0.5
// @author       Zentico
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526990/YouTube%20Unlimited%20Speed%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/526990/YouTube%20Unlimited%20Speed%20Changer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to set playback rate by a given change value and show overlay
    function setPlaybackRate(change) {
        let player = document.querySelector('video');
        if (player) {
            player.playbackRate += change;
            showOverlay(player.playbackRate);
        }
    }

    // Function to show a temporary graphical overlay on the video
    function showOverlay(rate) {
        let video = document.querySelector('video');
        if (!video) return;

        // Try to find an existing overlay
        let overlay = document.querySelector('.playback-overlay');
        if (!overlay) {
            // Create the overlay if it doesn't exist
            overlay = document.createElement('div');
            overlay.className = 'playback-overlay';
            // Basic styling for the overlay
            overlay.style.position = 'absolute';
            overlay.style.top = '10px';
            overlay.style.right = '10px';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            overlay.style.color = '#fff';
            overlay.style.padding = '5px 10px';
            overlay.style.borderRadius = '4px';
            overlay.style.fontSize = '16px';
            overlay.style.zIndex = '10000';
            // Ensure the video container is positioned relatively so the overlay is placed correctly
            if (video.parentElement) {
                video.parentElement.style.position = 'relative';
                video.parentElement.appendChild(overlay);
            } else {
                document.body.appendChild(overlay);
            }
        }
        // Update the overlay with the new speed value
        overlay.textContent = `Speed: ${rate.toFixed(1)}x`;

        // Clear any existing timeout to allow rapid changes without flickering
        if (overlay.dismissTimeout) clearTimeout(overlay.dismissTimeout);
        // Remove the overlay after 1.5 seconds
        overlay.dismissTimeout = setTimeout(() => {
            overlay.remove();
        }, 1500);
    }

    // Event listener for key presses to change playback rate
    document.addEventListener('keydown', function(event) {
        if (event.key === '[') {
            setPlaybackRate(-0.5);
        }
        if (event.key === ']') {
            setPlaybackRate(+0.5);
        }
    });
})();
