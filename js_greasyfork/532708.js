// ==UserScript==
// @name         Poxel.io FREE Premium
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Verify yourself in Poxel.io (made by the Kour.io developers)
// @author       Poxel Black Market
// @match        *://*poxel.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532708/Poxelio%20FREE%20Premium.user.js
// @updateURL https://update.greasyfork.org/scripts/532708/Poxelio%20FREE%20Premium.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const originalFetch = window.fetch;
    window.fetch = async function(input, init) {
        const url = typeof input === 'string' ? input : input.url;
        if (/poxel\.io\/api\/accounts\/profile$/.test(url)) {
            const response = await originalFetch(input, init);
            const clone = response.clone();

            const text = await clone.text();
                const data = JSON.parse(text);
                data.premiumEnds = "2031-01-01T00:00:00.000Z";
                const modifiedResponse = new Response(JSON.stringify(data), {
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers
                });
                return modifiedResponse;
        }

        return originalFetch(input, init);
    };
})();
