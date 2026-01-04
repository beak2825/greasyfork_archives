// ==UserScript==
// @name         LuckyLand Slots SKU Modifier
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  Modifies SKU number in purchase requests
// @author       Angus
// @match        https://luckylandslots.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/519498/LuckyLand%20Slots%20SKU%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/519498/LuckyLand%20Slots%20SKU%20Modifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const skuOptions = [
        { id: '276', desc: '250.0 Sweeps - $50.00 (1,750,000 Gold Coins)' },
        { id: '275', desc: '200.0 Sweeps - $50.00 (1,500,000 Gold Coins)' },
        { id: '264', desc: '125.0 Sweeps - $25.00 (1,250,000 Gold Coins)' },
        { id: '781', desc: '100.0 Sweeps - $10.00 (1,000,000 Gold Coins)' },
        { id: '263', desc: '100.0 Sweeps - $25.00 (1,000,000 Gold Coins)' },
        { id: '807', desc: '100.0 Sweeps - $30.00 (1,000,000 Gold Coins)' },
        { id: '266', desc: '75.0 Sweeps - $15.00 (500,000 Gold Coins)' },
        { id: '282', desc: '100.0 Sweeps - $50.00 (1,000,000 Gold Coins)' },
        { id: '346', desc: '100.0 Sweeps - $50.00 (1,000,000 Gold Coins)' },
        { id: '778', desc: '100.0 Sweeps - $50.00 (1,000,000 Gold Coins)' },
        { id: '798', desc: '100.0 Sweeps - $50.00 (1,000,000 Gold Coins)' },
        { id: '265', desc: '60.0 Sweeps - $15.00 (350,000 Gold Coins)' },
        { id: '278', desc: '50.0 Sweeps - $10.00 (250,000 Gold Coins)' },
        { id: '808', desc: '50.0 Sweeps - $15.00 (250,000 Gold Coins)' },
        { id: '795', desc: '100.0 Sweeps - $66.00 (1,000,000 Gold Coins)' },
        { id: '775', desc: '80.0 Sweeps - $48.00 (400,000 Gold Coins)' },
        { id: '84', desc: '40.0 Sweeps - $10.00 (200,000 Gold Coins)' },
        { id: '277', desc: '40.0 Sweeps - $10.00 (200,000 Gold Coins)' },
        { id: '284', desc: '60.0 Sweeps - $30.00 (350,000 Gold Coins)' },
        { id: '746', desc: '50.0 Sweeps - $20.00 (250,000 Gold Coins)' }
    ];

    let selectedSku = '276';
    try {
        const stored = localStorage.getItem('selectedSku');
        if (stored) selectedSku = stored;
    } catch (e) {}

    function createUI() {
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            padding: 10px;
            border-radius: 5px;
            z-index: 9999;
            color: white;
            font-family: Arial, sans-serif;
        `;

        const label = document.createElement('label');
        label.textContent = 'Select SKU: ';
        label.style.marginRight = '10px';

        const select = document.createElement('select');
        select.style.cssText = `
            padding: 5px;
            border-radius: 3px;
            background: white;
            color: black;
        `;

        skuOptions.forEach(sku => {
            const option = document.createElement('option');
            option.value = sku.id;
            option.textContent = `SKU ${sku.id}: ${sku.desc}`;
            select.appendChild(option);
        });

        select.value = selectedSku;
        select.addEventListener('change', (e) => {
            selectedSku = e.target.value;
            try {
                localStorage.setItem('selectedSku', selectedSku);
            } catch (e) {}
        });

        container.appendChild(label);
        container.appendChild(select);
        document.body.appendChild(container);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createUI);
    } else {
        createUI();
    }

    const XHR = XMLHttpRequest.prototype;
    const open = XHR.open;
    const send = XHR.send;
    const setRequestHeader = XHR.setRequestHeader;

    const skuPattern = /store\.llc\.prod\.vgw-us\.com\/v1\/skus\/.+\/purchase/;

    XHR.open = function() {
        this._url = arguments[1];
        if (skuPattern.test(this._url)) {
            arguments[1] = arguments[1].replace(/\/skus\/(.+)\/purchase/, `/skus/${selectedSku}/purchase`);
        }
        return open.apply(this, arguments);
    };

    XHR.setRequestHeader = function() {
        return setRequestHeader.apply(this, arguments);
    };

    XHR.send = function() {
        return send.apply(this, arguments);
    };

    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        const [resource, config] = args;

        if (typeof resource === 'string' && skuPattern.test(resource)) {
            args[0] = resource.replace(/\/skus\/(.+)\/purchase/, `/skus/${selectedSku}/purchase`);
        }

        return originalFetch.apply(this, args);
    };
})();