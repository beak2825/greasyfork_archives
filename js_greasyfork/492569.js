// ==UserScript==
// @name         Remove wxfollow Elements with Strict Check
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Remove elements with wxfollow class on https://www.mvcat.com/ with strict checking intervals
// @author       Theo Feng
// @match        https://www.mvcat.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492569/Remove%20wxfollow%20Elements%20with%20Strict%20Check.user.js
// @updateURL https://update.greasyfork.org/scripts/492569/Remove%20wxfollow%20Elements%20with%20Strict%20Check.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeWxFollowElements() {
        // Find all elements with the wxfollow class
        const elements = document.querySelectorAll('.wxfollow');

        // If found, remove them and reset the checking interval to 1 minute
        if (elements.length > 0) {
            elements.forEach(element => {
                element.remove();
            });
            clearInterval(checkInterval);
            checkInterval = setInterval(removeWxFollowElements, 60 * 1000); // 1 minute
        }
    }

    // Initial check on page load
    removeWxFollowElements();

    let checkInterval = setInterval(() => {
        removeWxFollowElements();
    }, 200); // 200 milliseconds
})();
