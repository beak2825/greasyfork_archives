// ==UserScript==
// @name         Disable Click Pause on YouTube Live
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Prevent mouse click from pausing live YouTube streams
// @author       You
// @match        *://www.youtube.com/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532222/Disable%20Click%20Pause%20on%20YouTube%20Live.user.js
// @updateURL https://update.greasyfork.org/scripts/532222/Disable%20Click%20Pause%20on%20YouTube%20Live.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function isLiveStream() {
        const liveBadge = document.querySelector('.ytp-live-badge');
        return liveBadge && window.getComputedStyle(liveBadge).display !== 'none';
    }

    function disableClickPause() {
        window.addEventListener('click', event => {
            if (isLiveStream() && event.target.matches('video')) {
                event.stopPropagation();
            }
        }, true);
    }

    // Run when YouTube loads dynamically
    let observer = new MutationObserver(() => {
        if (isLiveStream()) {
            disableClickPause();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
