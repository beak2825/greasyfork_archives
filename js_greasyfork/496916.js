// ==UserScript==
// @name         YouTube Anti-Anti-Adblock 2024
// @version      1.0
// @description  Simple YouTube Adblock popup bypass
// @author       daijro
// @license      MIT
// @match        *://*.youtube.com/watch*
// @grant        none
// @run-at       document-end
// @namespace https://greasyfork.org/users/795282
// @downloadURL https://update.greasyfork.org/scripts/496916/YouTube%20Anti-Anti-Adblock%202024.user.js
// @updateURL https://update.greasyfork.org/scripts/496916/YouTube%20Anti-Anti-Adblock%202024.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const video = document.querySelector('video');
    var oldPaused = video.paused;
    var pausedRecently = false;

    // Remove elements by selector and check if video is paused
    function handleElements(selector) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
            elements.forEach(el => el.remove());
            console.log('Removed elements');

            // Play the video
            if (video.paused && pausedRecently) {
                video.play();
                console.log('Unpausing video');
            }
        }
    }

    // Monitor DOM changes for popup
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (!oldPaused && video.paused) {
                pausedRecently = true;
                setTimeout(() => {
                    pausedRecently = false;
                }, 300); // reset after period
            }
            if (mutation.addedNodes.length) {
                handleElements('iron-a11y-announcer');
                handleElements('tp-yt-paper-dialog');
            }
            oldPaused = video.paused;
        });
    });

    const config = { childList: true, subtree: true };
    observer.observe(document.body, config);
})();