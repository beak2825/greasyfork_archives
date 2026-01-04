// ==UserScript==
// @name         Amazon - Show absolute review numbers
// @namespace    graphen
// @version      1.2.6
// @description  Adds the number of reviews to each rating separately
// @license      MIT
// @author       Graphen
// @include      /^https?:\/\/(www|smile)\.amazon\.(cn|in|co\.jp|sg|se|ae|fr|de|pl|it|nl|es|co\.uk|ca|com(\.(mx|au|br|tr|be))?)\/.*(dp|gp\/(product|video)|exec\/obidos\/ASIN|o\/ASIN|product-reviews)\/.*$/
// @grant        none
// @noframes
// @icon         https://www.amazon.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/369355/Amazon%20-%20Show%20absolute%20review%20numbers.user.js
// @updateURL https://update.greasyfork.org/scripts/369355/Amazon%20-%20Show%20absolute%20review%20numbers.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

// Testpages:
// https://www.amazon.de/s?k=roccat+kone+pure+2017&__mk_de_DE=%C3%85M%C3%85%C5%BD%C3%95%C3%91&qid=1556553434&ref=sr_pg_1
// https://www.amazon.de/dp/B078S8YZZ6/

(function(doc) {
    'use strict';

    var totalReviewCount = doc.querySelector('[data-hook="total-review-count"]').innerText;
    var arrPercentages = Array.from(doc.querySelectorAll("#histogramTable .a-text-right"));

    if (totalReviewCount && arrPercentages) {
        // Sanitize totalReviewCount
        // Remove all non-digits
        totalReviewCount = totalReviewCount.replace(/\D/g, '');
        // Convert string to integer
        totalReviewCount = parseInt(totalReviewCount, 10);
        // Check for nonsense (Most reviewed product has ~100000 at the moment)
        if (totalReviewCount < 250000) {
            for (var e of arrPercentages) {
                let percentValue = e.innerText;
                // Get rid of percentage sign and convert string to integer
                percentValue = parseInt(percentValue, 10);
                // Calculate absolute review count
                percentValue = Math.round(percentValue * totalReviewCount / 100);
                // Cancel if nonsense
                if (percentValue > totalReviewCount || percentValue < 0) {
                    break;
                }
                // Append calculated value to visible node
                var absNum = doc.createTextNode(" (" + percentValue + ")");
                e.appendChild(absNum);
            }
        }
    }

    // Insert own stylesheet
    let reviewStyle = doc.createElement("style");
    reviewStyle.innerHTML = "#histogramTable td:last-of-type { text-align: right !important; }";
    doc.head.appendChild(reviewStyle);


})(document);
