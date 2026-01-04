// ==UserScript==
// @name        Marktplaats - Sponsored Products remover
// @namespace   https://greasyfork.org/en/users/2755-robotoilinc
// @author      RobotOilInc
// @version     0.3.3
// @license     MIT
// @description Removes the terrible sponsored products/banners/suggested searches/etc from Marktplaats.nl.
// @match       http*://www.marktplaats.nl/q/*
// @match       http*://www.marktplaats.nl/l/*
// @match       http*://www.marktplaats.nl/u/*
// @icon        https://i.imgur.com/NLIZEzb.png
// @run-at      document-body
// @downloadURL https://update.greasyfork.org/scripts/456676/Marktplaats%20-%20Sponsored%20Products%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/456676/Marktplaats%20-%20Sponsored%20Products%20remover.meta.js
// ==/UserScript==

new MutationObserver(function(mutationList, observer) {
    // Remove "Topadvertentie" results
    document.querySelectorAll('.hz-Listing-priority').forEach(function(element) {
        if (!element.innerText.includes('Topadvertentie')) {
            return;
        }

        const parent = element.closest('li.hz-Listing');
        if(parent) parent.style.display = 'none';
    });

    // Remove "Dagtopper" results
    document.querySelectorAll('.hz-Listing-priority').forEach(function(element) {
        if (!element.innerText.includes('Dagtopper')) {
            return;
        }

        const parent = element.closest('li.hz-Listing');
        if(parent) parent.style.display = 'none';
    });

    // Remove "Gecontrolleerde verkopers"
    document.querySelectorAll('.has-tooltip').forEach(function(element) {
        const parent = element.closest('li.hz-Listing');
        if(parent) parent.style.display = 'none';
    });

    // Remove "Bezorgt in x"-ads
    document.querySelectorAll('.hz-Listing-location').forEach(function(element) {
        if (!element.innerText.includes('Bezorgt in')) {
            return;
        }

        const parent = element.closest('li.hz-Listing');
        if(parent) parent.style.display = 'none';
    });

    // Remove all the banners
    document.querySelectorAll('.hz-Banner').forEach(function(element) {
        element.style.display = 'none';
    });
    document.querySelectorAll('.bannerContainerLoading').forEach(function(element) {
        element.style.display = 'none';
    });

    // Remove adsence
    document.querySelectorAll('#adsense-container').forEach(function(element) {
        element.style.display = 'none';
    });

    // Remove suggested searches
    document.querySelectorAll('.hz-SuggestedSearches').forEach(function(element) {
        element.style.display = 'none';
    });

    // Remove listings
    document.querySelectorAll('.hz-Listings__container--cas').forEach(function(element) {
        element.style.display = 'none';
    });

    // Remove "other listings from seller"
    document.querySelectorAll('.hz-Listing.hz-Listing--other-seller').forEach(function(element) {
        element.style.display = 'none';
    });

    // Remove "opval"-sticker
    document.querySelectorAll('.hz-Listing-Opvalsticker-wrapper').forEach(function(element) {
        element.style.display = 'none';
    });

    // Remove "faq" article
    document.querySelectorAll('.hz-Card.faqFooter').forEach(function(element) {
        element.style.display = 'none';
    });
}).observe(document.body, { childList: true, subtree: true });