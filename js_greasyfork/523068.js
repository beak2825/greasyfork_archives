// ==UserScript==
// @name         Blur YouTube Videos with Shortcut
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Apply a 100px blur effect to YouTube videos with Alt+Y
// @author       Drewby123
// @match        *://www.youtube.com/*
// @license      MIT    
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523068/Blur%20YouTube%20Videos%20with%20Shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/523068/Blur%20YouTube%20Videos%20with%20Shortcut.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let isBlurred = false; // Track the blur state

    // Function to toggle the blur effect
    function toggleBlur() {
        const videos = document.querySelectorAll('video');
        isBlurred = !isBlurred;
        const blurValue = isBlurred ? 'blur(100px)' : 'none'; // Toggle blur
        videos.forEach(video => {
            video.style.filter = blurValue;
            video.style.transition = 'filter 0.5s'; // Smooth transition
        });
    }

    // Event listener for Alt+Y
    document.addEventListener('keydown', event => {
        if (event.altKey && event.key.toLowerCase() === 'y') {
            toggleBlur();
        }
    });

    // Apply blur to dynamically loaded videos
    const observer = new MutationObserver(() => {
        if (isBlurred) {
            const videos = document.querySelectorAll('video');
            videos.forEach(video => {
                video.style.filter = 'blur(100px)';
                video.style.transition = 'filter 0.5s';
            });
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
