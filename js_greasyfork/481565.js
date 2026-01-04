// ==UserScript==
// @name         Twitter to Nitter Redirect
// @namespace    Shia Ali's
// @version      3.1.3
// @description  Redirects Twitter URLs to Nitter URLs
// @author       r7o1
// @match        https://twitter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481565/Twitter%20to%20Nitter%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/481565/Twitter%20to%20Nitter%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Redirect function
    function redirectToNitter() {
        var twitterUrl = window.location.href;
        var nitterUrl = twitterUrl.replace("twitter.com", "nitter.net");
        window.location.href = nitterUrl; // Redirect to Nitter URL
    }

    redirectToNitter(); // Call the redirect function
})();