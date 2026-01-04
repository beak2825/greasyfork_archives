// ==UserScript==
// @name         YouTube Music Volume Slider Improvements
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds a static hover tooltip for the volume slider showing the current volume %, allows volume adjustment via Ctrl + scroll, and persists the volume across page reloads. Waits for the video player to load.
// @author       Cajunwildcat
// @match        https://music.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510640/YouTube%20Music%20Volume%20Slider%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/510640/YouTube%20Music%20Volume%20Slider%20Improvements.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const LOCAL_STORAGE_KEY = 'youtubeMusicVolume';

    // Create a tooltip element
    const tooltip = document.createElement('div');
    tooltip.style.position = 'absolute';
    tooltip.style.padding = '5px 10px';
    tooltip.style.backgroundColor = '#333';
    tooltip.style.color = '#fff';
    tooltip.style.borderRadius = '5px';
    tooltip.style.fontSize = '12px';
    tooltip.style.opacity = '0';
    tooltip.style.transition = 'opacity 0.2s';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.zIndex = '9999';

    document.body.appendChild(tooltip);

    // Find the volume slider
    const findVolumeSlider = () => document.querySelector("#volume-slider");
    let volumeSlider = findVolumeSlider();

    if (!volumeSlider) {
        // If the volume slider doesn't exist yet, wait for it to load
        const observer = new MutationObserver(() => {
            volumeSlider = findVolumeSlider();
            if (volumeSlider) {
                setupVolumeTooltip(volumeSlider);
                waitForVideoPlayer(); // Wait for video player to load and restore volume
                observer.disconnect(); // Stop observing once the slider is found
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    } else {
        setupVolumeTooltip(volumeSlider);
        waitForVideoPlayer(); // Wait for video player to load
    }

    function setupVolumeTooltip(slider) {
        // Position the tooltip above the volume slider
        const sliderRect = slider.getBoundingClientRect();
        tooltip.style.left = `${sliderRect.left + window.scrollX}px`;
        tooltip.style.top = `${sliderRect.top + window.scrollY - 30}px`; // Adjust to position above the slider
        tooltip.style.opacity = '0';

        // Function to update the tooltip's content
        const updateTooltip = (volume) => {
            tooltip.textContent = `Volume: ${volume}%`;
            tooltip.style.opacity = '1';
        };

        // Show tooltip on hover
        slider.addEventListener('mouseenter', () => {
            const currentVolume = Math.round(document.querySelector(".html5-video-player").getVolume());
            updateTooltip(currentVolume);
        });

        // Hide tooltip when not hovering
        slider.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });

        // Update the tooltip content while dragging the volume slider
        slider.addEventListener('input', () => {
            const currentVolume = Math.round(document.querySelector(".html5-video-player").getVolume());
            updateTooltip(currentVolume);
        });
    }

    // Ctrl + scroll to change the volume
    document.addEventListener('wheel', function(e) {
        // Check if the Ctrl key is held and the target is the volume slider
        if (e.ctrlKey && isVolumeSlider(e.target)) {
            e.preventDefault(); // Prevent the default behavior of scrolling

            let videoPlayer = document.querySelector(".html5-video-player");
            let currentVolume = Math.round(videoPlayer.getVolume());
            let newVolume = currentVolume + (e.deltaY > 0 ? -1 : 1); // Increment or decrement volume
            newVolume = Math.max(0, Math.min(newVolume, 100)); // Keep volume within 0 to 100

            videoPlayer.setVolume(newVolume); // Set the new volume
            volumeSlider.querySelector("#primaryProgress").style.transform = `scaleX(${newVolume / 100})`; // Update the slider bar progress
            volumeSlider.querySelector("#sliderKnob").style.left = `${newVolume}%`; // Update the knob position

            // Update the tooltip with the new volume
            tooltip.textContent = `Volume: ${newVolume}%`;
            tooltip.style.opacity = '1';

            // Save the volume to localStorage
            saveVolume(newVolume);
        }
    }, { passive: false });

    // Helper function to determine if the element is part of the volume slider
    function isVolumeSlider(element) {
        return element === volumeSlider.querySelector("#sliderBar");
    }

    // Save the current volume to localStorage
    function saveVolume(volume) {
        localStorage.setItem(LOCAL_STORAGE_KEY, volume);
    }

    // Wait for the video player to load and then restore the volume
    function waitForVideoPlayer() {
        const videoPlayer = document.querySelector(".html5-video-player");

        if (!videoPlayer) {
            // If the video player doesn't exist yet, use MutationObserver to wait for it to load
            const observer = new MutationObserver(() => {
                const player = document.querySelector(".html5-video-player");
                if (player) {
                    restoreVolume(); // Restore the volume once the player is available
                    observer.disconnect(); // Stop observing once the player is found
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
        } else {
            // If the video player is already available, restore the volume immediately
            restoreVolume();
        }
    }

    // Restore the volume from localStorage when the player loads
    function restoreVolume() {
        const savedVolume = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedVolume !== null) {
            let videoPlayer = document.querySelector(".html5-video-player");
            let volume = parseInt(savedVolume, 10);
            videoPlayer.setVolume(volume);
            volumeSlider.querySelector("#primaryProgress").style.transform = `scaleX(${volume / 100})`; // Update the slider bar progress
            volumeSlider.querySelector("#sliderKnob").style.left = `${volume}%`; // Update the knob position
        }
    }
})();
