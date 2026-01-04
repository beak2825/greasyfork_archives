// ==UserScript==
// @name         Bing to Google Redirect
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Redirect Bing searches to Google
// @author       You
// @match        https://www.bing.com/search?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493032/Bing%20to%20Google%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/493032/Bing%20to%20Google%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the current URL
    let url = window.location.href;

    // Use URLSearchParams to parse the query parameters
    let params = new URLSearchParams(url.split('?')[1]);

    // Get the 'q' parameter
    let searchQuery = params.get('q');

    // If a 'q' parameter was found, redirect to Google
    if (searchQuery) {
        window.location.href = 'https://www.google.com/search?q=' + encodeURIComponent(searchQuery);
    }
})();
