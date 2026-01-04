// ==UserScript==
// @name         YouTube Keyboard Controls: Rewind and Fast Forward 1 second (robust)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Use keys y and u to rewind and fast forward YouTube videos by 1 second
// @author       Your Name
// @match        *://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515134/YouTube%20Keyboard%20Controls%3A%20Rewind%20and%20Fast%20Forward%201%20second%20%28robust%29.user.js
// @updateURL https://update.greasyfork.org/scripts/515134/YouTube%20Keyboard%20Controls%3A%20Rewind%20and%20Fast%20Forward%201%20second%20%28robust%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const log = (...args) => console.log('[YT-1s-Skip]', ...args);
    const cooldown = 50; // milliseconds
    let lastPress = 0;

    function init() {
        if (window._ytKeyListenerAttached) return;

        log('attaching keydown listener');
        window._ytKeyListenerAttached = true;

        document.addEventListener('keydown', (event) => {
            const now = Date.now();

            // prevent interfering with input fields
            const active = document.activeElement;
            if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) return;

            // prevent repeat within cooldown period
            if (now - lastPress < cooldown) return;

            const video = document.querySelector('video');
            if (!video) return;

            if (event.key === 'y') {
                video.currentTime = Math.max(0, video.currentTime - 1);
                lastPress = now;
            } else if (event.key === 'u') {
                video.currentTime = Math.min(video.duration, video.currentTime + 1);
                lastPress = now;
            }
        });
    }

    // Run on load
    init();

    // Run again on page changes
    document.body.addEventListener('yt-navigate-finish', () => {
        window._ytKeyListenerAttached = false;
        init();
    });

    // Fallback: observe DOM changes to catch earlier
    const observer = new MutationObserver(() => {
        if (!window._ytKeyListenerAttached) {
            init();
        }
    });

    observer.observe(document, {
        childList: true,
        subtree: true,
    });
})();

