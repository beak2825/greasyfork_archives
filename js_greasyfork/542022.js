// ==UserScript==
// @name         eBay Show Total Price (Item + Shipping) with Settings
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds shipping price to item price on eBay search results, with live settings for tax, color, and size. Enhanced UI with toggle and click-off-to-close.
// @author       You
// @match        https://www.ebay.*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542022/eBay%20Show%20Total%20Price%20%28Item%20%2B%20Shipping%29%20with%20Settings.user.js
// @updateURL https://update.greasyfork.org/scripts/542022/eBay%20Show%20Total%20Price%20%28Item%20%2B%20Shipping%29%20with%20Settings.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Settings ---
    const SETTINGS_KEY = 'ebay-total-settings';
    const defaultSettings = {
        taxRate: 0,
        textColor: '#d0021b',
        textSize: '16px'
    };

    function loadSettings() {
        try {
            return Object.assign({}, defaultSettings, JSON.parse(localStorage.getItem(SETTINGS_KEY)));
        } catch {
            return {...defaultSettings};
        }
    }

    function saveSettings(settings) {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }

    let settings = loadSettings();

    // --- Settings Window ---
    function createSettingsWindow() {
        const win = document.createElement('div');
        win.id = 'ebay-settings';
        win.style.position = 'fixed';
        win.style.top = '20px';
        win.style.right = '20px';
        win.style.zIndex = '2147483647'; // Max z-index
        win.style.background = '#fff';
        win.style.border = '1px solid #ccc';
        win.style.padding = '12px 18px 12px 12px';
        win.style.borderRadius = '8px';
        win.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
        win.style.fontFamily = 'sans-serif';
        win.style.fontSize = '14px';
        win.style.userSelect = 'none';
        win.style.cursor = 'move';
        win.style.display = 'none';

        win.innerHTML = `
            <div style="font-weight:bold;margin-bottom:8px;cursor:move;">eBay Total Price Settings</div>
            <label>Tax Rate (%): <input type="number" min="0" max="100" step="0.01" id="tax-rate" style="width:60px" value="${settings.taxRate}"></label><br>
            <label>Text Color: <input type="color" id="text-color" value="${settings.textColor}"></label><br>
            <label>Text Size: <input type="number" min="10" max="48" id="text-size" style="width:60px" value="${parseInt(settings.textSize)}"> px</label><br>
            <button id="close-settings" style="margin-top:8px;">×</button>
        `;

        document.body.appendChild(win);

        // Drag functionality
        let isDragging = false, offsetX = 0, offsetY = 0;
        win.addEventListener('mousedown', function(e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') return;
            isDragging = true;
            offsetX = e.clientX - win.offsetLeft;
            offsetY = e.clientY - win.offsetTop;
        });
        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                win.style.left = (e.clientX - offsetX) + 'px';
                win.style.top = (e.clientY - offsetY) + 'px';
                win.style.right = 'auto';
            }
        });
        document.addEventListener('mouseup', function() { isDragging = false; });

        // Live update handlers
        win.querySelector('#tax-rate').addEventListener('input', function(e) {
            settings.taxRate = parseFloat(e.target.value) || 0;
            saveSettings(settings);
            processedItems.clear();
            updatePrices();
        });
        win.querySelector('#text-color').addEventListener('input', function(e) {
            settings.textColor = e.target.value;
            saveSettings(settings);
            processedItems.clear();
            updatePrices();
        });
        win.querySelector('#text-size').addEventListener('input', function(e) {
            settings.textSize = e.target.value + 'px';
            saveSettings(settings);
            processedItems.clear();
            updatePrices();
        });

        // Close button
        win.querySelector('#close-settings').onclick = function() {
            win.style.display = 'none';
        };

        // Click-off-to-close
        document.addEventListener('mousedown', function(e) {
            const btn = document.getElementById('ebay-settings-btn');
            if (
                win.style.display !== 'none' &&
                !win.contains(e.target) &&
                (!btn || !btn.contains(e.target))
            ) {
                win.style.display = 'none';
            }
        });
    }

    // --- Settings Button ---
    function createSettingsButton() {
        const btn = document.createElement('button');
        btn.id = 'ebay-settings-btn';
        btn.textContent = '⚙️';
        btn.title = 'eBay Total Price Settings';
        btn.style.position = 'fixed';
        btn.style.top = '20px';
        btn.style.right = '20px';
        btn.style.zIndex = '2147483647';
        btn.style.background = '#fff';
        btn.style.border = '1px solid #ccc';
        btn.style.borderRadius = '50%';
        btn.style.width = '36px';
        btn.style.height = '36px';
        btn.style.fontSize = '18px';
        btn.style.cursor = 'pointer';
        btn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.10)';
        btn.onclick = function() {
            const win = document.getElementById('ebay-settings');
            win.style.display = (win.style.display === 'none' || win.style.display === '') ? 'block' : 'none';
        };
        document.body.appendChild(btn);
    }

    // --- Price Calculation ---
    function parsePrice(str) {
        if (!str) return 0;
        let match = str.replace(/,/g, '').match(/[\d,.]+/);
        return match ? parseFloat(match[0]) : 0;
    }

    // --- Optimized Update ---
    const processedItems = new Set();

    function updatePrices() {
        settings = loadSettings();
        const items = document.querySelectorAll('[data-view*="mi:1686"]')
            .length ? document.querySelectorAll('[data-view*="mi:1686"]')
            : document.querySelectorAll('.s-item');

        items.forEach(item => {
            if (processedItems.has(item)) return;

            const priceElem = item.querySelector('.s-item__price');
            if (!priceElem) return;

            let shippingElem = item.querySelector('.s-item__shipping, .s-item__logisticsCost');
            let shippingText = shippingElem ? shippingElem.textContent.trim() : '';

            let shippingPrice = 0;
            if (/free shipping/i.test(shippingText) || /shipping in \d+ day/i.test(shippingText)) {
                shippingPrice = 0;
            } else {
                shippingPrice = parsePrice(shippingText);
            }

            let itemPrice = parsePrice(priceElem.textContent);

            // Apply tax
            let total = itemPrice + shippingPrice;
            if (settings.taxRate > 0) {
                total += total * (settings.taxRate / 100);
            }

            // Remove old total price if present
            let old = item.querySelector('.total-price');
            if (old) old.remove();

            // Add total price display
            const totalElem = document.createElement('div');
            totalElem.className = 'total-price';
            totalElem.style.fontWeight = 'bold';
            totalElem.style.color = settings.textColor;
            totalElem.style.fontSize = settings.textSize;
            totalElem.textContent = `Total: $${total.toFixed(2)}`;
            priceElem.parentNode.insertBefore(totalElem, priceElem.nextSibling);

            processedItems.add(item);
        });
    }

    // Debounce utility
    function debounce(fn, delay) {
        let timer = null;
        return function() {
            clearTimeout(timer);
            timer = setTimeout(fn, delay);
        };
    }

    // --- Initialize ---
    createSettingsButton();
    createSettingsWindow();
    updatePrices();

    // Observe for dynamic content, but debounce updates
    const debouncedUpdate = debounce(updatePrices, 400);
    const observer = new MutationObserver(debouncedUpdate);
    observer.observe(document.body, { childList: true, subtree: true });
})();