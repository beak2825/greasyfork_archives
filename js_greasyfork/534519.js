// ==UserScript==
// @name         Universal Tracker Remover
// @namespace    https://cleanlinks.net/
// @version      1.0
// @description  Removes common tracking parameters (e.g., utm_source, fbclid, from) from all links and the browser address bar, on all websites.
// @author       DiCK
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534519/Universal%20Tracker%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/534519/Universal%20Tracker%20Remover.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // List of tracking parameters to remove
    const trackingParams = [
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_term',
        'utm_content',
        'fbclid',
        'gclid',
        'mc_cid',
        'mc_eid',
        'ref',
        'ref_',
        'from'
    ];

    // Remove trackers from a given URL string
    function removeTrackersFromUrl(urlString) {
        try {
            const url = new URL(urlString, window.location.origin);
            let modified = false;

            trackingParams.forEach(param => {
                if (url.searchParams.has(param)) {
                    url.searchParams.delete(param);
                    modified = true;
                }
            });

            return modified ? url.toString() : urlString;
        } catch (e) {
            // Fail silently if invalid URL
            return urlString;
        }
    }

    // Clean all anchor tags on the page
    function cleanLinks() {
        const links = document.querySelectorAll('a[href*="?"], a[href*="&"]');

        links.forEach(link => {
            const cleaned = removeTrackersFromUrl(link.href);
            if (cleaned !== link.href) {
                link.href = cleaned;
            }
        });
    }

    // Clean the browser address bar (without reloading the page)
    function cleanAddressBar() {
        const currentUrl = window.location.href;
        const cleaned = removeTrackersFromUrl(currentUrl);

        if (cleaned !== currentUrl) {
            const urlObj = new URL(cleaned);
            const newUrl = urlObj.pathname + urlObj.search + urlObj.hash;
            window.history.replaceState(null, '', newUrl);
        }
    }

    // Run immediately
    cleanLinks();
    cleanAddressBar();

    // Watch for dynamic changes (e.g., AJAX navigation)
    const observer = new MutationObserver(() => {
        cleanLinks();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
