// ==UserScript==
// @name         Gimkit Purchase Bypass (Works with Zero Gimbucks)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Bypass Gimbucks check and allow all purchases even if balance is insufficient
// @author       Colin
// @match        *://*.gimkit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534759/Gimkit%20Purchase%20Bypass%20%28Works%20with%20Zero%20Gimbucks%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534759/Gimkit%20Purchase%20Bypass%20%28Works%20with%20Zero%20Gimbucks%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

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

    const overrideBalanceCheck = () => {
        Object.defineProperty(window, 'gimbucks', {
            get: () => 999999,
            set: () => {}
        });
        if (window.user) {
            window.user.gimbucks = 999999;
        }
    };

    const loopPatch = () => {
        patchPurchaseRequests();
        overrideBalanceCheck();
    };

    setInterval(loopPatch, 1000);
})();
