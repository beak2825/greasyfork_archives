// ==UserScript==
// @name         Hide SoundCloud Comments and Waveform
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Hides SoundCloud comment popovers and waveform comments canvas
// @author       You
// @match        *://soundcloud.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524241/Hide%20SoundCloud%20Comments%20and%20Waveform.user.js
// @updateURL https://update.greasyfork.org/scripts/524241/Hide%20SoundCloud%20Comments%20and%20Waveform.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideElements() {
        // Hide comment popovers
        document.querySelectorAll('.commentPopover.medium.visible').forEach(el => {
            el.style.display = 'none';
        });

        // Hide waveform comments canvas
        document.querySelectorAll('canvas.waveformCommentsNode').forEach(el => {
            el.style.display = 'none';
        });
    }

    // Run initially
    hideElements();

    // Observe the DOM for dynamically added elements
    const observer = new MutationObserver(hideElements);
    observer.observe(document.body, { childList: true, subtree: true });

})();
