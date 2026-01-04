// ==UserScript==
// @name         Affiliate Link Generator for Amazon and Flipkart
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Generate affiliate links for products on Amazon and Flipkart.
// @author       iamnobody
// @license      MIT
// @match        *://www.amazon.in/*
// @match        *://www.flipkart.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488392/Affiliate%20Link%20Generator%20for%20Amazon%20and%20Flipkart.user.js
// @updateURL https://update.greasyfork.org/scripts/488392/Affiliate%20Link%20Generator%20for%20Amazon%20and%20Flipkart.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to generate Amazon affiliate link
    function generateAmazonLink() {
        var affiliateTag = "your-affiliate-tag"; // Replace with your Amazon affiliate tag
        var productURL = window.location.href;
        var amazonAffiliateLink = productURL + "?tag=" + affiliateTag;
        return amazonAffiliateLink;
    }

    // Function to generate Flipkart affiliate link
    function generateFlipkartLink() {
        var affiliateID = "your-affiliate-ID"; // Replace with your Flipkart affiliate ID
        var productURL = window.location.href;
        var flipkartAffiliateLink = productURL + "&affid=" + affiliateID;
        return flipkartAffiliateLink;
    }

    // Function to add floating button to copy affiliate link
    function addFloatingButton(affiliateLink) {
        var floatingButton = document.createElement('div');
        floatingButton.innerHTML = '<button style="position: fixed; top: 20px; left: 20px; z-index: 9999; padding: 10px; background-color: #007bff; color: #fff; border: none; cursor: pointer;">Copy Affiliate Link</button>';
        document.body.appendChild(floatingButton);

        floatingButton.addEventListener('click', function() {
            navigator.clipboard.writeText(affiliateLink).then(function() {
                alert("Affiliate link copied to clipboard!");
            }, function() {
                alert("Failed to copy affiliate link!");
            });
        });
    }

    // Check if the current page is Amazon or Flipkart and generate affiliate link accordingly
    if (window.location.hostname.includes('amazon.in')) {
        var amazonLink = generateAmazonLink();
        addFloatingButton(amazonLink);
    } else if (window.location.hostname.includes('flipkart.com')) {
        var flipkartLink = generateFlipkartLink();
        addFloatingButton(flipkartLink);
    }

})();
