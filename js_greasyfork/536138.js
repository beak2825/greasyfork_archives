// ==UserScript==
// @name         Remove Adblock Banner - Fap Roulette
// @namespace    http://tampermonkey.net/
// @version      2025-04-22
// @description  Removes adblock nag elements from Fap Roulette
// @author       M857
// @match        https://*.faproulette.co/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=faproulette.co
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536138/Remove%20Adblock%20Banner%20-%20Fap%20Roulette.user.js
// @updateURL https://update.greasyfork.org/scripts/536138/Remove%20Adblock%20Banner%20-%20Fap%20Roulette.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove the elements
    function removeElements() {

        // First button/banner
        const banner = document.querySelector('button.news-banner.premium-tier-1.no-margin-top.btn-drawer-premium');
        if (banner) {
            banner.remove();
            console.log('Adblock banner removed');
        }

        // Remove the empty spacing div
        const spacer = document.querySelector('div.clear-quick-filters.rp');
        if (spacer) {
            spacer.remove();
            console.log('Empty spacer removed');
        }

        // Fullscreen popup banner
        const popup = document.querySelector('.fullscreen-hint.bn.animate-fadeIn.animation-delay-1000ms');
        if (popup) {
            popup.remove();
            console.log('Fullscreen popup removed');
        }
    }

    // Run on initial load
    console.log('Tampermonkey script is active on this page');
    removeElements();

    // Also set up a MutationObserver to catch delayed elements
    const observer = new MutationObserver(() => {
        removeElements();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();