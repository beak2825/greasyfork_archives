// ==UserScript==
// @name         Reddit Redirector
// @namespace    https://greasyfork.org/
// @version      1.1
// @description  A simple script that automatically redirects Reddit links to a more privacy-focused alternative. libreddit.freedit.eu
// @author       Takomine
// @license      MIT
// @icon         https://www.iconpacks.net/icons/2/free-reddit-logo-icon-2436-thumb.png
// @match        *://*.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464475/Reddit%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/464475/Reddit%20Redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Redirect Reddit links to Teddit
    function redirectRedditToTeddit() {
        var currentHost = window.location.hostname;

        // If current host is "old.reddit.com", or "www.reddit.com", or "reddit.com", then redirect.
        if (currentHost.match(/^(old|www|)\.?reddit\.com$/)) {
            var newURL = location.protocol + '//libreddit.freedit.eu' + location.pathname + location.search;

            if (location.replace) {
                location.replace(newURL);
            } else {
                window.location.href = newURL;
            }
        }
    }

    // Call the redirect function
    redirectRedditToTeddit();

})();
