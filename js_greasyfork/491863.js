// ==UserScript==
// @name         Amazon Coupon Helper
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Make Amazon coupons more visible
// @author       Gadget Addict
// @include        *://*.amazon.tld/*
// @license MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/491863/Amazon%20Coupon%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/491863/Amazon%20Coupon%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait until the document is fully loaded before applying styles and extracting coupon information
    window.addEventListener('load', function() {

        // Add CSS to increase the font-size of .newCouponBadge
        GM_addStyle('.newCouponBadge { font-size: 40px !important; }');

        //Define the blinking animation and append it to the document head
        var style = document.createElement('style');
        style.textContent = `
            @keyframes blink {
                0% { opacity: 1; }
                50% { opacity: 0; }
                100% { opacity: 1; }
            }
            .newCouponBadge {
                animation: blink 2s infinite;
            }
        `;
        document.head.appendChild(style);

        // Add CSS to increase the font-size of elements whose ID starts with "couponText"
        GM_addStyle('[id^="couponText"] { font-size: 40px !important; }');




        // Function to extract coupon information
        // We're not doing anything with this right now. But maybe it could be used later
        // to show the coupon info in a more friendly way - depending on user feedback.
        function extractCouponInfo() {
            // Find all elements whose ID starts with "couponText"
            var couponElements = document.querySelectorAll('[id^="couponText"]');
            if (couponElements.length > 0) {
                couponElements.forEach(function(element) {
                    // Extract text content of the element
                    var couponText = element.textContent.trim();

                    // Use regular expression to extract the amount mentioned
                    var couponAmount = couponText.match(/\$\d+/); // Extracts $ followed by digits (needs to be changed if we'll use this in other countries)
                    if (couponAmount) {
                        console.log('Coupon Information:', couponAmount[0]);
                    }
                });
            } else {
                console.log('No coupon information found on the page.');
            }
        }

        // Call the function to extract coupon information
        //extractCouponInfo();


    });
})();
