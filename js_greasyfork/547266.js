// ==UserScript==
// @name         Auto Unmute YouTube Videos
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Automatically unmutes YouTube videos when they load
// @author       Starzee
// @match        https://www.youtube.com/*
// @grant        none     
// @downloadURL https://update.greasyfork.org/scripts/547266/Auto%20Unmute%20YouTube%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/547266/Auto%20Unmute%20YouTube%20Videos.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to unmute the video
    function unmuteVideo() {
        const video = document.querySelector('video');
        if (video && video.muted) {
            video.muted = false;
        }
    }

    // Listen for changes in the page to catch dynamically loaded content
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                unmuteVideo();
            }
        }
    });

    // Start observing for changes in the DOM
    observer.observe(document.body, { childList: true, subtree: true });

    // Also, try unmuting the video when the page is loaded
    window.addEventListener('load', unmuteVideo);

    // Attempt to unmute video periodically in case it loads after a delay
    setInterval(unmuteVideo, 1000);
})();
