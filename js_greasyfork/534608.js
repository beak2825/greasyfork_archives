// ==UserScript==
// @name         Seasonal Gears Collection
// @namespace    http://tampermonkey.net/
// @version      v2
// @description  Get all the seasonal gears in 1 second.
// @author       CNN (Idea from Talent7 mod)
// @match        https://narrow.one/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/534608/Seasonal%20Gears%20Collection.user.js
// @updateURL https://update.greasyfork.org/scripts/534608/Seasonal%20Gears%20Collection.meta.js
// ==/UserScript==

(function() {
    const realFetch = window.fetch;

    async function modifyShopConfig(data) {
        const { purchasableItems, skinPresets } = data;

        purchasableItems.forEach((item) => {
            if (item.shopVisibility && !item.price) {
                delete item.shopVisibility;
            }
        });

        return {
            purchasableItems,
            skinPresets,
        };
    }

    window.fetch = async function(...args) {
        const url = args[0];

        if (typeof url === 'string' && url.includes("/config/shopConfig.json")) {
            console.log("Intercepted: " + url);
            const response = await realFetch.apply(this, args);
            //console.log("Original response:", response);

            if (!response.ok) {
                return response;
            }

            try {
                const originalData = await response.json();
                const modifiedData = await modifyShopConfig(originalData);
                //console.log("Modified data:", modifiedData);

                return new Response(JSON.stringify(modifiedData), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                });
            } catch (error) {
                console.error("Error parsing or modifying JSON:", error);
                const cloneResponse = response.clone();
                const text = await cloneResponse.text();
                return new Response(text, {
                    status: response.status,
                    headers: response.headers,
                });
            }
        }

        return realFetch.apply(this, args);
    };
})();