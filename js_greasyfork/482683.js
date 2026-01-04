// ==UserScript==
// @name         TikTok to TikNot Redirect
// @author       Rust1667
// @description  Redirect TikTok to TikNot
// @match        https://www.tiktok.com/*
// @match        https://tiknot.netlify.app/*
// @run-at       document-start
// @version      1.2
// @grant        none
// @namespace https://greasyfork.org/users/980489
// @downloadURL https://update.greasyfork.org/scripts/482683/TikTok%20to%20TikNot%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/482683/TikTok%20to%20TikNot%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the current URL
    var currentUrl = decodeURIComponent(window.location.href);

    // Regular expression to match the TikTok URL pattern
    var tiktokRegex = /https:\/\/www\.tiktok\.com\/@.*\/video\/([0-9]+)/;

    // Extract the second * from the TikTok URL using regex
    var match = currentUrl.match(tiktokRegex);

    if (match && match[1]) {
        // Construct the new URL using the matched part of the original URL
        var redirectUrl = "https://tiknot.netlify.app/video/" + match[1];

        // Redirect the page to the new URL
        window.location.href = redirectUrl;
    }
})();
