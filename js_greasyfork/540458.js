// ==UserScript==
// @name         Disable Ctrl+Arrows on YouTube
// @version      1.0
// @description  Disables Ctrl+Left and Ctrl+Right arrow key shortcuts on YouTube.
// @author       Takemi
// @match        *://www.youtube.com/*
// @match        *://m.youtube.com/*
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1487219
// @downloadURL https://update.greasyfork.org/scripts/540458/Disable%20Ctrl%2BArrows%20on%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/540458/Disable%20Ctrl%2BArrows%20on%20YouTube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function handleKeyDown(event) {
        if (event.ctrlKey) {
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                event.preventDefault();
                event.stopPropagation();
            }
        }
    }

    document.addEventListener('keydown', handleKeyDown, true);
})();