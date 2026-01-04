// ==UserScript==
// @name         Netflix Auto Skip BTK V1.12
// @namespace    https://github.com/MateoPalmeiro/Netflix-Auto-Skip-BTK
// @icon         https://raw.githubusercontent.com/MateoPalmeiro/Netflix-Auto-Skip-BTK/main/FlixIcon.png
// @version      1.12
// @description  Auto-skip Netflix recaps, intros, credits, and auto-advance to next episode.
// @match        http*://*.netflix.com/*
// @grant        none
// @run-at       document-idle
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/535353/Netflix%20Auto%20Skip%20BTK%20V112.user.js
// @updateURL https://update.greasyfork.org/scripts/535353/Netflix%20Auto%20Skip%20BTK%20V112.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Beware fellow one: modify these selectors at your own risk — you're about to embark on a warp-speed dive through Netflix’s fractal DOM corridors.
    // Netflix skip button hooks — extracted from their minified chaos of React props and data attributes
    const selectors = [
        // seamless next-episode buttons (draining vs standard)
        "[data-uia='next-episode-seamless-button']",
        "[data-uia='next-episode-seamless-button-draining']",
        // skip intro/recap overlay
        ".watch-video--skip-content-button",
        // legacy skip/preplay button in some layouts
        ".watch-video--skip-preplay-button"
    ];

    // Polling loop: every 300ms scan the DOM for any skip/next prompts
    // Faster polling just burns cycles; slower risks leaving intros unskipped, found myself the sweet spot
    setInterval(() => {
        for (const sel of selectors) {
            const btn = document.querySelector(sel);
            // Only trigger if element exists and is actually rendered
            if (btn && btn.offsetParent !== null) {
                // Simulate a click to skip or advance
                btn.click();
                // Bail out early to avoid multiple clicks in one cycle
                return;
            }
        }
    }, 300); // tweak at your own risk — Netflix DOM updates are a moving target

})();