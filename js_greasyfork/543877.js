// ==UserScript==
// @name         AliExpress Bundle Deals ProductId Extractor and Opener
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Parses the productId from the current URL and opens the corresponding AliExpress product page.
// @author       Hegy
// @match        https://www.aliexpress.com/ssr/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aliexpress.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543877/AliExpress%20Bundle%20Deals%20ProductId%20Extractor%20and%20Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/543877/AliExpress%20Bundle%20Deals%20ProductId%20Extractor%20and%20Opener.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the current URL
    const currentUrl = window.location.href;

    // Use URLSearchParams to easily extract the 'productIds' parameter. [1, 2]
    const urlParams = new URLSearchParams(window.location.search);
    const productIds = urlParams.get('productIds');

    if (productIds) {
        // In case there are multiple IDs, we'll take the first one.
        const firstProductId = productIds.split(':')[0];

        // Construct the new URL
        const newUrl = `https://www.aliexpress.com/item/${firstProductId}.html`;

        // Open the new URL in a new tab. [7]
        // GM_openInTab(newUrl, { active: true });

        // Optionally, you can close the original tab
        // window.close();

        // Redirect the current tab to the new URL. [10, 6]
        window.location.href = newUrl;
    }
})();