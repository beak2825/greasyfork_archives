// ==UserScript==
// @name         Redirect m. to www. (with Weibo Fix)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Redirects mobile (m.) sites to their desktop (www.) versions, with a special rule for Weibo detail pages.
// @author       Continy
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541332/Redirect%20m%20to%20www%20%28with%20Weibo%20Fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541332/Redirect%20m%20to%20www%20%28with%20Weibo%20Fix%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const host = window.location.host;
    const path = window.location.pathname;

    // --- --- --- Rule 1: Special Case for Weibo Detail Pages --- --- ---
    // First, check for the most specific case.
    if (host === 'm.weibo.cn') {
        console.log('[Redirect Script] Weibo detail page detected. Applying special rule.');

        const pageHtml = document.documentElement.innerHTML;
        const idRegex = /"id": (\d+),/;
        const bidRegex = /"bid": "([^"]+)"/;

        const idMatch = pageHtml.match(idRegex);
        const bidMatch = pageHtml.match(bidRegex);

        if (idMatch && idMatch[1] && bidMatch && bidMatch[1]) {
            const pc_id = idMatch[1];
            const pc_bid = bidMatch[1];
            const pc_url = `https://weibo.com/${pc_id}/${pc_bid}`;

            console.log(`[Redirect Script] Found User ID: ${pc_id}, Post BID: ${pc_bid}. Redirecting to: ${pc_url}`);
            window.location.replace(pc_url); // Use replace to avoid back-button loops
        } else {
            console.error('[Redirect Script] Failed to extract Weibo IDs. The page structure may have changed.');
        }

    // --- --- --- Rule 2: Generic Case for all other "m." sites --- --- ---
    // If the Weibo rule didn't match, check for any other "m." host.
    } else if (host.startsWith("m.")) {
        console.log(`[Redirect Script] Generic mobile site detected (${host}). Applying standard redirect.`);

        const newUrl = `${window.location.protocol}//www.${host.substring(2)}${path}${window.location.search}${window.location.hash}`;

        // Note: This is the simple redirect from your original script.
        // It does not check if the destination page exists.
        window.location.replace(newUrl);
    }
})();