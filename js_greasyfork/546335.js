// ==UserScript==
// @name         Remove ?tl= from Reddit links on Google
// @namespace    https://github.com/Mythos
// @version      1.1
// @description  Removes the ?tl= parameter from Reddit search result links on Google
// @author       Mythos
// @license      MIT
// @match        https://www.google.com/search*
// @match        https://www.google.*/*
// @grant        none
// @run-at       document-end
// @homepageURL  https://github.com/Mythos/userscripts
// @supportURL   https://github.com/Mythos/userscripts/issues
// @downloadURL https://update.greasyfork.org/scripts/546335/Remove%20tl%3D%20from%20Reddit%20links%20on%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/546335/Remove%20tl%3D%20from%20Reddit%20links%20on%20Google.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const parameterName = 'tl';
    function cleanLinks() {
        document.querySelectorAll('a[href*="reddit.com"]').forEach(a => {
            try {
                let url = new URL(a.href);
                if (url.searchParams.has(parameterName)) {
                    url.searchParams.delete(parameterName);
                    a.href = url.toString();
                }
            } catch (e) {
            }
        });
    }

    cleanLinks();

    // Observe dynamically loaded search results
    const observer = new MutationObserver(cleanLinks);
    observer.observe(document.body, { childList: true, subtree: true });
})();
