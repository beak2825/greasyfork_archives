// ==UserScript==
// @name         LZT Market Daily Incomes & Expenses
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  this.account.delete();
// @author       @Aisan
// @match        https://lzt.market/*
// @grant        window.close
// @icon         https://nztcdn.com/avatar/l/1724225284/3498309.webp
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545436/LZT%20Market%20Daily%20Incomes%20%20Expenses.user.js
// @updateURL https://update.greasyfork.org/scripts/545436/LZT%20Market%20Daily%20Incomes%20%20Expenses.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function extractAmountAndCurrency(amountElement) {
        // Получаем весь текст элемента
        const fullText = amountElement.textContent.trim();

        // Извлекаем валютную иконку
        const currencyIcon = amountElement.querySelector('span[class*="svgIcon--"]');
        let currencyClass = 'svgIcon--rub'; // по умолчанию

        if (currencyIcon) {
            const classList = Array.from(currencyIcon.classList);
            const currencyIconClass = classList.find(cls => cls.startsWith('svgIcon--'));
            if (currencyIconClass) {
                currencyClass = currencyIconClass;
            }
        }

        let amountMatch = fullText.match(/(\d+(?:[\s,]\d+)*(?:[.,]\d+)?)/);

        let amount = 0;
        if (amountMatch) {
            let numberStr = amountMatch[1];

            if (/,\d{1,2}$/.test(numberStr)) {
                numberStr = numberStr.replace(/\s/g, '').replace(',', '.');
            } else if (/\.\d{1,2}$/.test(numberStr)) {
                numberStr = numberStr.replace(/\s/g, '');
            } else {
                numberStr = numberStr.replace(/[\s,]/g, '');
            }
            amount = parseFloat(numberStr);
        }

        return { amount, currencyClass };
    }

    function processBlock(block) {
        if (block.querySelector('.timestampHeader .summary')) return;

        let income = 0;
        let expense = 0;
        let currencyClass = 'svgIcon--rub'; // по умолчанию

        block.querySelectorAll('.paymentItem').forEach(item => {
            const amountSpan = item.querySelector('.amountChange > span');
            if (!amountSpan) return;

            const { amount, currencyClass: itemCurrencyClass } = extractAmountAndCurrency(amountSpan);
            currencyClass = itemCurrencyClass; // используем валюту из транзакций

            if (amountSpan.classList.contains('out')) {
                expense += amount;
            } else {
                income += amount;
            }
        });

        const blockHeader = block.querySelector('.timestampHeader');

        if (blockHeader) {
            blockHeader.style.display = 'flex';
            blockHeader.style.justifyContent = 'space-between';
            blockHeader.style.alignItems = 'center';

            const summaryDiv = generateSummaryBlock(income, expense, currencyClass);

            blockHeader.appendChild(summaryDiv);
        }
    }

    function generateSummaryBlock(income, expense, currencyClass) {
        const summaryDiv = document.createElement('div');
        summaryDiv.className = 'summary amountChange';
        summaryDiv.style.display = 'flex';

        const baseStyle = `
            font-family: -apple-system, BlinkMacSystemFont, 'Open Sans', Helvetica Neue, sans-serif;
            font-size: 15px;
            font-weight: 700;
            margin-left: 16px;
            opacity: 0.7;
            `;

        const formatAmount = (amount) => {
            if (amount >= 10000) {
                return amount.toLocaleString('ru-RU', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2
                });
            } else {
                return amount.toFixed(2).replace(/\.?0+$/, '').replace('.', ',');
            }
        };

        const incomeSpan = document.createElement('span');
        incomeSpan.innerHTML = `+ <span style="display: inline-block">${formatAmount(income)} <span class="${currencyClass} green"></span></span>`;
        incomeSpan.style.cssText = baseStyle;
        incomeSpan.style.color = '#00ba78';
        summaryDiv.appendChild(incomeSpan);

        const expenseSpan = document.createElement('span');
        expenseSpan.innerHTML = `- <span style="display: inline-block">${formatAmount(expense)} <span class="${currencyClass} green"></span></span>`;
        expenseSpan.style.cssText = baseStyle;
        expenseSpan.style.color = '#d6d6d6';
        summaryDiv.appendChild(expenseSpan);

        return summaryDiv;
    }

    function processAllBlocks() {
        document.querySelectorAll('.MarketItems .paymentsBlock').forEach(processBlock);
    }

    processAllBlocks();

    // Наблюдение за изменениями DOM
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (!(node instanceof HTMLElement)) return;
                if (node.classList.contains('paymentsBlock')) {
                    processBlock(node);
                } else {
                    node.querySelectorAll?.('.MarketItems .paymentsBlock').forEach(processBlock);
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();