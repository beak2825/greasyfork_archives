// ==UserScript==
// @name         LZT USD Converter 
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Конвертер валют для LZT Market
// @author       PowerDevil
// @match        https://lzt.market/*
// @match        https://*.lzt.market/*
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/545028/LZT%20USD%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/545028/LZT%20USD%20Converter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let usdRate = null;

    function fetchUSDRate() {
        if (usdRate !== null) return Promise.resolve(usdRate);

        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://lzt.market/currency',
                onload: function(response) {
                    try {
                        const html = response.responseText;
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = html;
                        const rows = tempDiv.querySelectorAll('tr');

                        for (let row of rows) {
                            const cells = row.querySelectorAll('td');
                            if (cells.length >= 3) {
                                const currencyText = cells[0].textContent.trim();
                                if (currencyText.includes('Доллар') || currencyText.includes('USD')) {
                                    const rateText = cells[2].textContent.trim();
                                    const rateMatch = rateText.match(/([\d,]+(?:\.[\d]+)?)/);
                                    if (rateMatch) {
                                        usdRate = parseFloat(rateMatch[0].replace(',', '.'));
                                        resolve(usdRate);
                                        return;
                                    }
                                }
                            }
                        }
                        resolve(null);
                    } catch (error) {
                        resolve(null);
                    }
                }
            });
        });
    }

    function extractAmount(text) {
        const cleanText = text.replace(/[₽$€£¥]/g, '').trim();
        const match = cleanText.match(/([\d\s,\.]+)/);
        if (match) {
            let numStr = match[1].replace(/\s/g, '').replace(',', '.');
            const amount = parseFloat(numStr);
            return isNaN(amount) ? null : amount;
        }
        return null;
    }

    function updateValueElement() {
        const valueElement = document.querySelector('.MarketRefillBalance--PayAmount .Value');
        if (!valueElement || !usdRate) return;

        const rubText = valueElement.textContent.trim();
        const rubAmount = extractAmount(rubText);
        if (!rubAmount || rubAmount <= 0) return;

        const usdAmount = (rubAmount / usdRate).toFixed(2);

        let usdElement = valueElement.parentNode.querySelector('.usd-amount');
        if (!usdElement) {
            usdElement = document.createElement('span');
            usdElement.className = 'usd-amount';
            usdElement.style.cssText = 'font-size: 15px; color: #666; font-weight: 600; margin-left: 4px;';
            valueElement.parentNode.appendChild(usdElement);
        }

        usdElement.textContent = ` ≈ $${usdAmount}`;
    }


    function setupObserver() {
        const valueElement = document.querySelector('.MarketRefillBalance--PayAmount .Value');
        if (valueElement) {
            const observer = new MutationObserver(() => {
                updateValueElement();
            });

            observer.observe(valueElement, {
                childList: true,
                subtree: true,
                characterData: true
            });
        }
    }

    async function init() {
        await fetchUSDRate();
        if (!usdRate) return;

        updateValueElement();
        setupObserver();

        if (typeof XF !== 'undefined') {
            XF.on(document, 'ajax:complete', () => {
                setTimeout(updateValueElement, 300);
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();