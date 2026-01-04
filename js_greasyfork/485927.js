// ==UserScript==
// @name         Arknights Fandom Redirect
// @namespace    http://tampermonkey.net/
// @version      2024-01-29
// @description  Redirect Arknights Fandom links to Arknights Wiki.gg
// @author       Zephyr Embyr
// @match        *://arknights.fandom.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485927/Arknights%20Fandom%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/485927/Arknights%20Fandom%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the current URL
    const currentURL = window.location.href;

    // Check if the URL contains "arknights.fandom.com"
    if (currentURL.includes("arknights.fandom.com")) {
        // Replace "arknights.fandom.com" with "arknights.wiki.gg" in the URL
        const newURL = currentURL.replace("arknights.fandom.com", "arknights.wiki.gg");

        // Redirect to the new URL
        window.location.href = newURL;
    }
})();