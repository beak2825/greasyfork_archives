// ==UserScript==
// @name         eBay Foreign Listing Banner
// @namespace    http://tampermonkey.net/
// @version      1.2
// @license MIT
// @description  Displays a banner if an eBay listing has a "Delivery alert flag" icon in the delivery section
// @match        *://www.ebay.com/itm/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512373/eBay%20Foreign%20Listing%20Banner.user.js
// @updateURL https://update.greasyfork.org/scripts/512373/eBay%20Foreign%20Listing%20Banner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Locate the delivery section and look for the 'Delivery alert flag' icon
    const deliverySection = document.querySelector('.ux-labels-values--deliverto');
    const deliveryFlagIcon = deliverySection && deliverySection.querySelector('.ux-textspans--DELIVERY-ICON');

    // Check if the flag icon is present in the delivery section
    if (deliveryFlagIcon) {
        // Create the banner element
        let banner = document.createElement("div");
        banner.textContent = "FOREIGN LISTING";
        banner.style.position = "fixed";
        banner.style.top = "0";
        banner.style.right = "0";
        banner.style.backgroundColor = "red";
        banner.style.color = "white";
        banner.style.padding = "10px 20px";
        banner.style.zIndex = "9999";
        banner.style.fontSize = "18px";
        banner.style.fontWeight = "bold";
        banner.style.boxShadow = "0px 2px 5px rgba(0, 0, 0, 0.3)";

        // Append the banner to the body
        document.body.appendChild(banner);
    }
})();
