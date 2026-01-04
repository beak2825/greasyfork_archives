// ==UserScript==
// @name         TC Currency Guide Sorter
// @namespace    http://tampermonkey.net/
// @version      2025-01-05
// @description  Adds sort controls to the currency spending guide on FFXIVTeamcraft, including a new "Daily Profit" metric and sort option, displays it on load, and shows direction arrows for sorting.
// @match        https://ffxivteamcraft.com/currency-spending
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ffxivteamcraft.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523005/TC%20Currency%20Guide%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/523005/TC%20Currency%20Guide%20Sorter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const sortDirection = {
        unit: false,
        total: false,
        weekly: false,
        daily: false
    };

    const sortLabels = {
        unit: 'Sort by Unit Price',
        total: 'Sort by Total',
        weekly: 'Sort by Weekly Sales',
        daily: 'Sort by Daily Profit'
    };

    function parseItemRow(rowEl) {
        const textContent = rowEl.innerText;
        let unitPrice = 0, totalPrice = 0, weeklySales = 0, numCanBuy = 0;

        const buyMatch = textContent.match(/You can buy\s+(\d+)/i);
        if (buyMatch) numCanBuy = parseInt(buyMatch[1].replace(/,/g, ''), 10);

        const unitPriceMatch = textContent.match(/Unit price:\s*x\s*([\d,]+)/);
        if (unitPriceMatch) unitPrice = parseInt(unitPriceMatch[1].replace(/,/g, ''), 10);

        const totalMatch = textContent.match(/Total:\s*x\s*([\d,]+)/);
        if (totalMatch) totalPrice = parseInt(totalMatch[1].replace(/,/g, ''), 10);

        const weeklySalesMatch = textContent.match(/\(([\d,]+)\s*sold last week\)/);
        if (weeklySalesMatch) weeklySales = parseInt(weeklySalesMatch[1].replace(/,/g, ''), 10);

        const dailyProfit = ((Math.min(numCanBuy, weeklySales) * unitPrice) / 7) || 0;
        return { originalEl: rowEl, unitPrice, totalPrice, weeklySales, numCanBuy, dailyProfit };
    }

    function insertDailyProfitDisplay(rowEl, dailyProfit) {
        if (rowEl.querySelector('.tc-daily-profit-line')) return;
        const buyDiv = Array.from(rowEl.querySelectorAll('div'))
            .find(div => /You can buy/i.test(div.textContent || ''));
        const dailyDiv = document.createElement('div');
        dailyDiv.className = 'tc-daily-profit-line';
        dailyDiv.style.color = '#f0c674';
        dailyDiv.textContent = `Daily profit ~ ${formatNumber(dailyProfit)} gil`;
        const parent = buyDiv?.parentElement || rowEl;
        if (buyDiv?.nextSibling) parent.insertBefore(dailyDiv, buyDiv.nextSibling);
        else parent.appendChild(dailyDiv);
    }

    function formatNumber(num) {
        return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function sortItems(sortKey) {
        const container = document.querySelector('nz-list > .ant-spin-nested-loading > .ant-spin-container > .ant-list-items');
        if (!container) return;
        const rows = [...container.querySelectorAll('nz-list-item.result-item')];
        if (!rows.length) return;

        const parsed = rows.map(parseItemRow);
        parsed.forEach(obj => insertDailyProfitDisplay(obj.originalEl, obj.dailyProfit));

        const directionIsAsc = sortDirection[sortKey];
        const comparator = (a, b) => {
            let av, bv;
            if (sortKey === 'unit')      { av = a.unitPrice;    bv = b.unitPrice;    }
            else if (sortKey === 'total') { av = a.totalPrice;   bv = b.totalPrice;   }
            else if (sortKey === 'weekly') { av = a.weeklySales;  bv = b.weeklySales;  }
            else if (sortKey === 'daily')  { av = a.dailyProfit;  bv = b.dailyProfit;  }
            return directionIsAsc ? (av - bv) : (bv - av);
        };

        parsed.sort(comparator).forEach(obj => container.appendChild(obj.originalEl));
        sortDirection[sortKey] = !directionIsAsc;
        updateSortIndicator(sortKey);
    }

    function injectDailyProfitToAllRows() {
        const container = document.querySelector('nz-list > .ant-spin-nested-loading > .ant-spin-container > .ant-list-items');
        if (!container) return;
        const rows = [...container.querySelectorAll('nz-list-item.result-item')];
        if (!rows.length) return;
        rows.forEach(row => {
            const data = parseItemRow(row);
            insertDailyProfitDisplay(row, data.dailyProfit);
        });
    }

    function updateSortIndicator(activeKey) {
        document.querySelectorAll('#tc-sort-controls button').forEach(btn => {
            const key = btn.dataset.sortkey;
            btn.textContent = sortLabels[key];
        });
        const directionIsAsc = sortDirection[activeKey];
        const arrow = directionIsAsc ? ' ▼' : ' ▲';
        const activeBtn = document.querySelector(`#tc-sort-controls button[data-sortkey='${activeKey}']`);
        if (activeBtn) {
            activeBtn.textContent += arrow;
        }
    }

    function injectSortControlsIfMissing() {
        const serverPicker = document.querySelector('.server-picker');
        if (!serverPicker || document.querySelector('#tc-sort-controls')) return;

        const sortContainer = document.createElement('div');
        sortContainer.id = 'tc-sort-controls';
        sortContainer.style.display = 'flex';
        sortContainer.style.gap = '5px';
        sortContainer.style.marginLeft = '10px';

        function makeButton(key) {
            const btn = document.createElement('button');
            btn.textContent = sortLabels[key];
            btn.dataset.sortkey = key;
            btn.style.cursor = 'pointer';
            btn.style.padding = '4px 8px';
            btn.style.borderRadius = '4px';
            btn.style.border = '1px solid #ccc';
            btn.style.background = '#333';
            btn.style.color = '#fff';
            btn.addEventListener('click', () => sortItems(key));
            return btn;
        }

        sortContainer.append(
            makeButton('unit'),
            makeButton('total'),
            makeButton('weekly'),
            makeButton('daily')
        );

        serverPicker.parentElement.appendChild(sortContainer);
    }

    const observer = new MutationObserver(() => {
        injectSortControlsIfMissing();
        injectDailyProfitToAllRows();
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
})();