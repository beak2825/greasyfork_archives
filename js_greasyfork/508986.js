// ==UserScript==
// @name         krc20 MC Calculator
// @namespace    http://tampermonkey.net/
// @version      2024-09-18
// @description  Showing MC of each krc20 token
// @author       0xJChen (Twitter@0xJChen)
// @match        https://kas.fyi/krc20-tokens
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kas.fyi
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/508986/krc20%20MC%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/508986/krc20%20MC%20Calculator.meta.js
// ==/UserScript==


(function() {
    'use strict';

    async function fetchKaspaPrice() {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=kaspa&vs_currencies=usd');
            const data = await response.json();
            return data.kaspa.usd;
        } catch (error) {
            console.error('Error fetching Kaspa price:', error);
            return null;
        }
    }

    async function addTotalValueColumn() {
        const kaspaPriceInUSD = await fetchKaspaPrice();

        if (!kaspaPriceInUSD) {
            console.error('Could not fetch Kaspa price. Aborting script.');
            return;
        }

        const rows = document.querySelectorAll('.ant-table-tbody tr');

        if (rows.length === 0) return;

        rows.forEach(row => {
            const totalSupplyElement = row.querySelector('td:nth-child(3) span');
            const priceElement = row.querySelector('td:nth-child(6) span');

            if (totalSupplyElement && priceElement) {
                const totalSupplyText = totalSupplyElement.textContent;
                const priceText = priceElement.textContent;

                const totalSupply = parseFloat(totalSupplyText.replace(/[^0-9.]/g, ''));
                const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));

                const totalValueInKAS = totalSupply * price;

                const totalValueInUSD = totalValueInKAS * kaspaPriceInUSD;

                const newCell = document.createElement('td');
                newCell.textContent = isNaN(totalValueInKAS) || isNaN(totalValueInUSD)
                    ? '-'
                    : `${totalValueInKAS.toLocaleString()} KAS ($${totalValueInUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`;
                newCell.style.textAlign = 'center';

                row.appendChild(newCell);
            }
        });

        const headerRow = document.querySelector('.ant-table-thead tr');
        if (headerRow) {
            const newHeader = document.createElement('th');
            newHeader.textContent = 'Total Value (KAS/USD)';
            newHeader.style.textAlign = 'center';
            headerRow.appendChild(newHeader);
        }
    }

    const tableInterval = setInterval(() => {
        const rows = document.querySelectorAll('.ant-table-tbody tr');

        if (rows.length > 0) {
            clearInterval(tableInterval);
            addTotalValueColumn();
        }
    }, 500);
})();
