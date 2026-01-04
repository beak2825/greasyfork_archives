// ==UserScript==
// @name         Display GG.Deals Prices in Buybox on Steam Page
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Fetch and display the top GG.Deals prices, including historical lows, in a new buybox on the Steam page
// @author       You
// @match        *://store.steampowered.com/app/*
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527266/Display%20GGDeals%20Prices%20in%20Buybox%20on%20Steam%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/527266/Display%20GGDeals%20Prices%20in%20Buybox%20on%20Steam%20Page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const steamAppId = window.location.pathname.match(/\/app\/(\d+)\//)?.[1];

    if (!steamAppId) {
        console.warn('Steam app ID not found in the URL.');
        return;
    }

    const ggDealsUrl = `https://gg.deals/steam/app/${steamAppId}/`;
    const ggDealsLogo = 'https://gg.deals/images/logo/logo-white.svg?v=c4392aa2';

    const createBuybox = (officialPrice, keyshopPrice, historicalOfficial, historicalKeyshop) => {
        const buybox = document.createElement('div');
        buybox.className = 'gg-deals-buybox';
        buybox.innerHTML = `
            <div style="padding: 16px; background-color: #202020; color: #d4d4d4; border: 1px solid #444; border-radius: 6px; margin-bottom: 16px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);">
                <div style="display: flex; align-items: center; margin-bottom: 12px;">
                    <img src="${ggDealsLogo}" alt="GG.Deals Logo" style="max-width: 200px; height: auto; margin-right: 10px;">
                </div>
                <div style="margin-bottom: 10px;">
                    <strong style="color: #fff;">Official Stores:</strong> ${officialPrice} <br>
                    <strong style="color: #fff;">Keyshops:</strong> ${keyshopPrice}
                </div>
                <div style="margin-bottom: 12px;">
                    <strong style="color: #fff;">Historical Low - Official Stores:</strong> ${historicalOfficial} <br>
                    <strong style="color: #fff;">Historical Low - Keyshops:</strong> ${historicalKeyshop}
                </div>
                <a href="${ggDealsUrl}" target="_blank" style="display: inline-block; background-color: #4caf50; color: #fff; padding: 8px 12px; border-radius: 4px; text-decoration: none; font-weight: bold; transition: background-color 0.2s;">
                    View on GG.Deals
                </a>
            </div>
        `;
        return buybox;
    };

    const insertBuybox = (buybox) => {
        const purchaseContainer = document.querySelector('#game_area_purchase');
        if (purchaseContainer) {
            purchaseContainer.insertAdjacentElement('afterbegin', buybox);
        } else {
            console.warn('Purchase container not found.');
        }
    };

    GM_xmlhttpRequest({
        method: 'GET',
        url: ggDealsUrl,
        onload: function(response) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, 'text/html');

            // Extract current prices
            const officialPrice = doc.querySelector('.game-header-price-box:nth-child(1) .price-inner.numeric')?.textContent.trim() || 'N/A';
            const keyshopPrice = doc.querySelector('.game-header-price-box:nth-child(2) .price-inner.numeric')?.textContent.trim() || 'N/A';

            // Extract historical low prices
            const historicalOfficial = doc.querySelector('#game-header-historical-low-prices .game-header-price-box:nth-child(1) .price-inner.numeric')?.textContent.trim() || 'N/A';
            const historicalKeyshop = doc.querySelector('#game-header-historical-low-prices .game-header-price-box:nth-child(2) .price-inner.numeric')?.textContent.trim() || 'N/A';

            // Create and insert the buybox
            const buybox = createBuybox(officialPrice, keyshopPrice, historicalOfficial, historicalKeyshop);
            insertBuybox(buybox);
        },
        onerror: function() {
            console.warn('Failed to fetch GG.Deals page.');
            const buybox = createBuybox('N/A', 'N/A', 'N/A', 'N/A');
            insertBuybox(buybox);
        }
    });
})();
