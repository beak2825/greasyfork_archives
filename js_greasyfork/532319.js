// ==UserScript==
// @name         404 to Archive Redirecter
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Detects 404/Not Found pages and redirects to the archived version on archive.org
// @author       Patryk Kordisch
// @match        *://*/*
// @run-at       document-end
// @exclude      *://web.archive.org/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532319/404%20to%20Archive%20Redirecter.user.js
// @updateURL https://update.greasyfork.org/scripts/532319/404%20to%20Archive%20Redirecter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function is404Page() {

        // Check HTTP Status Code using Performance API
        const navEntries = window.performance.getEntriesByType('navigation');
        if (navEntries.length > 0 && navEntries[0].responseStatus === 404) {
            return true;
        }
        return false;
    }


    // Confirmation dialog
    function offerRedirect(archiveUrl) {
        if (confirm(`This appears to be a missing page.\n\nWould you like to view an archived version?`)) {
            window.location.href = archiveUrl;
        }
    }


    // If the current page qualifies as a 404 and user confirms it, he gets redirected to the archive
    setTimeout(() => {
        if (is404Page()) {
            // Get URL
            const currentUrl = window.location.href;
            const archiveUrl = "https://web.archive.org/web/" + currentUrl;

            setTimeout(() => offerRedirect(archiveUrl), 500);
        }
    }, 2000);

})();