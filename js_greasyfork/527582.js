// ==UserScript==
// @name         TradingView Measure Button Click with F1 (desktop)
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Click the "Measure" button when F1 is pressed on TradingView
// @author       Your Name
// @match        *://*.tradingview.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527582/TradingView%20Measure%20Button%20Click%20with%20F1%20%28desktop%29.user.js
// @updateURL https://update.greasyfork.org/scripts/527582/TradingView%20Measure%20Button%20Click%20with%20F1%20%28desktop%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        // Check if F1 key is pressed
        if (event.key === 'F1') {
            // Prevent the default action for F1 key
            event.preventDefault();

            // Find the "Measure" button using its data-name attribute
            const measureButton = document.querySelector('button[data-name="measure"]');

            if (measureButton) {
                // Trigger a click on the "Measure" button
                measureButton.click();

                // Trigger another left click at the current mouse position after a brief delay
                setTimeout(() => {
                    const newClick = new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        view: window,
                        clientX: event.clientX,
                        clientY: event.clientY
                    });
                    document.elementFromPoint(event.clientX, event.clientY).dispatchEvent(newClick);
                }, 50);
            }
        }
    });
})();
