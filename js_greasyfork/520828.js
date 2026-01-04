// ==UserScript==
// @name         AliExpress Bypass "3 Picks" and SSR Pages
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Redirects AliExpress "gcp" and "ssr" URLs to the corresponding item page using productIds.
// @author       You
// @match        https://www.aliexpress.com/gcp*
// @match        https://www.aliexpress.com/ssr/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520828/AliExpress%20Bypass%20%223%20Picks%22%20and%20SSR%20Pages.user.js
// @updateURL https://update.greasyfork.org/scripts/520828/AliExpress%20Bypass%20%223%20Picks%22%20and%20SSR%20Pages.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentUrl = new URL(window.location.href);

    // Check if the page is a "gcp" or "ssr" product selection page
    if (currentUrl.pathname.startsWith('/gcp') || currentUrl.pathname.startsWith('/ssr/')) {
        // Extract the productIds parameter
        let productIds = currentUrl.searchParams.get('productIds');

        if (productIds) {
            // Split in case of multiple product IDs (":" separator for ssr, "," separator for gcp)
            let firstProductId = productIds.split(/[:,]/)[0].trim();

            // Validate if the extracted product ID is a number
            if (/^\d+$/.test(firstProductId)) {
                const newUrl = `https://www.aliexpress.com/item/${firstProductId}.html`;
                window.location.replace(newUrl);
            }
        }
    }
})();
