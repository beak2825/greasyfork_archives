// ==UserScript==
// @name         B&Q/diy.com actually show stuff in store
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Auto-apply a filter to show items actually in stock and not "Verified seller" rubbish
// @author       You
// @match        https://www.diy.com/*.cat*
// @match        https://www.diy.com/search*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521679/BQdiycom%20actually%20show%20stuff%20in%20store.user.js
// @updateURL https://update.greasyfork.org/scripts/521679/BQdiycom%20actually%20show%20stuff%20in%20store.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the filter key and value
    const filterKey = "1 hour Click & Collect and Home Delivery options";
    const filterValue = "1 hour Click & Collect";

    // Get the current URL
    let url = new URL(window.location.href);

    // Check if the filter is already applied
    if (url.searchParams.get(filterKey) !== filterValue) {
        // Add or update the filter parameter
        url.searchParams.set(filterKey, filterValue);

        // Replace the current URL and force reload
        window.location.href = url.href;
    }
})();
