// ==UserScript==
// @name         [MWI] Dungeon Profit
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Shows most profitable items in Dungeon Shop
// @author       WataFX
// @license MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=milkywayidle.com
// @match        https://www.milkywayidle.com/game?characterId=*
// @grant        GM_xmlhttpRequest
// @connect      www.milkywayidle.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/541856/%5BMWI%5D%20Dungeon%20Profit.user.js
// @updateURL https://update.greasyfork.org/scripts/541856/%5BMWI%5D%20Dungeon%20Profit.meta.js
// ==/UserScript==


(async function() {
    'use strict';

    const tokenTypes = ['Chimerical Token','Sinister Token','Enchanted Token','Pirate Token'];
    const colors = {
        'Chimerical Token': { border: '2px solid white', boxShadow: '0 0 8px white' },
        'Sinister Token' : { border: '2px solid #C71585', boxShadow: '0 0 8px #C71585' },
        'Enchanted Token': { border: '2px solid #00BFFF', boxShadow: '0 0 8px #00BFFF' },
        'Pirate Token'   : { border: '2px solid #32CD32', boxShadow: '0 0 8px #32CD32' }
    };
    const apiUrl = 'https://www.milkywayidle.com/game_data/marketplace.json';
    const containerSelector = '.ShopPanel_shopItems__3QZSJ';
    const refreshIntervalMs = 60000;

    const log = (...args) => console.log('[MarketProfit]', ...args);
    const warn = (...args) => console.warn('[MarketProfit]', ...args);
    const error = (...args) => console.error('[MarketProfit]', ...args);

    const nameToSlug = name => {
        const cleaned = name.toLowerCase()
            .replace(/[‘’']/g, '')
            .replace(/[^a-z0-9]+/g, '_')
            .replace(/^_+|_+$/g, ''); 
        return '/items/' + cleaned;
    };
    function getMaxPrice(entries, key) {
        let max = null;
        for (const obj of Object.values(entries)) {
            const p = obj[key];
            if (p > 0 && (max === null || p > max)) max = p;
        }
        return max;
    }
    const debounce = (fn, delay) => {
        let t;
        return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
    };
    const isVisible = el => el && el.offsetParent !== null;

    let marketData = {};
    async function fetchMarketPrices() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET', url: apiUrl,
                onload(res) {
                    if (res.status >= 200 && res.status < 300) {
                        try {
                            const data = JSON.parse(res.responseText);
                            marketData = data.marketData || data.marketplace || {};
                            log('Market data loaded:', Object.keys(marketData).length, 'entries');
                            resolve();
                        } catch (e) {
                            error('JSON parse error', e);
                            reject(e);
                        }
                    } else {
                        error('HTTP error', res.status);
                        reject(res.status);
                    }
                },
                onerror(err) { error('Request error', err); reject(err); }
            });
        });
    }

    function annotateContainer(container) {
        const cards = container.querySelectorAll('.ShopPanel_shopItem__10Noo');
        if (!cards.length) return;
        if (!Object.keys(marketData).length) return;

        const grouped = {};
        cards.forEach(div => {
            div.querySelectorAll('.gm-profit-annotation').forEach(e => e.remove());
            div.style.border = '';
            div.style.boxShadow = '';
            div.style.padding = '';

            const nameEl = div.querySelector('.ShopPanel_name__3vA-H');
            const costEl = div.querySelector('.ShopPanel_costs__XffBM > div > div');
            if (!nameEl || !costEl) return;
            const name = nameEl.textContent.trim();
            const [amtText, ...tokParts] = costEl.textContent.trim().split(' ');
            const amount = parseInt(amtText.replace(/\D/g, ''), 10);
            const token = tokParts.join(' ');
            if (!tokenTypes.includes(token) || isNaN(amount)) return;

            const slug = nameToSlug(name);
            const entries = marketData[slug];
            if (!entries) return;
            const maxAsk = getMaxPrice(entries, 'a');
            const maxBid = getMaxPrice(entries, 'b');
            if (!maxAsk && !maxBid) return;
            const askValue = maxAsk ? maxAsk / amount : null;
            const bidValue = maxBid ? maxBid / amount : null;

            if (!grouped[token]) grouped[token] = [];
            grouped[token].push({ div, askValue, bidValue });
        });

        for (const token of Object.keys(grouped)) {
            const items = grouped[token];
            const best = items.reduce((m, c) => (c.bidValue || 0) > (m.bidValue || 0) ? c : m, items[0]);
            items.forEach(({ div, askValue, bidValue }) => {
                const parent = div.querySelector('.ShopPanel_costs__XffBM > div');
                if (askValue != null) {
                    const spanA = document.createElement('span');
                    spanA.className = 'gm-profit-annotation';
                    spanA.textContent = `ask: ${askValue.toFixed(2)}`;
                    spanA.style.display = 'block';
                    spanA.style.marginTop = '4px';
                    parent.appendChild(spanA);
                }
                if (bidValue != null) {
                    const spanB = document.createElement('span');
                    spanB.className = 'gm-profit-annotation';
                    spanB.textContent = `bid: ${bidValue.toFixed(2)}`;
                    spanB.style.display = 'block';
                    spanB.style.marginTop = '2px';
                    if (div === best.div) {
                        const style = colors[token];
                        div.style.border = style.border;
                        div.style.boxShadow = style.boxShadow;
                        div.style.padding = '4px';
                        spanB.style.fontWeight = 'bold';
                    }
                    parent.appendChild(spanB);
                }
            });
        }
    }

    function annotateVisible() {
        document.querySelectorAll(containerSelector).forEach(cont => {
            if (isVisible(cont)) annotateContainer(cont);
        });
    }

    try {
        await fetchMarketPrices();
        annotateVisible();
        setInterval(async () => {
            try { await fetchMarketPrices(); annotateVisible(); } catch {};
        }, refreshIntervalMs);
        document.body.addEventListener('click', annotateVisible);
        new MutationObserver(debounce(annotateVisible, 200)).observe(document.body, { childList: true, subtree: true });
    } catch (e) {
        error('Initialization failed', e);
    }
})();
