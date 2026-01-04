// ==UserScript==
// @name         Safari Endless Scrolling
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Infinitely scroll through pages on Safari
// @match        https://*/*
// @match        http://*/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492034/Safari%20Endless%20Scrolling.user.js
// @updateURL https://update.greasyfork.org/scripts/492034/Safari%20Endless%20Scrolling.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set the distance from the bottom when to trigger the next page load
    var loadOffset = 2000;

    // Function to check if the user has reached the bottom of the page
    function nearBottomOfPage() {
        return $(window).scrollTop() > $(document).height() - $(window).height() - loadOffset;
    }

    // Function to load more content when near the bottom of the page
    function loadMoreContent() {
        // Simulate loading more content by scrolling to the bottom of the page
        window.scrollTo(0, document.body.scrollHeight);
    }

    // Load more content when the user scrolls near the bottom of the page
    $(window).scroll(function() {
        if (nearBottomOfPage()) {
            loadMoreContent();
        }
    });
})();