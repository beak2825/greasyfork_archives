// ==UserScript==
// @name         Hide Paid Promotion Warning YouTube Videos
// @namespace   https://greasyfork.org/en/users/1200587-trilla-g
// @version      1.0
// @description  Hide .ytInlinePlayerControlsTopLeftControls and .ytp-paid-content-overlay on YouTube videos and thumbnails
// @author       Trilla_G
// @match        https://www.youtube.com/*
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/534108/Hide%20Paid%20Promotion%20Warning%20YouTube%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/534108/Hide%20Paid%20Promotion%20Warning%20YouTube%20Videos.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const selectorsToHide = [
        '.ytInlinePlayerControlsTopLeftControls',
        '.ytp-paid-content-overlay'
    ];

    function hideElements() {
        selectorsToHide.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.style.display = 'none';
            });
        });
    }

    // Run once immediately
    hideElements();

    // Watch for dynamically loaded content
    const observer = new MutationObserver(() => {
        hideElements();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
