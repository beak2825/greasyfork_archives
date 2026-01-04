// ==UserScript==
// @name         Alegra POS Invoice Watcher
// @namespace    http://tampermonkey.net/
// @version      0.5.4
// @description  Displays invoice items, subtotal, and calculated total in real time in a styled popup window
// @author       Bricen U
// @match        https://pos.alegra.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536341/Alegra%20POS%20Invoice%20Watcher.user.js
// @updateURL https://update.greasyfork.org/scripts/536341/Alegra%20POS%20Invoice%20Watcher.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Create popup window
    const popup = window.open('', 'AlegraPOSWatcher', 'width=400,height=600,scrollbars=yes,resizable=yes');

    // Get popup document
    const popupDoc = popup.document;

    // Write HTML and CSS to popup
    popupDoc.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Alegra POS Invoice Watcher</title>
            <style>
                body {
                    margin: 0;
                    padding: 20px;
                    background-color: #1a1a1a;
                    color: #ffffff;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    display: flex;
                    justify-content: center;
                    min-height: 100vh;
                    box-sizing: border-box;
                }
                .container {
                    background-color: #2a2a2a;
                    border-radius: 12px;
                    padding: 20px;
                    width: 100%;
                    max-width: 360px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                    overflow-y: auto;
                    max-height: calc(100vh - 40px);
                }
                .header {
                    font-size: 20px;
                    font-weight: 600;
                    margin-bottom: 20px;
                    border-bottom: 1px solid #444;
                    padding-bottom: 10px;
                }
                .items-list {
                    margin-bottom: 20px;
                }
                .item {
                    padding: 10px 0;
                    font-size: 16px;
                    border-bottom: 1px solid #3a3a3a;
                    opacity: 0;
                    transform: translateY(10px);
                    animation: fadeIn 0.3s ease forwards;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .item-name {
                    flex: 1;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .item-price {
                    color: #4CAF50;
                    font-weight: 500;
                    min-width: 80px;
                    text-align: right;
                }
                .totals {
                    background-color: #333;
                    border-radius: 8px;
                    padding: 15px;
                }
                .total-row {
                    display: flex;
                    justify-content: space-between;
                    font-size: 16px;
                    margin: 8px 0;
                }
                .total-row.label {
                    font-weight: 500;
                }
                .total-row.value {
                    color: #4CAF50;
                }
                .total-row.total {
                    font-size: 18px;
                    font-weight: 600;
                    border-top: 1px solid #444;
                    padding-top: 10px;
                    margin-top: 10px;
                }
                .loading {
                    text-align: center;
                    font-size: 16px;
                    color: #888;
                }
                @keyframes fadeIn {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @media (max-width: 360px) {
                    .container {
                        padding: 15px;
                    }
                    .header {
                        font-size: 18px;
                    }
                    .item, .total-row {
                        font-size: 14px;
                    }
                    .item-price {
                        min-width: 60px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">Invoice</div>
                <div class="items-list" id="itemsList">
                    <div class="loading">Watching...</div>
                </div>
                <div class="totals" id="totals">
                    <div class="total-row">
                        <span class="label">Subtotal:</span>
                        <span class="value">B/.0.00</span>
                    </div>
                    <div class="total-row">
                        <span class="label">Exento:</span>
                        <span class="value">B/.0.00</span>
                    </div>
                    <div class="total-row total">
                        <span class="label">Total:</span>
                        <span class="value">B/.0.00</span>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `);

    let lastContent = '';

    function parseCurrency(text) {
        if (!text) return 0;
        let cleaned = text.replace('B/.', '').trim();
        cleaned = cleaned.replace(/[^\d.]/g, '');
        if (cleaned.startsWith('.')) {
            cleaned = cleaned.substring(1);
        }
        return parseFloat(cleaned) || 0;
    }

    function updatePopup() {
        // Get all item containers
        const itemContainers = document.querySelectorAll('.new-active-invoice__item');
        const items = Array.from(itemContainers).map(container => {
            // Extract name and total price from within the same container
            const nameEl = container.querySelector('.new-active-invoice__item-name.name-large.text-truncate');
            const priceEl = container.querySelector('[data-testid="item-selected-total"]');

            const name = nameEl ? nameEl.textContent.trim() : '';
            const priceRaw = priceEl ? priceEl.textContent.trim() : 'B/.0.00';
            const price = parseCurrency(priceRaw).toFixed(2);

            return { name, price: `B/.${price}` };
        }).filter(item => item.name);

        const subtotalEl = document.querySelector('.text-capitalize-first.text-muted.number');
        const subtotalRaw = subtotalEl ? subtotalEl.textContent.trim() : null;
        const subtotal = parseCurrency(subtotalRaw);

        let exento = 0;
        const descEls = document.querySelectorAll('.text-capitalize-first.desc');
        for (let el of descEls) {
            if (el.textContent.trim().startsWith('Exento')) {
                const numberEl = el.parentElement.querySelector('.text-capitalize-first.text-muted.number');
                if (numberEl) {
                    exento = parseCurrency(numberEl.textContent.trim());
                    break;
                }
            }
        }

        const total = subtotal + exento;

        const content = [
            ...items.map(item => `${item.name}: ${item.price}`),
            `Subtotal: B/.${subtotal.toFixed(2)}`,
            `Exento: B/.${exento.toFixed(2)}`,
            `Total: B/.${total.toFixed(2)}`
        ].join('\n');

        if (content !== lastContent && !popup.closed) {
            // Update items list
            const itemsList = popupDoc.getElementById('itemsList');
            itemsList.innerHTML = items.length > 0
                ? items.map(item => `<div class="item"><span class="item-name">${item.name}</span><span class="item-price">${item.price}</span></div>`).join('')
                : '<div class="loading">No items yet</div>';

            // Update totals
            const totals = popupDoc.getElementById('totals');
            totals.innerHTML = `
                <div class="total-row">
                    <span class="label">Subtotal:</span>
                    <span class="value">B/.${subtotal.toFixed(2)}</span>
                </div>
                <div class="total-row">
                    <span class="label">Exento:</span>
                    <span class="value">B/.${exento.toFixed(2)}</span>
                </div>
                <div class="total-row total">
                    <span class="label">Total:</span>
                    <span class="value">B/.${total.toFixed(2)}</span>
                </div>
            `;
            lastContent = content;
        }
    }

    // Update every 200ms
    const intervalId = setInterval(updatePopup, 200);

    // Clean up when popup is closed
    popup.onunload = () => {
        clearInterval(intervalId);
    };
})();