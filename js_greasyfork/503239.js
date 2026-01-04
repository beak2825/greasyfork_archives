// ==UserScript==
// @name         Auto Scale Active Chart
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Press Control + A to auto scale the active chart in TradingView
// @author       You
// @match        *://*.tradingview.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/503239/Auto%20Scale%20Active%20Chart.user.js
// @updateURL https://update.greasyfork.org/scripts/503239/Auto%20Scale%20Active%20Chart.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(e) {
        // Check if Control + A is pressed
        if (e.ctrlKey && e.key === 'a') {
            e.preventDefault(); // Prevent the default "select all" action

            // Find the active chart container
            let activeChart = document.querySelector('.chart-container.active');

            if (activeChart) {
                // Find the "Auto (fits data to screen)" button within the active chart
                let autoButton = activeChart.querySelector('button[data-tooltip="Auto (fits data to screen)"]');

                if (autoButton) {
                    // Click the "Auto" button
                    autoButton.click();
                } else {
                    console.log('Auto button not found in the active chart');
                }
            } else {
                console.log('No active chart found');
            }
        }
    });
})();
