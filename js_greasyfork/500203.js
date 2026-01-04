// ==UserScript==
// @name          Scrolller.com Redirector
// @namespace     http://tampermonkey.net/
// @license       MIT
// @version       0.1
// @description   Redirect Scrolller subreddit pages to sorted and filtered view
// @icon          https://scrolller.com/assets/favicon-16x16.png
// @author        nkatshiba
// @match         https://scrolller.com/r/*
// @grant         none
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/500203/Scrolllercom%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/500203/Scrolllercom%20Redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the current URL
    var currentUrl = new URL(window.location.href);

    // Check if the URL already contains the desired parameters
    var params = currentUrl.searchParams;

    // Only add the parameters if they are not already set correctly
    var needsRedirect = false;
    if (params.get('sort') !== 'rising') {
        params.set('sort', 'rising');
        needsRedirect = true;
    }
    if (params.get('filter') !== 'videos') {
        params.set('filter', 'videos');
        needsRedirect = true;
    }

    // Construct the new URL if needed
    if (needsRedirect) {
        var newUrl = currentUrl.origin + currentUrl.pathname + '?' + params.toString();
        window.location.replace(newUrl);
    }
})();
