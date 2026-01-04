// ==UserScript==
// @name         Video Player Auto Focus (Generic)
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Sets focus to the first video player found on any page on page load for immediate keyboard control.
// @author       Your Name
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537574/Video%20Player%20Auto%20Focus%20%28Generic%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537574/Video%20Player%20Auto%20Focus%20%28Generic%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function focusFirstVideoPlayer() {
        // Find the first video element on the page
        const videoElement = document.querySelector('video');

        if (videoElement) {
            // Attempt to focus the video element
            videoElement.focus();
            console.log('Video Auto Focus: Fokus auf das erste <video> Element gesetzt.');
        } else {
            console.log('Video Auto Focus: Kein <video> Element auf der Seite gefunden.');
        }
    }

    // Use a MutationObserver to wait for a video element to be added to the DOM
    const observer = new MutationObserver((mutations, obs) => {
        const videoElement = document.querySelector('video');

        if (videoElement) {
            focusFirstVideoPlayer();
            obs.disconnect(); // Stop observing once an element is found and focused
        }
    });

    // Start observing the body for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Also try to focus after the window is fully loaded as a fallback
    // This might be useful for pages where the video is present on initial load
    window.addEventListener('load', () => {
        // Give a small delay to ensure elements are fully ready
        setTimeout(focusFirstVideoPlayer, 500);
    });

    // Also try focusing on DOMContentLoaded in case the video is available early
     window.addEventListener('DOMContentLoaded', () => {
        // Give a small delay
        setTimeout(focusFirstVideoPlayer, 100);
    });

})();