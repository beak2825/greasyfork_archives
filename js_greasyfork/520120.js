// ==UserScript==
// @name         YouTube Video Hider Shift+Space
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Persistently toggle the opacity of YouTube video elements with Shift+Space. won't reduce internet usage.
// @author       Sina Yaqubi
// @match        *://*.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520120/YouTube%20Video%20Hider%20Shift%2BSpace.user.js
// @updateURL https://update.greasyfork.org/scripts/520120/YouTube%20Video%20Hider%20Shift%2BSpace.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'userScript_youtubeVideoHidden_67x812b';

    // Function to apply the saved state
    function applyState() {
        const videoElement = document.querySelector('.html5-video-container > video');
        if (videoElement) {
            const isHidden = localStorage.getItem(STORAGE_KEY) === 'true';
            videoElement.style.opacity = isHidden ? '0' : ''; // Hide or reset opacity
        }
    }

    // Function to toggle the visibility state
    function toggleState() {
        const currentState = localStorage.getItem(STORAGE_KEY) === 'true';
        const newState = !currentState;
        localStorage.setItem(STORAGE_KEY, newState.toString());
        applyState();
    }

    // Apply the state when the page loads
    window.addEventListener('load', applyState);

    // Listen for the shortcut key
    document.addEventListener('keydown', (event) => {
        if (event.key === ' ' && event.shiftKey) {
            event.preventDefault(); // Prevent default behavior
            toggleState();
        }
    });
})();
