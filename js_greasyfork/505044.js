// ==UserScript==
// @name         YouTube Music Loop Toggle
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Adds a checkbox bottom right, once enabled, it'll loop without it stopping
// @author       Emree.el on instagraaammmmmm :D
// @match        https://music.youtube.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505044/YouTube%20Music%20Loop%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/505044/YouTube%20Music%20Loop%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create and style the checkbox
    const createCheckbox = () => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.style.position = 'fixed';
        checkbox.style.bottom = '100px'; // Further adjusted position
        checkbox.style.right = '20px';
        checkbox.style.zIndex = '1000';
        checkbox.id = 'yt-loop-checkbox';
        return checkbox;
    };

    // Load the saved state from local storage
    const loadState = () => {
        const checkbox = document.getElementById('yt-loop-checkbox');
        const savedState = localStorage.getItem('ytLoopState');
        checkbox.checked = savedState === 'true';
        return checkbox.checked;
    };

    // Save the state to local storage
    const saveState = (state) => {
        localStorage.setItem('ytLoopState', state);
    };

    // Handle the looping logic
    const handleLoop = () => {
        const checkbox = document.getElementById('yt-loop-checkbox');
        const player = document.querySelector('video');

        if (player) {
            player.loop = checkbox.checked;
        }
    };

    // Initialize script
    const init = () => {
        const checkbox = createCheckbox();
        document.body.appendChild(checkbox);

        // Load and apply the saved state
        const isLooping = loadState();
        checkbox.checked = isLooping;
        handleLoop();

        // Add event listener to handle checkbox changes
        checkbox.addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            saveState(isChecked);
            handleLoop();
        });

        // Observe changes to the video element to apply looping
        const observer = new MutationObserver(() => {
            handleLoop();
        });

        observer.observe(document.body, { childList: true, subtree: true });
    };

    // Wait for the page to fully load before initializing
    window.addEventListener('load', init);
})();
