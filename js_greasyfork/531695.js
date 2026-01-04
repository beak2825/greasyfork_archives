// ==UserScript==
// @name         Remove GoComics Upsell
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  This script removes the annoying payment wall upon viewing older comics and auto refreshes the page on URL change to ensure content loads correctly
// @author       JakobOnGreasyFork
// @match        https://www.gocomics.com/*
// @grant        none
// @license      No License
// @downloadURL https://update.greasyfork.org/scripts/531695/Remove%20GoComics%20Upsell.user.js
// @updateURL https://update.greasyfork.org/scripts/531695/Remove%20GoComics%20Upsell.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove the upsell element and ads, and fix scrolling
    function removeElementsAndFixScroll() {
        // Remove the upsell element
        var upsellElement = document.querySelector("div.RollUpUpsell_upsell__xayeg[data-sentry-component='RollUpUpsell']");
        if (upsellElement) {
            upsellElement.remove();
        }

        // Remove the new subscription prompt
        var subscriptionPrompt = document.querySelector("div[data-sentry-component='RollUpUpsell']");
        if (subscriptionPrompt) {
            subscriptionPrompt.remove();
        }

        // Remove banner ads
        var bannerAds = document.querySelectorAll("div[data-sentry-component='HeaderAd'], div[data-sentry-component='AdvertisingUnit'], div.AdvertisingUnit_advertisingUnit__container__qrIA");
        bannerAds.forEach(function(ad) {
            ad.remove();
        });

        // Ensure the body and html are scrollable
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';

        // Remove any inline styles that might prevent scrolling
        document.body.style.height = 'auto';
        document.documentElement.style.height = 'auto';
    }

    // Function to add custom scrollbar styles
    function addCustomScrollbar() {
        var style = document.createElement('style');
        style.innerHTML = `
            /* Custom scrollbar styles */
            ::-webkit-scrollbar {
                width: 12px;
            }
            ::-webkit-scrollbar-track {
                background: #f1f1f1;
            }
            ::-webkit-scrollbar-thumb {
                background: #888;
            }
            ::-webkit-scrollbar-thumb:hover {
                background: #555;
            }
            /* Ensure the body and html are scrollable */
            body, html {
                overflow: auto !important;
                height: auto !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Function to refresh the page a couple of times
    function refreshPage() {
        let refreshCount = localStorage.getItem('refreshCount') || 0;
        if (refreshCount < 2) {
            localStorage.setItem('refreshCount', ++refreshCount);
            location.reload();
        } else {
            localStorage.removeItem('refreshCount');
        }
    }

    // Function to monitor URL changes
    function monitorURLChanges() {
        let lastURL = location.href;
        new MutationObserver(() => {
            const currentURL = location.href;
            if (currentURL !== lastURL) {
                lastURL = currentURL;
                refreshPage();
            }
        }).observe(document, { subtree: true, childList: true });
    }

    // Run the functions initially
    removeElementsAndFixScroll();
    addCustomScrollbar();
    monitorURLChanges();

    // Use a MutationObserver to monitor changes in the DOM and ensure scrolling is enabled
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            removeElementsAndFixScroll();
        });
    });

    // Start observing the document for changes
    observer.observe(document, { childList: true, subtree: true });

    // Continuously check and fix scrolling every second
    setInterval(removeElementsAndFixScroll, 1000);
})();
