// ==UserScript==
// @name        Fuck Reddit Karma + Extras (Old Reddit)
// @author      Unbroken
// @namespace   https://*.reddit.com
// @description Hides anything related to karma on Old.Reddit.
// @include     https://*.reddit.com/*
// @version     2.07
// @icon        https://www.google.com/s2/favicons?domain=www.reddit.com
// @grant       none
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/390356/Fuck%20Reddit%20Karma%20%2B%20Extras%20%28Old%20Reddit%29.user.js
// @updateURL https://update.greasyfork.org/scripts/390356/Fuck%20Reddit%20Karma%20%2B%20Extras%20%28Old%20Reddit%29.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Function to hide the message count
    function hideGarbage() {
        const messageCount = $('.message-count.badge-count');
        if (messageCount.length) {
            messageCount.hide(); // Hide the element
        }

        //This section hides anything related to "Karma"
        $(".arrow").css("display", "none");
        $(".score").css("display", "none");
        $(".rank").css("display", "none");
        $(".karma").css("display", "none");
        $(".userkarma").css("display", "none");

        $("span:contains('[score hidden]')").css("display", "none");

        //This section hides the secret santa garbage
        $(".hohoho-header").css("display", "none");
        $(".hohoho").css("display", "none");

        //This section will hide any other reddit nonsense
        $("#header-img").css("display", "none");
        $(".ad-container").css("display", "none");
        $(".premium-banner-outer").css("display", "none");
        $(".promoted").css("display", "none");
        $(".awarding-icon-container").css("display", "none");

        //This will hide the new stupid notifications bell
        $("#notifications").css("display", "none");
    }

    // Create a MutationObserver to watch for changes in the body
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            hideGarbage(); // Call the function on each mutation
        });
    });

    // Start observing the body for child node changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial check
    hideGarbage();
})();