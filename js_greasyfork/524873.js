// ==UserScript==
// @name        X (Twitter) Remove Subscription Prompts
// @namespace   github.com/mirbyte
// @match       *://x.com/*
// @match       *://twitter.com/*
// @license     MIT
// @grant       none
// @version     1.55
// @author      mirbyte
// @description Removes the "Premium", "Business", "Ads", "Monetization" and "Upgrade" tabs/ads/banners on desktop and mobile devices. This is strictly meant for non-subscribers.
// @icon        https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @downloadURL https://update.greasyfork.org/scripts/524873/X%20%28Twitter%29%20Remove%20Subscription%20Prompts.user.js
// @updateURL https://update.greasyfork.org/scripts/524873/X%20%28Twitter%29%20Remove%20Subscription%20Prompts.meta.js
// ==/UserScript==



(function () {
    'use strict';

    function hideBanners() {
        // Premium and Upgrade tabs
        const premiumBanner = document.querySelector('[data-testid="premium-signup-tab"], [aria-label="Premium"], a[href="/i/premium_sign_up"]');
        if (premiumBanner) {
            premiumBanner.remove();
        }

        // Business tab
        const businessBanner = document.querySelector('[data-testid="vo-signup-tab"], [aria-label="Business"], a[href="/i/verified-orgs-signup"]');
        if (businessBanner) {
            businessBanner.remove();
        }

        // Ads tab mobile
        const adsBanner = document.querySelector('a[href="https://ads.x.com/?ref=gl-tw-tw-twitter-ads-rweb"]');
        if (adsBanner) {
            adsBanner.remove();
        }

        // Monetization tab mobile
        const monetizationBanner = document.querySelector('a[href="/i/monetization"]');
        if (monetizationBanner) {
            monetizationBanner.remove();
        }

        // Upgrade banner mobile
        const mobileUpgradeBanner = document.querySelector('.css-175oi2r.r-dnmrzs a[href="/i/premium_sign_up"]');
        if (mobileUpgradeBanner) {
            mobileUpgradeBanner.remove();
        }

        // 1.52
        // "Go ad-free with Premium+"
        const premiumPlusPrompt = document.querySelector('div[data-testid="cellInnerDiv"] div[data-testid="inlinePrompt"]');
        if (premiumPlusPrompt) {
            premiumPlusPrompt.remove();
        }


        // 1.53
        // found at the right side of the page
        const verifiedBanner = document.querySelector('aside[aria-label="Get Verified with a blue check"]');
        if (verifiedBanner) {
            verifiedBanner.remove();
        }
        // came after posting a reply
        const fullscreenPopup = document.querySelector('div[data-testid="sheetDialog"]');
        if (fullscreenPopup) {
            fullscreenPopup.remove();
        }

        // Premium subscription ad in right sidebar
        const premiumSidebarAd = document.querySelector('aside[aria-label="Subscribe to Premium"]');
        if (premiumSidebarAd) {
            premiumSidebarAd.remove();
        }
	
	//1.55
        // New Premium subscription ad in right sidebar (super-upsell)
        const superUpsellBanner = document.querySelector('div[data-testid="super-upsell-UpsellCardRenderProperties"]');
        if (superUpsellBanner && superUpsellBanner.parentElement && superUpsellBanner.parentElement.parentElement) {
             superUpsellBanner.parentElement.parentElement.remove();
        }


    }

    // run
    hideBanners();
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            hideBanners();
        });
    });
    observer.observe(document.body, { subtree: true, childList: true });
})();