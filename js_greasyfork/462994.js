// ==UserScript==
// @name         Instant Gaming Auto-Participate 2
// @namespace    https://www.instant-gaming.com/
// @version      1.0
// @description  Automatically clicks the participate button on Instant Gaming giveaways
// @author       Bing
// @match        https://www.instant-gaming.com/*/giveaway/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462994/Instant%20Gaming%20Auto-Participate%202.user.js
// @updateURL https://update.greasyfork.org/scripts/462994/Instant%20Gaming%20Auto-Participate%202.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Find the participate button element
    let button = document.querySelector(".button.validate");
    // If the button exists and is not disabled, click it
    if (button && !button.disabled) {
        button.click();
        // No alert message
    }
})();