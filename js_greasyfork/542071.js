// ==UserScript==
// @name         Torn Inventory Checker
// @namespace    torn.inventory.checker
// @version      0.8.0
// @description  inventory checker
// @author       soko
// @match        https://www.torn.com/items.php*
// @match        https://www.torn.com/item.php*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/542071/Torn%20Inventory%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/542071/Torn%20Inventory%20Checker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('[TIC] Torn Inventory Checker script loaded');

    const WATCH_LIST = {
        'Xanax': 15,
        'Blood Bag : O+': 15,
        'Epinephrine': 15,
    };

    GM_addStyle(`
        #tic-summary {position:fixed;top:80px;right:20px;z-index:9999;background:#1d1d1d;color:#fff;border:2px solid #444;border-radius:8px;padding:8px 12px;font-family:Arial, sans-serif;font-size:14px;min-width:180px;line-height:1.4;}
        #tic-summary h3 {margin:0 0 6px 0;font-size:15px;text-align:center;}
        .tic-item-ok {color:#8aff8a;}
        .tic-item-low {color:#ff8484;font-weight:bold;}
        .tic-highlight {outline:3px solid #ff5555 !important;border-radius:6px;}
    `);

    function createSummaryPanel() {
        if (document.getElementById('tic-summary')) return;
        const box = document.createElement('div');
        box.id = 'tic-summary';
        box.innerHTML = '<h3>Inventory Check</h3><div id="tic-body">Scanning…</div>';
        document.body.appendChild(box);
    }

    function updateSummary(results) {
        const body = document.getElementById('tic-body');
        if (!body) return;
        body.innerHTML = Object.keys(WATCH_LIST).map(name => {
            const data = results[name] || {qty: 0, min: WATCH_LIST[name], ok: false};
            const cls  = data.ok ? 'tic-item-ok' : 'tic-item-low';
            return `<div class="${cls}">${name}: ${data.qty}/${data.min}</div>`;
        }).join('');
    }

    let lastResults = {};

    function parseInventory() {
        const wraps = document.querySelectorAll('span.name-wrap');
        const results = {...lastResults};

        wraps.forEach(w => {
            const nameEl = w.querySelector('span.name');
            const qtyEl  = w.querySelector('span.qty');
            if (!nameEl || !qtyEl) return;
            const item   = nameEl.textContent.trim();
            const qty    = parseInt(qtyEl.textContent.replace(/x/,'').trim(), 10) || 0;

            if (item in WATCH_LIST) {
                const min = WATCH_LIST[item];
                const ok  = qty >= min;
                if (!results[item] || results[item].qty !== qty) {
                    results[item] = {qty, min, ok};
                    const row = w.closest('tr') || w;
                    if (!ok) row.classList.add('tic-highlight');
                }
            }
        });

        lastResults = results;
        updateSummary(results);
    }

    function debounce(fn, delay = 300) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    function observeInventoryChanges() {
        const target = document.querySelector('#mainContainer');
        if (!target) return;

        const observer = new MutationObserver(debounce(() => {
            parseInventory();
        }, 300));

        observer.observe(target, {
            childList: true,
            subtree: true
        });
    }

    function initAfterRender() {
        createSummaryPanel();
        parseInventory();
        observeInventoryChanges();
    }

    function runOnceVisible(selector, callback, maxWait = 5000) {
        const start = performance.now();
        const interval = setInterval(() => {
            if (document.querySelector(selector)) {
                clearInterval(interval);
                callback();
            } else if (performance.now() - start > maxWait) {
                clearInterval(interval);
                console.warn('[TIC] Timeout waiting for inventory to render.');
            }
        }, 200);
    }

    runOnceVisible('span.name-wrap', initAfterRender);
})();
