// ==UserScript==
// @name         Skip First 3 Seconds of Pornhub Videos
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically skip the first 3 seconds of every video on Pornhub when it starts playing.
// @author       Miro
// @match        *://*.pornhub.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496661/Skip%20First%203%20Seconds%20of%20Pornhub%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/496661/Skip%20First%203%20Seconds%20of%20Pornhub%20Videos.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function skipVideo(video) {
        if (video.currentTime < 3) {
            video.currentTime = 3;
        }
    }

    function setupSkip() {
        document.querySelectorAll('video').forEach(video => {
            video.addEventListener('play', () => skipVideo(video), { once: true });
        });
    }

    // Run setupSkip when the page is loaded
    window.addEventListener('load', setupSkip);

    // Observe the page for dynamically added videos
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeName === 'VIDEO') {
                    node.addEventListener('play', () => skipVideo(node), { once: true });
                } else if (node.querySelectorAll) {
                    node.querySelectorAll('video').forEach(video => {
                        video.addEventListener('play', () => skipVideo(video), { once: true });
                    });
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
})();
