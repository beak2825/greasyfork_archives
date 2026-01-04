// ==UserScript==
// @name         BigQuery Cost Estimator
// @namespace    https://bigquery.cloud.google.com/
// @version      1.7
// @description  Dynamically replace BigQuery's query size estimate (GB) with the estimated cost in USD.
// @author       Dann Berg
// @match        https://console.cloud.google.com/bigquery*
// @run-at       document-end
// @license      MIT
// @homepageURL  https://greasyfork.org/en/scripts/525352-bigquery-cost-estimator
// @supportURL   https://github.com/dannberg/bigquery-cost-estimator/issues
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525352/BigQuery%20Cost%20Estimator.user.js
// @updateURL https://update.greasyfork.org/scripts/525352/BigQuery%20Cost%20Estimator.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const PRICE_PER_TB = 6.25;
    const GB_TO_TB = 1024;

    function updateCost() {
        // Target the specific element inside query-validation-status
        const statusText = document.querySelector('div.cfc-truncated-text.ng-star-inserted');

        if (statusText && statusText.textContent.includes("This query will process")) {
            // Extract the GB value
            const match = statusText.textContent.match(/([\d.]+)\s*GB/);
            if (match) {
                const gb = parseFloat(match[1]);
                if (!isNaN(gb)) {
                    // Calculate cost
                    const cost = ((gb / GB_TO_TB) * PRICE_PER_TB).toFixed(2);

                    // Replace text with cost
                    statusText.textContent = `Estimated cost: $${cost}`;
                }
            }
        }
    }

    // Observe changes in the Query Validation UI
    const observer = new MutationObserver(updateCost);
    observer.observe(document.body, { childList: true, subtree: true });

    // Run once on script load
    updateCost();
})();
