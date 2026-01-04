// ==UserScript==
// @name         Redirect to TikNot
// @author       Nootish
// @description  Redirect TikTok to TikNot
// @match        https://www.tiktok.com/*
// @match        https://tiknot.netlify.app/*
// @run-at       document-start
// @version      1.0
// @grant        none
// @namespace https://gitlab.com/nootish/redirect-to-tiknot-script
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522618/Redirect%20to%20TikNot.user.js
// @updateURL https://update.greasyfork.org/scripts/522618/Redirect%20to%20TikNot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the current URL
    var currentUrl = decodeURIComponent(window.location.href);

    // Regular expression to match the TikTok URL pattern
    var tiktokRegex = /https:\/\/www\.tiktok\.com\/@.*\/(video|photo)\/([0-9]+)/;

    // Extract the second * from the TikTok URL using regex
    var match = currentUrl.match(tiktokRegex);
    console.log(match);

    if (match && match[1]) {
        // Construct the new URL using the matched part of the original URL
        var redirectUrl = "https://tiknot.netlify.app/video/" + match[2];

        // Redirect the page to the new URL
        window.location.href = redirectUrl;
    }
})();
