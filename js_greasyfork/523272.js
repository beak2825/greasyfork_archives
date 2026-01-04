// ==UserScript==
// @name         Bypass Xhamster Age Verification
// @namespace    http://tampermonkey.net/
// @version      2025-01-08
// @description  Allows you to skip the new age verification implemented by Xhamster.
// @author       You
// @match        https://xhamster.com/videos/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xhamster.com
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/523272/Bypass%20Xhamster%20Age%20Verification.user.js
// @updateURL https://update.greasyfork.org/scripts/523272/Bypass%20Xhamster%20Age%20Verification.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Extract the video ID from the URL
    const match = window.location.href.match(/\/videos\/.*?-(\w+)\?/);
    if (match && match[1]) {
        const videoId = match[1];
        // Redirect to the embed page with the extracted ID
        window.location.href = `https://xhamster.com/embed/${videoId}`;
    }
})();