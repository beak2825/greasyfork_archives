// ==UserScript==
// @name        Twitch.tv Prime Pop-up Remover
// @namespace   https://github.com/mirbyte/TwitchTV-Userscripts/edit/main/Amazon%20Prime%20Pop-up%20Remover.js
// @match       https://www.twitch.tv/*
// @grant       none
// @version     1.2
// @author      mirbyte
// @description Removes Amazon Prime overlay ad on Twitch streams. Check GitHub page for the demonstration image.
// @icon        https://banner2.cleanpng.com/20180513/xie/kisspng-twitch-computer-icons-logo-5af8037d689af0.0981376915262032614285.jpg
// @downloadURL https://update.greasyfork.org/scripts/524846/Twitchtv%20Prime%20Pop-up%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/524846/Twitchtv%20Prime%20Pop-up%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removePrimePopup() {
        // Multiple approaches
        const selectors = [
            '[class*="prime"]',
            '[class*="Prime"]',
            '[class*="amazon"]',
            '[class*="Amazon"]',
            '[data-a-target*="prime"]',
            '[role="dialog"]',
            '[class*="modal"]',
            '[class*="overlay"]',
            '[class*="popup"]'
        ];

        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                const text = element.textContent?.toLowerCase() || '';
                const hasImages = element.querySelector('img[src*="prime"], img[alt*="prime"], img[alt*="amazon"]');

                if ((text.includes('prime') || text.includes('amazon') || hasImages)
                    && (text.includes('free') || text.includes('try') || text.includes('get') || text.includes('claim'))) {

                    // Check if it's likely a popup/overlay
                    const computedStyle = getComputedStyle(element);
                    const isOverlay = computedStyle.position === 'fixed' ||
                                    computedStyle.position === 'absolute' ||
                                    computedStyle.zIndex > 100 ||
                                    element.getAttribute('role') === 'dialog';

                    if (isOverlay || element.offsetHeight > 100) {
                        element.remove();
                        console.log("Prime popup removed:", selector);
                    }
                }
            });
        });

        // Also check for elements with specific Amazon Prime branding
        const brandingElements = document.querySelectorAll('*');
        brandingElements.forEach(element => {
            const bgImage = getComputedStyle(element).backgroundImage;
            if (bgImage && bgImage.includes('prime')) {
                const parent = element.closest('[class*="Layout"], [class*="Modal"], [class*="Overlay"]');
                if (parent) {
                    parent.remove();
                }
            }
        });
    }

    // Run on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removePrimePopup);
    } else {
        removePrimePopup();
    }

    // Enhanced observer
    let debounceTimeout;
    const observer = new MutationObserver(function(mutations) {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(removePrimePopup, 100);
    });

    if (document.body) {
        observer.observe(document.body, {
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: ['class', 'style', 'role']
        });
    }
})();
