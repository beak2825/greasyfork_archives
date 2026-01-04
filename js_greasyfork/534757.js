// ==UserScript==
// @name         Gimkit 100k Gimbucks Permanent + Skin Unlocker
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Gives you permanent 100k Gimbucks and bypasses skin purchase checks
// @author       Colin
// @match        *://*.gimkit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534757/Gimkit%20100k%20Gimbucks%20Permanent%20%2B%20Skin%20Unlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/534757/Gimkit%20100k%20Gimbucks%20Permanent%20%2B%20Skin%20Unlocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const forceGimbucks = () => {
        const props = Object.getOwnPropertyDescriptors(window);
        for (let key in props) {
            if (props[key].value && typeof props[key].value === 'object') {
                let obj = props[key].value;
                if (obj.hasOwnProperty('gimbucks')) {
                    obj.gimbucks = 100000;
                    Object.defineProperty(obj, 'gimbucks', {
                        get: function() { return 100000; },
                        set: function(_) {}
                    });
                }
            }
        }
    };

    const patchPurchase = () => {
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            if (args[0].includes('/purchase')) {
                const response = new Response(JSON.stringify({ success: true }), {
                    status: 200,
                    headers: { 'Content-type': 'application/json' }
                });
                return response;
            }
            return originalFetch(...args);
        };
    };

    setInterval(() => {
        forceGimbucks();
        patchPurchase();
    }, 1000);
})();
