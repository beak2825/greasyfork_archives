// ==UserScript==
// @name         iCloud Beta Redirect
// @version      1.1
// @author       SpotlightForBugs
// @description  Automatically redirect www.icloud.com to beta.icloud.com.
// @match        *://www.icloud.com/*
// @run-at       document-start
// @namespace    https://greasyfork.org/en/users/1412746-spotlightforbugs
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521154/iCloud%20Beta%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/521154/iCloud%20Beta%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check if the URL matches the target pattern
    function checkURL(url) {
        return url.startsWith('https://www.icloud.com');
    }

    // Function to convert the URL to the beta subdomain
    function newURL(url) {
        return url.replace('www.icloud.com', 'beta.icloud.com');
    }

    // Perform the redirection if the current URL matches
    if (checkURL(window.location.href)) {
        window.location.replace(newURL(window.location.href));
    }
})();
