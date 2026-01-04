// ==UserScript==
// @name         eBay Shipping Cost Calculator
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Adds shipping cost to item price in eBay search results
// @author       none
// @match        https://www.ebay.com/sch/*
// @icon         https://www.ebay.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513999/eBay%20Shipping%20Cost%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/513999/eBay%20Shipping%20Cost%20Calculator.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- Config / selectors ---
    const SELECTORS = {
        container: '.srp-river-main',
        item: 'li.s-item, .s-item, .s-card, [data-view], [role="listitem"]',
        price: '.s-card__price, .s-item__price, .s-item__detail .s-item__price',
        totalClass: 's-item__total',
    };

    const RE = {
        anyMoney: /\$\s*([\d,]+(?:\.\d{1,2})?)/g,
        singleMoney: /\$\s*([\d,]+(?:\.\d{1,2})?)/,
        plusMoney: /(?:\+|plus)\s*\$\s*([\d,]+(?:\.\d{1,2})?)/i,
        shippingWords: /\b(shipping|delivery|ship)\b/i,
        freeShipping: /free\s*shipping|free$/i
    };

    // --- Settings (persisted) ---
    const settings = {
        taxRate: Number(localStorage.getItem('ebayTaxRate') || '0'),
        color: localStorage.getItem('ebayTotalColor') || '#e42648',
        fontSize: localStorage.getItem('ebayTotalFontSize') || '18',
        currencyRate: Number(localStorage.getItem('ebayCurrencyRate') || '0'),
        currencyLabel: localStorage.getItem('ebayCurrencyLabel') || ''
    };

    // --- Utilities ---
    function toNumber(str) {
        if (str == null) return null;
        return parseFloat(String(str).replace(/[,$\s]/g, ''));
    }

    function formatMoney(n) {
        return '$' + Number(n).toFixed(2);
    }

    // Extract monetary values from a string; returns array of numbers in order
    function extractMoneyValues(text) {
        const out = [];
        if (!text) return out;
        let m;
        while ((m = RE.anyMoney.exec(text)) !== null) {
            out.push(toNumber(m[1]));
        }
        return out;
    }

    // Try to determine price and shipping from an item element
    // Returns { price: number|null, shipping: number|null }
    function detectPriceAndShipping(item) {
        let price = null;
        let shipping = null;

        const itemText = item.textContent || '';

        // Quick global check for '+$X' anywhere in the item text (covers +$1.97 delivery cases)
        const globalPlus = itemText.match(RE.plusMoney);
        if (globalPlus) {
            shipping = toNumber(globalPlus[1]);
        }

        // 1) Try to find explicit price element
        const priceEl = item.querySelector(SELECTORS.price);
        if (priceEl) {
            const t = priceEl.textContent || '';
            const p = t.match(RE.singleMoney);
            if (p) price = toNumber(p[1]);
        }

        // 2) Scan for obvious shipping nodes: elements that contain '+' or 'delivery' or 'shipping'
        const potential = Array.from(item.querySelectorAll('span,div,li,p,small'));

        for (const el of potential) {
            const txt = (el.textContent || '').trim();
            if (!txt) continue;
            // free shipping
            if (RE.freeShipping.test(txt)) { shipping = 0; break; }
            // explicit +$X
            const plus = txt.match(RE.plusMoney);
            if (plus) { shipping = toNumber(plus[1]); break; }
            // words indicating shipping/delivery
            if (RE.shippingWords.test(txt)) {
                // try to extract numeric value
                const vals = extractMoneyValues(txt);
                if (vals.length === 1) { shipping = vals[0]; break; }
                // if none or multiple, continue scanning
            }
        }

        // 3) If price missing, attempt to pick the largest $ amount on the whole item as price
    // (itemText already defined above)
    const allValues = extractMoneyValues(itemText);
        if (price == null && allValues.length > 0) {
            price = Math.max(...allValues);
        }

        // 4) If shipping still missing, try heuristics: prefer smaller distinct amount or next after '+' near text
    if (shipping == null && allValues.length > 0) {
            // if there are exactly 2 different values, assume smaller is shipping
            const uniq = Array.from(new Set(allValues)).sort((a, b) => a - b);
            if (uniq.length >= 2) {
                // if price is known and equals largest, take next smaller; else take smallest
                if (price != null && Math.abs(price - uniq[uniq.length - 1]) < 0.001) {
                    shipping = uniq[uniq.length - 2];
                } else {
                    const candidate = uniq.find(v => v > 0 && v !== price);
                    if (candidate) shipping = candidate;
                }
            }
        }

        // 5) Final fallback: search near price element for any $ amount that's not equal to price
        if (shipping == null && price != null && priceEl) {
            const nearbyText = (priceEl.parentElement && priceEl.parentElement.textContent) || '';
            const nearVals = extractMoneyValues(nearbyText).filter(v => Math.abs(v - price) > 0.001);
            if (nearVals.length > 0) shipping = nearVals.reduce((a, b) => Math.min(a, b));
        }



        return { price: price || null, shipping: shipping || null };
    }

    // Render/update total element for an item
    function renderTotal(item, price, shipping) {
        if (price == null || shipping == null) return;
        let total = price + shipping;
        if (settings.taxRate && settings.taxRate > 0) total = total * (1 + settings.taxRate / 100);

        // find existing total element
        let totalEl = item.querySelector('.' + SELECTORS.totalClass);
        if (!totalEl) {
            totalEl = document.createElement('div');
            totalEl.className = SELECTORS.totalClass;
            // insert after price element if possible
            const priceEl = item.querySelector(SELECTORS.price);
            if (priceEl && priceEl.parentElement) priceEl.parentElement.insertBefore(totalEl, priceEl.nextSibling);
            else item.appendChild(totalEl);
        }

        totalEl.dataset.total = total.toFixed(2);
        totalEl.textContent = `Total: ${formatMoney(total)}`;
        if (settings.currencyRate && settings.currencyRate > 0) {
            const converted = (total * settings.currencyRate).toFixed(2);
            const label = settings.currencyLabel ? settings.currencyLabel + ' ' : '';
            totalEl.textContent += ` (${label}${Number(converted).toFixed(2)})`;
        }
        totalEl.style.color = settings.color;
        totalEl.style.fontWeight = 'bold';
        totalEl.style.fontSize = settings.fontSize + 'px';
    }

    // Main loop: scan items and add totals
    function addShippingToPrices() {
        const scope = document.querySelector(SELECTORS.container) || document.body;
        const items = Array.from(scope.querySelectorAll(SELECTORS.item));
        for (const item of items) {
            if (item.classList && item.classList.contains('processed')) continue;
            const { price, shipping } = detectPriceAndShipping(item);
            if (price != null && shipping != null) renderTotal(item, price, shipping);
            item.classList.add('processed');
        }
    }

    // Simple settings UI: floating button + panel
    function createSettingsUI() {
        // If body isn't available yet, wait for DOMContentLoaded and retry
        if (!document.body) {
            document.addEventListener('DOMContentLoaded', createSettingsUI);
            return;
        }
        const btn = document.createElement('div');
        btn.id = 'ebay-settings-button';
        btn.style.position = 'fixed';
        btn.style.top = '12px';
        btn.style.right = '12px';
        btn.style.width = '34px';
        btn.style.height = '34px';
        btn.style.borderRadius = '50%';
        btn.style.background = settings.color;
        btn.style.zIndex = 2147483647;
        btn.style.cursor = 'pointer';
        btn.style.pointerEvents = 'auto';
        btn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.25)';
        btn.style.backdropFilter = 'none';
        btn.setAttribute('title', 'eBay Shipping Settings (Alt+S)');
        btn.setAttribute('aria-label', 'eBay Shipping Settings');
        document.body.appendChild(btn);

        const panel = document.createElement('div');
        panel.id = 'ebay-shipping-settings';
        panel.style.position = 'fixed';
        panel.style.top = '44px';
        panel.style.right = '12px';
        panel.style.padding = '12px';
        panel.style.background = '#fff';
        panel.style.border = '1px solid #ccc';
        panel.style.zIndex = 2147483647;
        panel.style.display = 'none';
        panel.innerHTML = `
            <div style="font-weight:bold;margin-bottom:8px">Shipping Calculator Settings</div>
            Tax Rate (%): <input id="ebay-tax-rate" type="number" min="0" max="100" step="0.01" value="${settings.taxRate}" style="width:70px"><br>
            Color: <input id="ebay-total-color" type="color" value="${settings.color}"><br>
            Size: <input id="ebay-total-fontsize" type="number" min="12" max="36" value="${settings.fontSize}" style="width:70px"><br>
            Currency Rate: <input id="ebay-currency-rate" type="number" step="0.0001" value="${settings.currencyRate || ''}" style="width:90px"><br>
            Currency Label: <input id="ebay-currency-label" type="text" value="${settings.currencyLabel}" style="width:90px"><br>
        `;
    // append in a microtask to avoid races with other scripts
    Promise.resolve().then(() => document.body.appendChild(panel));

        btn.textContent = '⚙';
        btn.style.color = '#fff';
        btn.style.display = 'flex';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'center';
        btn.style.fontSize = '14px';
        // stopPropagation so the document click handler doesn't immediately close the panel
        btn.addEventListener('click', (e) => { e.stopPropagation(); panel.style.display = panel.style.display === 'none' ? 'block' : 'none'; });

        // keyboard shortcut Alt+S to toggle settings
        document.addEventListener('keydown', (ev) => {
            if (ev.altKey && ev.key && ev.key.toLowerCase() === 's') {
                ev.preventDefault();
                ev.stopPropagation();
                panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
            }
        });
        panel.addEventListener('click', e => e.stopPropagation());
        document.addEventListener('click', () => { panel.style.display = 'none'; });

        panel.querySelector('#ebay-tax-rate').addEventListener('input', function () { settings.taxRate = Number(this.value) || 0; localStorage.setItem('ebayTaxRate', settings.taxRate); rescan(); });
        panel.querySelector('#ebay-total-color').addEventListener('input', function () { settings.color = this.value; localStorage.setItem('ebayTotalColor', settings.color); rescanVisuals(); });
        panel.querySelector('#ebay-total-fontsize').addEventListener('input', function () { settings.fontSize = this.value; localStorage.setItem('ebayTotalFontSize', settings.fontSize); rescanVisuals(); });
        panel.querySelector('#ebay-currency-rate').addEventListener('input', function () { settings.currencyRate = Number(this.value) || 0; localStorage.setItem('ebayCurrencyRate', settings.currencyRate); rescan(); });
    panel.querySelector('#ebay-currency-label').addEventListener('input', function () { settings.currencyLabel = this.value; localStorage.setItem('ebayCurrencyLabel', settings.currencyLabel); rescanVisuals(); });
    }

    function rescanVisuals() {
        const scope = document.querySelector(SELECTORS.container) || document.body;
        const totals = scope.querySelectorAll('.' + SELECTORS.totalClass);
        totals.forEach(el => {
            el.style.color = settings.color;
            el.style.fontSize = settings.fontSize + 'px';
            // re-render text if numeric stored
            if (el.dataset && el.dataset.total) el.textContent = `Total: ${formatMoney(Number(el.dataset.total))}`;
        });
    }

    function rescan() {
        // remove processed and re-run
        const scope = document.querySelector(SELECTORS.container) || document.body;
        const sel = SELECTORS.item.split(',').map(s => s.trim());
        sel.forEach(s => {
            try { scope.querySelectorAll(s + '.processed').forEach(el => el.classList.remove('processed')); } catch (e) {}
        });
        addShippingToPrices();
    }

    // Observe container changes
    function initObserver() {
        const container = document.querySelector(SELECTORS.container);
        if (!container) return;
        const obs = new MutationObserver(() => setTimeout(addShippingToPrices, 200));
        obs.observe(container, { childList: true, subtree: true });
    }

    // Init
    createSettingsUI();
    addShippingToPrices();

    initObserver();

})();