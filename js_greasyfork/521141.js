// ==UserScript==
// @name         Hide Ad Profiles on OnlyFansSigns
// @namespace    http://tampermonkey.net/
// @version      2.2
// @icon         https://www.google.com/s2/favicons?domain=onlyfans.com
// @description  Dynamically blocks fake profiles or ad profiles across multiple platforms, with specific handling for Fanscout ads.
// @author       Cody JORDAN
// @match        https://fanscout.com/*
// @match        https://onlyselects.com/*
// @match        https://onlyfanssigns.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/521141/Hide%20Ad%20Profiles%20on%20OnlyFansSigns.user.js
// @updateURL https://update.greasyfork.org/scripts/521141/Hide%20Ad%20Profiles%20on%20OnlyFansSigns.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * Hides ad profiles based on attributes, classes, and keywords.
     */
    function blockAdProfiles() {
        const profiles = document.querySelectorAll('.swiper-slide, .slide-content, .profile-card, .account-card');

        profiles.forEach(profile => {
            const isPromo = profile.hasAttribute('data-promo'); // Promo marker
            const hasImptrc = profile.hasAttribute('data-imptrc'); // Impression tracking marker
            const hasClctrc = profile.hasAttribute('data-clctrc'); // Click tracking marker
            const adsElement = profile.querySelector('.ads'); // Ad-related class
            const usernameElement = profile.querySelector('a'); // Username or profile link

            const adTextMarkers = ['AD', 'Sponsored', 'Promo', 'Advertisement']; // Ad keywords

            // Identify fake or ad profiles
            const isFakeProfile =
                isPromo ||
                hasImptrc ||
                hasClctrc ||
                (adsElement && adTextMarkers.some(marker => adsElement.textContent.includes(marker))) ||
                (usernameElement && adTextMarkers.some(marker => usernameElement.textContent.includes(marker)));

            if (isFakeProfile) {
                console.log('Hiding fake profile:', profile);
                profile.style.display = 'none';
            }
        });
    }

    /**
     * Monitors the DOM for dynamically loaded content.
     */
    function observeDomChanges() {
        const observer = new MutationObserver(() => {
            blockAdProfiles();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    /**
     * Initializes the script.
     */
    function init() {
        console.log('Universal Profile Ad Blocker Initialized.');
        blockAdProfiles();
        observeDomChanges();
    }

    // Execute the script
    init();
})();