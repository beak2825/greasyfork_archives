// ==UserScript==
// @name         Udemy Video UI Hider
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Hides Udemy video UI controls, mouse cursor and allows both Numpad 0 and 0 key to restart the video instead of the useless player on udemy now.
// @author       Ahmed Ghareeb
// @match        https://www.udemy.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519289/Udemy%20Video%20UI%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/519289/Udemy%20Video%20UI%20Hider.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Selectors for elements to hide
    const selectors = [
        '.video-viewer--title-overlay--YZQuH', // Video title
        '.progress-bar--progress-bar-control--vhyIz', // Progress bar
        '.shaka-control-bar--control-bar-wrapper--QAdFg', // Control bar
        '#go-to-next-item', // Next video button
        '#go-to-previous-item' // Previous video button
    ];

    const idleDelay = 1500; // Idle time in milliseconds before hiding UI (faster than before)
    let mouseTimeout;

    // Function to hide UI elements and the mouse cursor
    const hideUI = () => {
        // Hide the UI elements
        selectors.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.opacity = '0';
                element.style.transition = 'opacity 0.2s'; // Faster transition for hiding UI
            }
        });

        // Hide mouse cursor
        document.body.style.cursor = 'none';
    };

    // Function to show UI elements
    const showUI = () => {
        // Show the UI elements
        selectors.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.opacity = '1';
            }
        });

        // Show mouse cursor
        document.body.style.cursor = 'auto';
    };

    // Event listener for mouse movement
    document.addEventListener('mousemove', () => {
        showUI(); // Show UI and mouse when mouse moves
        clearTimeout(mouseTimeout); // Reset timer
        mouseTimeout = setTimeout(hideUI, idleDelay); // Hide UI and mouse after idleDelay
    });

    // Ensure play/pause functionality works when clicking on the video
    document.addEventListener('click', (event) => {
        const videoElement = document.querySelector('video');
        if (videoElement && event.target.tagName === 'VIDEO') {
            if (videoElement.paused) {
                videoElement.play();
            } else {
                videoElement.pause();
            }
        }
    });

    // Add functionality to restart the video when Numpad 0 or Upper 0 is pressed
    document.addEventListener('keydown', (event) => {
        const videoElement = document.querySelector('video');
        // Check for Numpad 0 or regular 0 key
        if ((event.key === '0' && event.location === 3) || event.key === '0') {
            if (videoElement) {
                videoElement.currentTime = 0; // Restart the video
                videoElement.play(); // Play the video after restart
            }
        }
    });

    // Initially hide UI and cursor after idleDelay
    mouseTimeout = setTimeout(hideUI, idleDelay);
})();
