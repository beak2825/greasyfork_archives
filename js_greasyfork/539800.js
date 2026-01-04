// ==UserScript==
// @name         Robux to USD
// @namespace    https://roblox.com/
// @version      1.2
// @description  Converts Robux values shown in <span class="text-robux"> to USD using the DevEx rate of $0.0035 per Robux
// @author       Meadow
// @match        https://www.roblox.com/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539800/Robux%20to%20USD.user.js
// @updateURL https://update.greasyfork.org/scripts/539800/Robux%20to%20USD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const ROBUX_TO_USD = 0.0035;

    // Convert Robux to USD string
    function robuxToUSD(robux) {
        return `$${(robux * ROBUX_TO_USD).toFixed(2)} USD`;
    }

    // Check and convert all .text-robux spans
    function convertRobuxSpans() {
        const spans = document.querySelectorAll('span.text-robux');

        spans.forEach(span => {
            if (span.dataset.converted === 'true') return; // Skip already converted

            const robux = parseInt(span.textContent.replace(/[^\d]/g, ''), 10);
            if (isNaN(robux)) return;

            // Create USD display
            const usdDisplay = document.createElement('span');
            usdDisplay.textContent = ` (${robuxToUSD(robux)})`;
            usdDisplay.style.color = '#6e6e6e';
            usdDisplay.style.fontSize = '12px';
            usdDisplay.style.marginLeft = '4px';

            span.appendChild(usdDisplay);
            span.dataset.converted = 'true';
        });
    }

    // Initial run
    convertRobuxSpans();

    // Watch for dynamic content changes
    const observer = new MutationObserver(() => {
        convertRobuxSpans();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();