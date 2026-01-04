// ==UserScript==
// @name         Redirect regional Google Scholar Profile to global site
// @namespace    https://tampermonkey.net/
// @version      1.1
// @description  Redirects "scholar.google.*" to "scholar.google.com"
// @author       jonbakerfish
// @include      https://scholar.google.*/citations?*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/517646/Redirect%20regional%20Google%20Scholar%20Profile%20to%20global%20site.user.js
// @updateURL https://update.greasyfork.org/scripts/517646/Redirect%20regional%20Google%20Scholar%20Profile%20to%20global%20site.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Run the script only if the current page is a Google Scholar profile but not on the correct domain
    if (window.location.hostname !== 'scholar.google.com') {
        // Extract the user_id from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('user');

        // If a user_id is found, show an alert and redirect to the correct domain
        if (userId) {
            const targetUrl = `https://scholar.google.com/citations?user=${userId}&hl=en`;
            window.location.href = targetUrl;
        }
    }
})();
