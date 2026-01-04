// ==UserScript==
// @name         Torn Market Weapon Bonus Overlay
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Overlay weapon bonus % on every weapon icon tile in the Torn item market, auto-updating on lazy-load
// @author       fourzees [3002874]
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @license      MIT
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/535169/Torn%20Market%20Weapon%20Bonus%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/535169/Torn%20Market%20Weapon%20Bonus%20Overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ————————————————————————
    // 1) Load or prompt for API key
    // ————————————————————————
    let apiKey = localStorage.getItem('torn_api_key');
    if (!apiKey) {
        apiKey = prompt('Enter your Torn API V2 key:');
        if (!apiKey) {
            alert('Bonus overlay disabled: no API key.');
            return;
        }
        localStorage.setItem('torn_api_key', apiKey);
    }

    // ————————————————————————
    // 2) Helpers
    // ————————————————————————
    function getItemIdFromUrl() {
        const m = window.location.href.match(/[?&]itemID=(\d+)/i);
        return m ? m[1] : null;
    }

    function getSelectedBonus() {
        const btn = document.getElementById('itemMarket-bonusFilter');
        return btn ? btn.innerText.trim() : null;
    }

    function fetchMarketData(itemId, bonus, offset=0) {
        let url = `https://api.torn.com/v2/market/${itemId}/itemmarket?offset=${offset}&key=${apiKey}`;
        if (bonus) url += `&bonus=${encodeURIComponent(bonus)}`;
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url,
                responseType: 'json',
                onload(res) {
                    if (res.status === 200) {
                        let data = res.response;
                        if (typeof data === 'string') data = JSON.parse(data);
                        resolve(data);
                    } else {
                        reject(new Error('HTTP ' + res.status));
                    }
                },
                onerror(err) { reject(err); }
            });
        });
    }

    function overlayBonusOn(tile, pct) {
        let badge = tile.querySelector('.bonus-badge');
        if (!badge) {
            badge = document.createElement('div');
            badge.className = 'bonus-badge';
            Object.assign(badge.style, {
                position:      'absolute',
                top:           '4px',
                right:         '4px',
                background:    '#000000',
                color:         '#FF0000',
                fontSize:      '15px',
                padding:       '2px 4px',
                borderRadius:  '3px',
                pointerEvents: 'none',
                zIndex:        9999
            });
            tile.style.position = 'relative';
            tile.appendChild(badge);
        }
        badge.textContent = pct + '%';
    }

    // ————————————————————————
    // 3) Debounce utility
    // ————————————————————————
    function debounce(fn, wait) {
        let timer = null;
        return function() {
            clearTimeout(timer);
            timer = setTimeout(fn, wait);
        };
    }

    // ————————————————————————
    // 4) Main updater (pages of 60)
    // ————————————————————————
    async function updateOverlay() {
        const itemId = getItemIdFromUrl();
        if (!itemId) return;

        const bonus    = getSelectedBonus();
        const tiles    = Array.from(document.querySelectorAll('.itemTile___cbw7w'));
        const pageSize = 60;
        const pages    = Math.ceil(tiles.length / pageSize);

        try {
            const calls = [];
            for (let i = 0; i < pages; i++) {
                calls.push(
                    fetchMarketData(itemId, bonus, i * pageSize)
                      .then(data => ({ data, offset: i * pageSize }))
                );
            }
            const results = await Promise.all(calls);

            results.forEach(({ data, offset }) => {
                const listings = data.itemmarket?.listings || [];
                listings.forEach((lst, idx) => {
                    const tile = tiles[offset + idx];
                    const val  = lst.item_details?.bonuses?.[0]?.value;
                    if (tile && typeof val === 'number') {
                        overlayBonusOn(tile, val);
                    }
                });
            });
        } catch (err) {
            console.error('Weapon Bonus Overlay error:', err);
        }
    }

    const debouncedUpdate = debounce(updateOverlay, 500);

    // ————————————————————————
    // 5) Initialization & watchers
    // ————————————————————————
    function initWhenReady() {
        const btn       = document.getElementById('itemMarket-bonusFilter');
        const firstTile = document.querySelector('.itemTile___cbw7w');
        if (!btn || !firstTile) {
            return setTimeout(initWhenReady, 500);
        }

        // Re-run when bonus dropdown changes
        btn.addEventListener('click', () => setTimeout(updateOverlay, 400));
        new MutationObserver(updateOverlay).observe(btn, { attributes: true });

        // Re-run on any tile insertion (lazy-load) or scroll
        new MutationObserver(debouncedUpdate)
            .observe(document.body, { childList: true, subtree: true });
        window.addEventListener('scroll', debouncedUpdate);

        // Initial draw
        updateOverlay();
    }

    initWhenReady();

    // Also on Torn’s hash-router changes
    window.addEventListener('hashchange', () => setTimeout(updateOverlay, 400));
})();
