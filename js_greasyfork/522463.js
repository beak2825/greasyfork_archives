// ==UserScript==
// @name         YouTube Redirect Remover
// @version      1.0
// @description  Remove the annoying "Are you sure you want to leave YouTube?"
// @author       yodaluca23
// @license      GNU GPLv3
// @match        *://www.youtube.com/redirect*
// @namespace https://greasyfork.org/users/1315976
// @downloadURL https://update.greasyfork.org/scripts/522463/YouTube%20Redirect%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/522463/YouTube%20Redirect%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentUrl = window.location.href;
    // Check if the URL contains the "?q=" parameter
    const urlParams = new URLSearchParams(window.location.search);
    const targetUrl = urlParams.get('q');

    if (targetUrl) {
        // Decode the URL
        const decodedUrl = decodeURIComponent(targetUrl);

        // Redirect the browser to the decoded URL
        window.location.href = decodedUrl;
    } else {
        console.error('No "q" parameter found in the URL.');
    }
})();
