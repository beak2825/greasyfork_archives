// ==UserScript==
// @name         Dead Frontier Value On Hover (Fixed Version)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @license      MIT
// @description  Show only the total stack market value on hover in Dead Frontier Outpost. (Fixed data-name priority)
// @author       Zega (Fixed by ChatGPT)
// @match        https://fairview.deadfrontier.com/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/533952/Dead%20Frontier%20Value%20On%20Hover%20%28Fixed%20Version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/533952/Dead%20Frontier%20Value%20On%20Hover%20%28Fixed%20Version%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 🚀 Signal implant system if needed
    window.BrowserImplant_MarketHover = true;

    // (Optional) still pull pageData, but we'll favor element attributes
    const pageData = unsafeWindow.globalData || {};
    const itemNames = {};
    for (let id in pageData) {
        if (pageData[id] && pageData[id].name) {
            itemNames[id] = pageData[id].name;
        }
    }

    // Tooltip style
    const style = document.createElement('style');
    style.textContent = `
        .price-tooltip {
            position: absolute;
            background: rgba(0,0,0,0.85);
            color: #fff;
            padding: 6px 10px;
            font-size: 12px;
            border-radius: 6px;
            pointer-events: none;
            z-index: 9999;
            display: none;
        }
    `;
    document.head.appendChild(style);

    const tooltip = document.createElement('div');
    tooltip.className = 'price-tooltip';
    document.body.appendChild(tooltip);

    // Attach hover listeners
    function attachListeners() {
        document.querySelectorAll('.item:not([data-hover-added])').forEach(el => {
            el.setAttribute('data-hover-added', 'true');

            el.addEventListener('mouseenter', async e => {
                const type  = el.getAttribute('data-type');
                const name  = el.getAttribute('data-name') || itemNames[type]; // 🛠️ Prioritize element's data-name
                const stack = parseInt(el.getAttribute('data-quantity')) || 1;
                if (!name || stack < 1) return;

                console.log('Hovering over:', { name, stack }); // 🔍 For easy debugging

                // fetch per-unit price
                const unit = await fetchUnitPrice(name);
                if (unit == null) {
                    tooltip.textContent = 'No listings';
                } else {
                    const total = unit * stack;
                    tooltip.textContent = `$${total.toFixed(2)} total`;
                }

                // Delay a bit to ensure tooltip appears smooth (optional)
                setTimeout(() => {
                    tooltip.style.left    = `${e.pageX + 12}px`;
                    tooltip.style.top     = `${e.pageY + 12}px`;
                    tooltip.style.display = 'block';
                }, 0);
            });

            el.addEventListener('mouseleave', () => {
                tooltip.style.display = 'none';
            });
        });
    }

    const observer = new MutationObserver(attachListeners);
    observer.observe(document.body, { childList: true, subtree: true });
    attachListeners();

    // Fetch best per-unit price
    async function fetchUnitPrice(itemName) {
        const rawHash = getCookie('DeadFrontierFairview') || '';
        const hash    = decodeURIComponent(rawHash);
        const pagetime = Math.floor(Date.now() / 1000);
        const payload = {
            hash,
            pagetime,
            tradezone: 21,
            search: 'trades',
            searchtype: 'buyinglistitemname',
            searchname: itemName
        };

        try {
            const res  = await fetch('https://fairview.deadfrontier.com/onlinezombiemmo/trade_search.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Referer': location.href,
                    'Origin':  location.origin
                },
                body: Object.entries(payload)
                    .map(([k,v])=>`${k}=${encodeURIComponent(v)}`)
                    .join('&')
            });
            const text = await res.text();
            const matches = [...text.matchAll(/tradelist_\d+_price=(\d+)&.*?tradelist_\d+_quantity=(\d+)/g)]
                .map(m => Number(m[1]) / Number(m[2]))
                .sort((a,b) => a - b);
            return matches.length ? matches[0] : null;
        } catch (err) {
            console.error('fetchUnitPrice error', err);
            return null;
        }
    }

    // Get cookie helper
    function getCookie(name) {
        const v = `; ${document.cookie}`;
        const parts = v.split(`; ${name}=`);
        return parts.length === 2 ? parts.pop().split(';')[0] : '';
    }
})();
