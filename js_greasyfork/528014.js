// ==UserScript==
// @name         Remove Google Translate Parameter from Reddit URLs
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove the "?tl=nl" parameter from Reddit URLs to get the untranslated page
// @author       You
// @match        https://www.reddit.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528014/Remove%20Google%20Translate%20Parameter%20from%20Reddit%20URLs.user.js
// @updateURL https://update.greasyfork.org/scripts/528014/Remove%20Google%20Translate%20Parameter%20from%20Reddit%20URLs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the current URL
    const url = new URL(window.location.href);

    // Check if the 'tl' query parameter is set to 'nl'
    if (url.searchParams.get('tl') === 'nl') {
        // Remove the 'tl' parameter
        url.searchParams.delete('tl');

        // Replace the current history entry with the new URL without the 'tl' parameter
        history.replaceState(null, '', url.toString());

        // Redirect to the new URL (the untranslated version)
        window.location.replace(url.toString());
    }
})();
