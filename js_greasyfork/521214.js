// ==UserScript==
// @name         MediaFire Error Redirect
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Redirects specific MediaFire error pages to a new URL with the extracted quickkey.
// @author       You
// @match        https://www.mediafire.com/error.php?errno=323&quickkey=*&origin=download
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521214/MediaFire%20Error%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/521214/MediaFire%20Error%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the current URL
    const currentUrl = window.location.href;

    // Ensure the URL matches the pattern
    const match = currentUrl.match(/quickkey=([^&]+)&origin=/);
    if (match) {
        const quickKey = match[1]; // Extract the quickkey

        // Construct the new URL
        const newUrl = `https://www.mediafire.com/?iqomgyms12u74oz,${quickKey}`;

        // Redirect to the new URL
        window.location.href = newUrl;
    }
})();
