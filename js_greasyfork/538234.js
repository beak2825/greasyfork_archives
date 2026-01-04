// ==UserScript==
// @name         ESPN Fantasy Baseball - Enhanced Pitcher Indicators
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Improves visibility of starting pitcher indicators
// @author       bryce54
// @match        https://fantasy.espn.com/baseball/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538234/ESPN%20Fantasy%20Baseball%20-%20Enhanced%20Pitcher%20Indicators.user.js
// @updateURL https://update.greasyfork.org/scripts/538234/ESPN%20Fantasy%20Baseball%20-%20Enhanced%20Pitcher%20Indicators.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add very specific CSS to override ESPN's styles
    const style = document.createElement('style');
    style.textContent = `
        strong.jsx-2137698400.playerinfo__start-indicator.ttu.pl2.enhanced-pitcher-indicator,
        .playerinfo__start-indicator.enhanced-pitcher-indicator {
            background-color: #ff4444 !important;
            color: white !important;
            padding: 1px 3px 1px 2px !important;
            border-radius: 3px !important;
            font-weight: bold !important;
            font-size: 10px !important;
            text-shadow: none !important;
            border: 1px solid #cc0000 !important;
            box-shadow: 0 1px 2px rgba(0,0,0,0.3) !important;
            margin-left: 6px !important;
            display: inline !important;
            vertical-align: baseline !important;
            line-height: 1 !important;
        }
    `;
    document.head.appendChild(style);

    function enhancePitcherIndicators() {
        // Find all probable pitchers to start on a given day
        const selectors = [
            'strong[title="Probable Pitcher"]',
        ];

        let pitcherIndicators = [];
        selectors.forEach(selector => {
            const found = document.querySelectorAll(selector);
            pitcherIndicators = [...pitcherIndicators, ...Array.from(found)];
        });

        // Remove duplicates
        pitcherIndicators = [...new Set(pitcherIndicators)];

        console.log(`Found ${pitcherIndicators.length} pitcher indicators`);

        pitcherIndicators.forEach((indicator, index) => {
            // Skip if already enhanced
            if (indicator.hasAttribute('data-enhanced')) {
                return;
            }

            console.log(`Enhancing indicator ${index + 1}:`, indicator);

            // Change text content
            indicator.textContent = 'START';

            // Add enhanced styling class
            indicator.classList.add('enhanced-pitcher-indicator');

            // Direct style application as backup
            const styles = {
                backgroundColor: '#ff4444',
                color: 'white',
                padding: '1px 4px',
                borderRadius: '3px',
                fontWeight: 'bold',
                fontSize: '10px',
                textShadow: 'none',
                border: '1px solid #cc0000',
                boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
                marginLeft: '2px',
                display: 'inline',
                verticalAlign: 'baseline',
                lineHeight: '1'
            };

            Object.assign(indicator.style, styles);

            // Mark as enhanced
            indicator.setAttribute('data-enhanced', 'true');
        });
    }

    // Multiple timing attempts to catch content loading
    setTimeout(enhancePitcherIndicators, 100);
    setTimeout(enhancePitcherIndicators, 500);
    setTimeout(enhancePitcherIndicators, 1000);
    setTimeout(enhancePitcherIndicators, 2000);

    // Create observer to handle dynamically loaded content
    const observer = new MutationObserver(function(mutations) {
        let shouldUpdate = false;

        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Check if any added nodes contain pitcher indicators
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        if (node.querySelector && (
                            node.querySelector('.playerinfo__start-indicator') ||
                            node.querySelector('strong[title="Probable Pitcher"]')
                        )) {
                            shouldUpdate = true;
                        }
                    }
                });
            }
        });

        if (shouldUpdate) {
            setTimeout(enhancePitcherIndicators, 200);
        }
    });

    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Also run on page visibility change and other events
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            setTimeout(enhancePitcherIndicators, 500);
        }
    });

    // Run when DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', enhancePitcherIndicators);
    }

    // Run on window load as final attempt
    window.addEventListener('load', function() {
        setTimeout(enhancePitcherIndicators, 1000);
    });

    // Periodic check (every 5 seconds) to catch any missed indicators
    setInterval(enhancePitcherIndicators, 5000);

    console.log('ESPN Fantasy Baseball - Enhanced Pitcher Indicators loaded');
})();