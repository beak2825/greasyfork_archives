// ==UserScript==
// @name        Twitch.tv Amazon Prime Ad Remover
// @namespace   https://github.com/mirbyte/TwitchTV-Userscripts/edit/main/Prime%20Notifications%20Remover.js
// @match       https://www.twitch.tv/*
// @grant       none
// @version     1.3
// @author      mirbyte
// @description Removes amazon prime ad/button on twitch.tv. Check GitHub page for the demonstration image.
// @icon        https://banner2.cleanpng.com/20180513/xie/kisspng-twitch-computer-icons-logo-5af8037d689af0.0981376915262032614285.jpg
// @downloadURL https://update.greasyfork.org/scripts/524854/Twitchtv%20Amazon%20Prime%20Ad%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/524854/Twitchtv%20Amazon%20Prime%20Ad%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removePrime() {
        // Direct targeting of prime elements
        const directSelectors = [
            '.top-nav__prime',
            '.prime-offers',
            '[class*="prime-offers"]',
            '[data-a-target="prime-offers-icon"]',
            '[data-a-target*="prime"]',
            '[data-target*="prime"]'
        ];

        // Remove elements using direct selectors
        directSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element) {
                    element.remove();
                    console.log("Prime element removed via direct selector:", selector);
                }
            });
        });

        // Additional targeting by aria-label (for internationalized versions)
        const ariaElements = document.querySelectorAll('[aria-label]');
        ariaElements.forEach(element => {
            const ariaLabel = element.getAttribute('aria-label')?.toLowerCase() || '';
            if (ariaLabel.includes('prime') || ariaLabel.includes('amazon')) {
                // Check if it's in the top navigation area
                const isInTopNav = element.closest('[class*="top-nav"]') ||
                                 element.closest('[class*="prime"]') ||
                                 element.closest('[data-a-target*="prime"]');

                if (isInTopNav) {
                    const container = element.closest('[class*="Layout"]') || element;
                    container.remove();
                    console.log("Prime element removed via aria-label:", ariaLabel);
                }
            }
        });

        // Target buttons with Prime-related data attributes
        const primeButtons = document.querySelectorAll('button[data-a-target*="prime"], button[data-target*="prime"]');
        primeButtons.forEach(button => {
            const container = button.closest('[class*="Layout"]') ||
                            button.closest('[class*="prime"]') ||
                            button.parentElement;
            if (container) {
                container.remove();
                console.log("Prime button container removed");
            }
        });

        // Fallback: Look for elements containing Prime icon SVGs
        const svgElements = document.querySelectorAll('svg');
        svgElements.forEach(svg => {
            const paths = svg.querySelectorAll('path');
            // Look for the crown/prime icon path pattern
            paths.forEach(path => {
                const d = path.getAttribute('d');
                if (d && d.includes('13.798 10.456')) { // Part of the Prime crown icon path
                    const primeContainer = svg.closest('[class*="Layout"]') ||
                                         svg.closest('button') ||
                                         svg.closest('div[class*="prime"]');
                    if (primeContainer) {
                        primeContainer.remove();
                        console.log("Prime element removed via SVG detection");
                    }
                }
            });
        });
    }

    // Run on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removePrime);
    } else {
        removePrime();
    }

    // Enhanced observer with throttling
    let debounceTimeout;
    const observer = new MutationObserver(function(mutations) {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(removePrime, 100);
    });

    if (document.body) {
        observer.observe(document.body, {
            subtree: true,
            childList: true,
            attributes: true,
            attributeFilter: ['class', 'style', 'data-a-target', 'aria-label']
        });
    }
})();
