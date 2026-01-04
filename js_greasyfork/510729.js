// ==UserScript==
// @name         YouTube Volume Fine Adjustment
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Change YouTube volume by 1 when holding Ctrl and scrolling on the volume slider
// @author       Cajunwildcat
// @match        https://www.youtube.com/watch*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/510729/YouTube%20Volume%20Fine%20Adjustment.user.js
// @updateURL https://update.greasyfork.org/scripts/510729/YouTube%20Volume%20Fine%20Adjustment.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Wait until the YouTube player and volume slider are ready
    const checkPlayerReady = setInterval(() => {
        const videoPlayer = document.querySelector(".html5-video-player");
        const volumeSlider = document.querySelector(".ytp-volume-area");

        if (videoPlayer && volumeSlider) {
            clearInterval(checkPlayerReady);

            // Function to update the tooltip with current volume percentage
            const updateVolumeTooltip = () => {
                let currentVolume = videoPlayer.getVolume(); // Get current volume (0-100)
                let volumePercentage = Math.round(currentVolume); // Round to nearest integer

                // Find the tooltip element, YouTube uses the class "ytp-tooltip-text"
                let tooltip = document.querySelector(".ytp-tooltip-text");
                if (tooltip) {
                    tooltip.textContent = `Volume: ${volumePercentage}%`; // Update tooltip text
                }
            };

            // Attach the event listener directly to the volume slider area in the capture phase
            volumeSlider.addEventListener('wheel', function (e) {
                // Check if the Ctrl key is held
                if (e.ctrlKey) {
                    e.stopPropagation(); // Stop the event from propagating
                    e.preventDefault();   // Prevent the default volume change behavior of YouTube

                    // Get the current volume
                    let currentVolume = videoPlayer.getVolume();
                    let newVolume = currentVolume + (e.deltaY > 0 ? -1 : 1);

                    // Clamp the volume between 0 and 100
                    if (newVolume < 0 || newVolume > 100) return;

                    // Set the new volume
                    videoPlayer.setVolume(newVolume);

                    // Update the tooltip to reflect the new volume
                    updateVolumeTooltip();
                }
            }, { passive: false, capture: true });  // Using capture phase

            // Monitor volume changes and update the tooltip when volume is changed
            videoPlayer.addEventListener("onVolumeChange", updateVolumeTooltip);

            // Update the tooltip when the user hovers over the volume slider
            volumeSlider.addEventListener("mouseenter", updateVolumeTooltip);

            // Ensure tooltip is always updated when manually changing volume via slider
            volumeSlider.addEventListener("input", updateVolumeTooltip);

            // Update the tooltip on initialization to show the current volume
            updateVolumeTooltip();
        }
    }, 500);  // Poll every 500ms until the player is found
})();
