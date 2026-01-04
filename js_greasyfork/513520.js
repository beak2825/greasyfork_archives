// ==UserScript==
// @name YouTube Speed-Adjusted Time Display
// @namespace http://tampermonkey.net/
// @version 1.2
// @description Shows speed-adjusted time for YouTube videos
// @author kavinned
// @match https://www.youtube.com/*
// @grant none
// @icon https://www.google.com/s2/favicons?sz=64&domain=YouTube.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513520/YouTube%20Speed-Adjusted%20Time%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/513520/YouTube%20Speed-Adjusted%20Time%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let updateInterval = null;

    function updateTimeDisplay() {
        const video = document.querySelector('video');
        if (!video) return;

        const speedDisplayContainer = document.querySelector('.speed-adjusted-time-container');
        const speedIndicator = document.querySelector('.speed-indicator');
        if (!speedDisplayContainer || !speedIndicator) return;

        const currentTime = video.currentTime;
        const duration = video.duration;
        const playbackRate = video.playbackRate;

        // Only update if we have valid numbers
        if (isNaN(currentTime) || isNaN(duration) || isNaN(playbackRate) || playbackRate === 0) return;

        const adjustedCurrentTime = currentTime / playbackRate;
        const adjustedDuration = duration / playbackRate;

        function formatTime(seconds) {
            if (isNaN(seconds) || !isFinite(seconds)) return "0:00";

            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = Math.floor(seconds % 60);

            if (hours > 0) {
                return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            } else {
                return `${minutes}:${secs.toString().padStart(2, '0')}`;
            }
        }

        try {
            // Update our custom display with the adjusted time format matching YouTube's
            speedDisplayContainer.textContent = `${formatTime(adjustedCurrentTime)} / ${formatTime(adjustedDuration)}`;

            // Update the speed indicator
            speedIndicator.textContent = `${playbackRate}×`;

            // Only show our display if playback rate is not 1x
            const displayElements = document.querySelectorAll('.speed-time-wrapper');
            displayElements.forEach(el => {
                el.style.display = playbackRate !== 1 ? 'flex' : 'none';
            });
        } catch (e) {
            console.error("Error updating time display:", e);
        }
    }

    function createSpeedTimeDisplay() {
        // Remove any existing display first
        const existingDisplay = document.querySelector('.speed-time-wrapper');
        if (existingDisplay) existingDisplay.remove();

        const timeDisplay = document.querySelector('.ytp-time-display');
        if (!timeDisplay) return;

        // Create wrapper for both time display and speed indicator
        const wrapper = document.createElement('div');
        wrapper.className = 'speed-time-wrapper';
        wrapper.style.display = 'none'; // Hidden by default, only show when speed isn't 1x
        wrapper.style.alignItems = 'center';
        wrapper.style.marginRight = '10px';
        wrapper.style.height = '1.5em'; // Set a fixed height that's less than the control bar height
        wrapper.style.lineHeight = '1.5em'; // Match line height to the height
        wrapper.style.alignSelf = 'center'; // Center vertically within parent
        wrapper.style.gap = '0.3em';

        // Create container for time display
        const speedDisplayContainer = document.createElement('div');
        speedDisplayContainer.className = 'speed-adjusted-time-container';
        speedDisplayContainer.style.color = 'white';
        speedDisplayContainer.style.fontSize = '1em';
        speedDisplayContainer.style.borderRadius = '4px';
        speedDisplayContainer.style.backgroundColor = 'rgba(33, 33, 33, 0.8)';
        speedDisplayContainer.style.border = '1px solid rgba(255, 255, 255, 0.2)';
        speedDisplayContainer.style.borderRight = 'none';
        speedDisplayContainer.style.padding = '4px 4px';
        speedDisplayContainer.style.height = '100%';
        speedDisplayContainer.style.display = 'flex';
        speedDisplayContainer.style.alignItems = 'center'; // Center text vertically

        // Create speed indicator
        const speedIndicator = document.createElement('div');
        speedIndicator.className = 'speed-indicator';
        speedIndicator.style.color = 'white';
        speedIndicator.style.fontSize = '1em';
        speedIndicator.style.borderRadius = '4px';
        speedIndicator.style.fontWeight = 'bold';
        speedIndicator.style.backgroundColor = '#5b8266';
        speedIndicator.style.border = '1px solid rgba(255, 255, 255, 0.2)';
        speedIndicator.style.borderLeft = 'none';
        speedIndicator.style.padding = '4px 4px';
        speedIndicator.style.height = '100%';
        speedIndicator.style.display = 'flex';
        speedIndicator.style.alignItems = 'center'; // Center text vertically

        // Assemble elements
        wrapper.appendChild(speedDisplayContainer);
        wrapper.appendChild(speedIndicator);

        // Insert before the time display for left positioning
        timeDisplay.parentNode.insertBefore(wrapper, timeDisplay);
        return speedDisplayContainer;
    }

    function startUpdates() {
        // Only start interval if not already running
        if (!updateInterval) {
            createSpeedTimeDisplay();
            updateInterval = setInterval(updateTimeDisplay, 500);
        }
    }

    function stopUpdates() {
        if (updateInterval) {
            clearInterval(updateInterval);
            updateInterval = null;

            // Clean up our display
            const existingDisplay = document.querySelector('.speed-time-wrapper');
            if (existingDisplay) existingDisplay.remove();
        }
    }

    // Watch for page navigation
    function checkForVideoPage() {
        if (window.location.pathname === '/watch') {
            startUpdates();
        } else {
            stopUpdates();
        }
    }

    // Check initially
    checkForVideoPage();

    // Listen for navigation events
    window.addEventListener('yt-navigate-start', stopUpdates);
    window.addEventListener('yt-navigate-finish', checkForVideoPage);

    // Create a better observer for YouTube's player
    const playerObserver = new MutationObserver(() => {
        if (window.location.pathname === '/watch') {
            if (document.querySelector('video') && !document.querySelector('.speed-time-wrapper')) {
                createSpeedTimeDisplay();
                updateTimeDisplay();
            }
        }
    });

    // Observe just the player area for better performance
    const observeTarget = document.querySelector('#player') || document.body;
    playerObserver.observe(observeTarget, {
        childList: true,
        subtree: true
    });

    // Listen for playback rate changes
    document.addEventListener('ratechange', () => {
        updateTimeDisplay();
        // Make sure display exists whenever playback rate changes
        if (!document.querySelector('.speed-time-wrapper')) {
            createSpeedTimeDisplay();
        }
    }, true);

    // Clean up when leaving the page
    window.addEventListener('beforeunload', () => {
        stopUpdates();
        playerObserver.disconnect();
    });
})();