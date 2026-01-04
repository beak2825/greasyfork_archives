// ==UserScript==
// @name         Gimkit Purchase Bypass (Button Unlocker + Forced Click)
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Forces purchase button to remain clickable and bypasses Gimbucks checks
// @author       Colin
// @match        *://*.gimkit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534760/Gimkit%20Purchase%20Bypass%20%28Button%20Unlocker%20%2B%20Forced%20Click%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534760/Gimkit%20Purchase%20Bypass%20%28Button%20Unlocker%20%2B%20Forced%20Click%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const unlockPurchaseButton = () => {
        // Find all purchase buttons
        const purchaseButtons = document.querySelectorAll('.purchase-button');

        purchaseButtons.forEach(button => {
            // Remove the "disabled" state (greyed out)
            button.disabled = false;
            button.classList.remove('disabled'); // If there's a disabled class
            button.style.pointerEvents = 'auto'; // Force clickable behavior

            // Trigger click event to simulate a purchase
            button.addEventListener('click', () => {
                setTimeout(() => {
                    // Simulate a successful purchase immediately after clicking
                    const response = {
                        success: true,
                        newBalance: 999999,
                        itemUnlocked: true
                    };
                    console.log('[Bypass] Forced purchase response:', response);
                }, 100); // Small delay to mimic real response
            });
        });
    };

    const patchPurchaseRequests = () => {
        const originalFetch = window.fetch;
        window.fetch = async (url, options) => {
            if (url.includes('/purchase')) {
                console.log('[Bypass] Intercepted purchase request:', url);
                // Always return a successful purchase response
                const fakeResponse = {
                    success: true,
                    newBalance: 999999,
                    itemUnlocked: true
                };
                return new Response(JSON.stringify(fakeResponse), {
                    status: 200,
                    headers: { 'Content-type': 'application/json' }
                });
            }
            return originalFetch(url, options);
        };
    };

    // Apply the bypass every second
    setInterval(() => {
        unlockPurchaseButton();
        patchPurchaseRequests();
    }, 1000);
})();
