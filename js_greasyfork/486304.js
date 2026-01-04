// ==UserScript==
// @name         TradeMe Real Estate Filter - Modified
// @namespace    http://drsr/
// @version      1.4
// @author       chaoscreater
// @description  Hide listings without a specified price on TradeMe Real Estate listings.
// @include      /https://www\.trademe\.co\.nz/[Bb]rowse/[Cc]ategory[Aa]ttribute[Ss]earch[Rr]esults.aspx.*/
// @include      https://www.trademe.co.nz/a/property/*
// @include      https://www.trademe.co.nz/browse/property/regionlistings.aspx*
// @include      https://www.trademe.co.nz/members/listings.aspx*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486304/TradeMe%20Real%20Estate%20Filter%20-%20Modified.user.js
// @updateURL https://update.greasyfork.org/scripts/486304/TradeMe%20Real%20Estate%20Filter%20-%20Modified.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const KILL_PATTERN = /(Price by negotiation)|(Enquiries Over)|(To be auctioned)|(Tender)|(Deadline private treaty)|(Deadline sale)/i;
    const KILLED_LISTING_STYLES = `
        .killedlisting { background-color: #eeeeee !important; color: #999999 !important; }
        .hiddenlisting { display: none !important; }
    `;

    function addStyle(style) {
        const styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.innerHTML = style;
        document.head.appendChild(styleElement);
    }

    function hideListingBasedOnPrice() {
        const priceElements = document.querySelectorAll('.tm-property-search-card-price-attribute__price');
        console.log(`Found ${priceElements.length} price elements.`);
        priceElements.forEach((element) => {
            const priceText = element.textContent;
            const listingLinkElement = element.closest('a.tm-property-premium-listing-card__link');
            if (KILL_PATTERN.test(priceText) && listingLinkElement) {
                listingLinkElement.classList.add('killedlisting', 'hiddenlisting');
            }
        });
    }

    function waitForListingsAndExecute(callback, interval = 100, timeout = 10000) {
        const startTime = Date.now();
        const checkCondition = setInterval(function() {
            if (document.querySelector('.tm-property-search-card-price-attribute__price') || Date.now() - startTime > timeout) {
                clearInterval(checkCondition);
                console.log("Executing callback after listings detected or timeout.");
                callback();
            }
        }, interval);
    }

    addStyle(KILLED_LISTING_STYLES);

    // Use MutationObserver to dynamically observe changes in the list of properties
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                console.log("Mutation observed, checking listings.");
                hideListingBasedOnPrice();
            }
        });
    });

    const config = { childList: true, subtree: true };

    // Start observing the body for changes in the DOM
    observer.observe(document.body, config);

    // Replace the setTimeout with waitForListingsAndExecute for initial check
    waitForListingsAndExecute(hideListingBasedOnPrice);
})();
