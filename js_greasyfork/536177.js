// ==UserScript==
// @name         Hide YouTube Like Button
// @namespace    http://tampermonkey.net/
// @version      2025-05-13
// @description  Hide the YouTube like button, because fuck 'em!
// @author       You
// @match        https://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/536177/Hide%20YouTube%20Like%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/536177/Hide%20YouTube%20Like%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hider() {
        var like = document.getElementsByClassName("ytLikeButtonViewModelHost");

        // Check if the like button exists and hide it
        if (like.length > 0) {
            like[0].style.display = 'none'; // Access the first element
        }
    }

    // MutationObserver to react to DOM changes
    const observer = new MutationObserver((mutations) => {
        hider();
    });

    // Start observing the document body for DOM changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    hider(); // Initial call to hide the button
})();
