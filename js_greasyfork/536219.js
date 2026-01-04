// ==UserScript==
// @name         Glassdoor Paywall Remover
// @namespace    http://www.greasyfork.org
// @version      1.2.2
// @description  Remove Glassdoor paywall, restore scrolling, and improve site accessibility
// @author       NagaYZ
// @match        *://*.glassdoor.com/*
// @match        *://*.glassdoor.ca/*
// @match        *://*.glassdoor.co.uk/*
// @match        *://*.glassdoor.fr/*
// @match        *://*.glassdoor.de/*
// @match        *://*.glassdoor.*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536219/Glassdoor%20Paywall%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/536219/Glassdoor%20Paywall%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS Injection function
    function addGlobalStyle(css) {
        const head = document.getElementsByTagName('head')[0];
        if (!head) return;

        const style = document.createElement('style');
        style.type = 'text/css';
        style.textContent = css; // Use textContent instead of innerHTML for better security
        head.appendChild(style);
    }

    // CSS rules to remove paywall and restore scrolling
    const cssRules = `
        /* Hide paywall elements */
        #ContentHardsellOverlay,
        .ContentHardsell,
        .HardsellOverlay,
        .hardsellComponent,
        .HardsellBanner,
        .restore-access-banner,
        .SignedOutBanner,
        .ReactModalPortal,
        [class*="paywall"],
        [id*="paywall"],
        [class*="Paywall"],
        [id*="Paywall"] {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
        }

        /* Restore scrolling and prevent lock */
        html, body {
            overflow: auto !important;
            overflow-x: hidden !important;
            position: static !important;
            height: auto !important;
            max-height: none !important;
        }

        /* Fix body positioning */
        body.main.gdGrid {
            position: relative !important;
        }

        /* Make content visible */
        .showing-paywall-content {
            filter: none !important;
            -webkit-filter: none !important;
            blur: none !important;
        }

        /* Show hidden content behind paywall */
        [class*="blurred"],
        [class*="Blurred"],
        .blur-text {
            filter: none !important;
            -webkit-filter: none !important;
            text-shadow: none !important;
            color: inherit !important;
        }
    `;

    // Add CSS rules
    addGlobalStyle(cssRules);

    // Prevent scroll locking events
    const stopEvents = ['scroll', 'mousemove', 'touchmove', 'mousewheel', 'wheel', 'DOMMouseScroll'];
    stopEvents.forEach(eventType => {
        window.addEventListener(eventType, event => event.stopPropagation(), true);
    });

    // Mutation observer to remove dynamically added paywall elements
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes && mutation.addedNodes.length) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Check for paywall-related classes and IDs
                        if (node.id && (node.id.includes('paywall') || node.id.includes('Paywall') ||
                                       node.id.includes('Hardsell') || node.id.includes('hardsell'))) {
                            node.style.display = 'none';
                        }
                        if (node.className && typeof node.className === 'string' &&
                            (node.className.includes('paywall') || node.className.includes('Paywall') ||
                             node.className.includes('Hardsell') || node.className.includes('hardsell'))) {
                            node.style.display = 'none';
                        }

                        // Remove modal backdrops
                        if (node.className && typeof node.className === 'string' &&
                            node.className.includes('modal')) {
                            document.body.style.overflow = 'auto';
                        }
                    }
                }
            }
        });
    });

    // Start observing document for paywall injections
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // Periodically check and remove any body style that prevents scrolling
    setInterval(() => {
        if (document.body.style.overflow === 'hidden') {
            document.body.style.overflow = 'auto';
        }
        if (document.body.style.position === 'fixed') {
            document.body.style.position = 'relative';
        }
    }, 1000);

})();