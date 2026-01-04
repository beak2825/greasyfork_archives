// ==UserScript==
// @name         Torn Stock Calculator
// @namespace    http://tampermonkey.net/
// @version      1.7.1
// @description  Mobile-friendly Torn stock calculator
// @author       Sanwise [3401293]
// @match        https://www.torn.com/page.php?sid=stocks*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540996/Torn%20Stock%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/540996/Torn%20Stock%20Calculator.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function extractPrice(priceDiv) {
        const spans = priceDiv.querySelectorAll('span.number___hhGqA');
        return parseFloat(Array.from(spans).map(span => span.textContent).join(''));
    }

    function waitForStocksAndInit() {
        const container = document.querySelector('div.stockMarket___iB18v');
        if (!container) return setTimeout(waitForStocksAndInit, 500);

        const stocks = [];
        const stockBlocks = container.querySelectorAll('ul[class*="stock__"]');
        stockBlocks.forEach(stockEl => {
            const nameEl = stockEl.querySelector('li[class*="stockName"]');
            const priceDiv = stockEl.querySelector('div.price___CTjJE');
            if (nameEl && priceDiv) {
                const name = nameEl.textContent.trim().replace(/^Stock:\s*/, '');
                const price = extractPrice(priceDiv);
                stocks.push({ name, price });
            }
        });

        if (stocks.length === 0) {
            setTimeout(waitForStocksAndInit, 500);
        } else {
            insertCalculator(stocks);
        }
    }

    function insertCalculator(stocks) {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);

        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '100px';
        container.style.left = '10px';
        container.style.zIndex = '10000';
        container.style.backgroundColor = '#222';
        container.style.color = '#fff';
        container.style.padding = '0';
        container.style.borderRadius = '8px';
        container.style.fontSize = '14px';
        container.style.width = '90vw';
        container.style.maxWidth = '350px';
        container.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        container.style.userSelect = 'none';
        container.style.transition = 'opacity 0.3s ease';

        container.innerHTML = `
            <div id="dragHandle" style="display:flex;align-items:center;justify-content:space-between;padding:10px;background:#444;cursor:move;border-top-left-radius:8px;border-top-right-radius:8px;font-weight:bold;">
                📈 Stock Calculator
                <button id="minimizeBtn" style="
                    background:transparent;
                    border:none;
                    color:#fff;
                    font-size:16px;
                    cursor:pointer;
                ">🗕</button>
            </div>
            <div id="calcBody" style="padding:15px">
                <label>Stock:
                    <select id="stockSelect" style="width:100%">
                        ${stocks.map(s => `<option value="${s.price}">${s.name}</option>`).join('')}
                    </select>
                </label><br><br>
                <label>💵 Target Amount ($): <input type="number" id="targetAmount" style="width:100%"/></label>
                <br><br>
                <label>📦 Desired Shares: <input type="number" id="desiredShares" style="width:100%"/></label>
                <br><br>
                <div id="calcResult" style="margin-top:10px;"></div>
            </div>
        `;

        document.body.appendChild(container);

        const priceSelect = container.querySelector('#stockSelect');
        const targetInput = container.querySelector('#targetAmount');
        const shareInput = container.querySelector('#desiredShares');
        const resultBox = container.querySelector('#calcResult');
        const calcBody = container.querySelector('#calcBody');
        const minimizeBtn = container.querySelector('#minimizeBtn');

        let minimized = false;
        minimizeBtn.addEventListener('click', () => {
            minimized = !minimized;
            calcBody.style.display = minimized ? 'none' : 'block';
            minimizeBtn.textContent = minimized ? '🗖' : '🗕';
        });

        function formatCash(value) {
            return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }

        function updateResult() {
            const price = parseFloat(priceSelect.value);
            const target = parseFloat(targetInput.value);
            const shares = parseFloat(shareInput.value);
            const taxRate = 0.001;

            if (!isNaN(target)) {
                const netMultiplier = 1 - taxRate;
                const neededShares = Math.ceil(target / (price * netMultiplier));
                const gross = neededShares * price;
                const tax = gross * taxRate;
                const net = gross - tax;

                resultBox.innerHTML = `
                    <b>→ To receive at least ${formatCash(target)} after tax:</b><br>
                    Buy <strong id="copyTarget">${neededShares}</strong> shares
                    <button id="copyBtn" style="
                        margin-left:10px;
                        padding:6px 10px;
                        border:none;
                        background:#1e90ff;
                        color:#fff;
                        font-weight:bold;
                        border-radius:6px;
                        cursor:pointer;
                        transition:background 0.2s ease;
                    ">📋 Copy</button><br>
                    Gross before tax: ${formatCash(gross)}<br>
                    Tax (0.1%): ${formatCash(tax)}<br>
                    <span style="color:lightgreen">Net after tax: ${formatCash(net)}</span>
                `;

                const copyBtn = document.getElementById('copyBtn');
                copyBtn.addEventListener('click', () => {
                    const shareVal = document.getElementById('copyTarget').textContent;
                    navigator.clipboard.writeText(shareVal).then(() => {
                        copyBtn.textContent = '✅ Copied!';
                        copyBtn.style.background = '#28a745';
                        copyBtn.style.animation = 'pulse 0.4s ease';
                        setTimeout(() => {
                            copyBtn.textContent = '📋 Copy';
                            copyBtn.style.background = '#1e90ff';
                            copyBtn.style.animation = 'none';
                        }, 1500);
                    });
                });

            } else if (!isNaN(shares)) {
                const gross = shares * price;
                const tax = gross * taxRate;
                const net = gross - tax;
                resultBox.innerHTML = `
                    <b>→ Selling ${shares} shares</b><br>
                    Gross: ${formatCash(gross)}<br>
                    Tax (0.1%): ${formatCash(tax)}<br>
                    <span style="color:lightgreen">Net after tax: ${formatCash(net)}</span>
                `;
            } else {
                resultBox.innerHTML = '';
            }
        }

        targetInput.addEventListener('input', () => {
            shareInput.value = '';
            updateResult();
        });

        shareInput.addEventListener('input', () => {
            targetInput.value = '';
            updateResult();
        });

        priceSelect.addEventListener('change', updateResult);

        // Drag + Touch support
        const dragHandle = document.getElementById('dragHandle');
        let isDragging = false;
        let startX = 0, startY = 0, offsetX = 0, offsetY = 0;

        const onMove = (x, y) => {
            container.style.left = `${x - offsetX}px`;
            container.style.top = `${y - offsetY}px`;
            container.style.right = 'auto';
        };

        const onDown = (x, y) => {
            isDragging = true;
            offsetX = x - container.offsetLeft;
            offsetY = y - container.offsetTop;
        };

        dragHandle.addEventListener('mousedown', (e) => {
            onDown(e.clientX, e.clientY);
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) onMove(e.clientX, e.clientY);
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        dragHandle.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            onDown(touch.clientX, touch.clientY);
        });

        document.addEventListener('touchmove', (e) => {
            if (isDragging) {
                const touch = e.touches[0];
                onMove(touch.clientX, touch.clientY);
            }
        });

        document.addEventListener('touchend', () => {
            isDragging = false;
        });
    }

    waitForStocksAndInit();
})();
