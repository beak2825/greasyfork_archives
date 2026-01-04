// ==UserScript==
// @name         CacheTracker
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Infobox showing lowest prices of each RW cache
// @author       Shedu
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      torn.com
// @connect      weav3r.dev
// @downloadURL https://update.greasyfork.org/scripts/532071/CacheTracker.user.js
// @updateURL https://update.greasyfork.org/scripts/532071/CacheTracker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const apiKey = '46f2GOfE0zxzDogt'; // Replace with your key
    const itemMap = {
        1118: 'Armor',
        1119: 'Melee',
        1120: 'Small',
        1121: 'Medium',
        1122: 'Heavy'
    };

    // Create Market Box
    const marketBox = document.createElement('div');
    marketBox.id = 'cache-price-market';
    marketBox.innerHTML = `<strong>Market Prices</strong><div>Loading...</div>`;
    document.body.appendChild(marketBox);

    // Create Bazaar Box
    const bazaarBox = document.createElement('div');
    bazaarBox.id = 'cache-price-bazaar';
    bazaarBox.innerHTML = `<strong>Bazaar Listings</strong><div>Loading...</div>`;
    document.body.appendChild(bazaarBox);

    // Styling
    GM_addStyle(`
    #cache-price-market, #cache-price-bazaar {
        position: fixed;
        left: 10px;
        background: rgba(0,0,0,0.85);
        color: white;
        padding: 10px;
        border-radius: 8px;
        font-family: Arial, sans-serif;
        font-size: 13px;
        z-index: 10000;
        width: 180px;
    }
    #cache-price-market { top: 15%; }
    #cache-price-bazaar { top: 30%; }
    #cache-price-market strong, #cache-price-bazaar strong {
        display: block;
        margin-bottom: 6px;
        font-size: 14px;
        text-align: center;
    }
    .cache-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 3px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        padding-bottom: 2px;
    }
    .cache-label {
        flex: 1;
        text-align: left;
    }
    .cache-value {
        flex-shrink: 0;
        text-align: right;
        margin-left: 10px;
    }
`);

    const formatPrice = (num) => {
        return `$${Number(num).toLocaleString()}`;
    };

    const getLowestMarketPrice = async (itemID) => {
        const url = `https://api.torn.com/v2/market/${itemID}/itemmarket?offset=0&key=${apiKey}`;
        try {
            const res = await fetch(url, {
                headers: { 'Accept': 'application/json' }
            });
            const data = await res.json();
            const listings = data?.itemmarket?.listings || [];
            if (listings.length === 0) return 'N/A';
            const prices = listings.map(l => l.price);
            return Math.min(...prices);
        } catch (err) {
            console.error(`Market fetch error [${itemID}]`, err);
            return 'ERR';
        }
    };

    const getLowestBazaarPrice = (itemID) => {
        return new Promise((resolve) => {
            const allListings = [];
            let responses = 0;

            const handleData = (data, source) => {
                if (data && (Array.isArray(data.bazaar_items) || Array.isArray(data.listings))) {
                    const listings = data.bazaar_items || data.listings;
                    listings.forEach(item => {
                        if (item?.price) allListings.push(item.price);
                    });
                }
                responses++;
                if (responses === 1) {
                    if (allListings.length === 0) return resolve('N/A');
                    resolve(Math.min(...allListings));
                }
            };

            const fetchBazaar = (url) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url,
                    onload: (res) => {
                        try {
                            const data = JSON.parse(res.responseText);
                            handleData(data);
                        } catch {
                            handleData(null);
                        }
                    },
                    onerror: () => handleData(null)
                });
            };

            fetchBazaar(`https://weav3r.dev/api/marketplace/${itemID}`);
        });
    };

    const updateMarketBox = async () => {
        const entries = await Promise.all(
            Object.entries(itemMap).map(async ([id, name]) => {
                const price = await getLowestMarketPrice(id);
                return `
                <div class="cache-row">
                    <span class="cache-label">${name}</span>
                    <span class="cache-value">${price !== 'N/A' ? formatPrice(price) : 'N/A'}</span>
                </div>`;
            })
        );
        marketBox.innerHTML = `<strong>Market Prices</strong>` + entries.join('');
    };

    const updateBazaarBox = async () => {
        const entries = await Promise.all(
            Object.entries(itemMap).map(async ([id, name]) => {
                const price = await getLowestBazaarPrice(id);
                return `
                <div class="cache-row">
                    <span class="cache-label">${name}</span>
                    <span class="cache-value">${price !== 'N/A' ? formatPrice(price) : 'N/A'}</span>
                </div>`;
            })
        );
        bazaarBox.innerHTML = `<strong>Bazaar Listings</strong>` + entries.join('');
    };

    updateMarketBox();
    updateBazaarBox();
})();