// ==UserScript==
// @name         Hide YouTube Propaganda Box
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Hide the propaganda box on YouTube videos and remove clarify box
// @author       Free Your Mind Enterprises Inc.
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499244/Hide%20YouTube%20Propaganda%20Box.user.js
// @updateURL https://update.greasyfork.org/scripts/499244/Hide%20YouTube%20Propaganda%20Box.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide the propaganda box
    function hidePropagandaBox() {
        const propagandaBox = document.querySelector('.ytd-info-panel-content-renderer');
        if (propagandaBox) {
            propagandaBox.style.display = 'none';
        }

        const clarifyBox = document.getElementById('clarify-box');
        if (clarifyBox) {
            clarifyBox.remove();
        }
    }

    // Hide the box on page load
    window.addEventListener('load', hidePropagandaBox);

    // Hide the box on dynamic content changes
    const observer = new MutationObserver(hidePropagandaBox);
    observer.observe(document.body, { childList: true, subtree: true });
})();