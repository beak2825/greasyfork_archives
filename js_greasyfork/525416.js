// ==UserScript==
// @name         YouTube Safari iOS PiP Block Unblocker
// @version      1.0
// @description  Unblocks the block of Picture-in-Picture mode for m.youtube.com on Safari iOS. Works as of 2025-01-31.
// @author       ILoveYouTube
// @match        https://m.youtube.com/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1429466
// @downloadURL https://update.greasyfork.org/scripts/525416/YouTube%20Safari%20iOS%20PiP%20Block%20Unblocker.user.js
// @updateURL https://update.greasyfork.org/scripts/525416/YouTube%20Safari%20iOS%20PiP%20Block%20Unblocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // iOS Safari needs a user interaction first before we can modify video elements
    document.addEventListener('touchstart', function initOnTouch() {
        let v = document.querySelector('video');
        if (v) {
            v.addEventListener('webkitpresentationmodechanged', (e)=>e.stopPropagation(), true);
            // Remove the touchstart listener after we've initialized
            document.removeEventListener('touchstart', initOnTouch);
        }
    }, true);
})();