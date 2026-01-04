// ==UserScript==
// @name         Reddit Translate Language Off
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Removes the "tl=es-es" (or any "tl=") parameter from Reddit URLs to disable the automatic translation from foreign language, and refreshes the page
// @author       matiasmacarioo
// @match        https://www.reddit.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512164/Reddit%20Translate%20Language%20Off.user.js
// @updateURL https://update.greasyfork.org/scripts/512164/Reddit%20Translate%20Language%20Off.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the current URL
    let currentUrl = new URL(window.location.href);

    // Check if the URL has the 'tl' parameter
    if (currentUrl.searchParams.has('tl')) {
        // Remove the 'tl' parameter
        currentUrl.searchParams.delete('tl');

        // Replace the current URL without reloading the page
        window.history.replaceState({}, '', currentUrl.toString());

        // Reload the page to clear cache and load the URL without the 'tl' parameter
        location.reload(true);
    }
})();
