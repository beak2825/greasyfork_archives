// ==UserScript==
// @name         Goodreads URL Cleaner
// @namespace    https://greasyfork.org/en/users/807108-jeremy-r
// @version      1.0
// @description  Cleans book URLs in Goodreads search results
// @author       JRem
// @match        https://www.goodreads.com/search?*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531583/Goodreads%20URL%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/531583/Goodreads%20URL%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function cleanURLs() {
        document.querySelectorAll('.tableList a').forEach(link => {
            let cleanHref = link.href.split('?')[0];
            link.href = cleanHref;
        });
    }

    // Run on page load
    cleanURLs();

    // Run again if content updates dynamically
    const observer = new MutationObserver(cleanURLs);
    observer.observe(document.body, { childList: true, subtree: true });
})();
