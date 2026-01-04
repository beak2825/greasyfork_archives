// ==UserScript==
// @name         Torn Event Earnings Tracker
// @namespace    https://torn.com/
// @version      1.2
// @description  Aggregates scenario earnings
// @match        https://www.torn.com/page.php?sid=events*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538719/Torn%20Event%20Earnings%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/538719/Torn%20Event%20Earnings%20Tracker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const summaryData = {};

    function formatCurrency(num) {
        return `$${num.toLocaleString()}`;
    }

    function parseEventMessage(message) {
        const cashMatch = message.match(/increased your .*? balance by \$(\d[\d,]*) .*? as your (\d+)% cut .*? in .*?'s (.+?) scenario/i);
        const itemMatch = message.match(/gave you (\d+)x (.*?) as your .*? in .*?'s (.+?) scenario/i);

        if (cashMatch) {
            const amount = parseInt(cashMatch[1].replace(/,/g, ''), 10);
            const percent = parseInt(cashMatch[2], 10);
            const scenario = cashMatch[3];
            return { type: 'cash', scenario, amount, percent };
        }

        if (itemMatch) {
            const count = parseInt(itemMatch[1], 10);
            const item = itemMatch[2];
            const scenario = itemMatch[3];
            return { type: 'item', scenario, item, count };
        }

        return null;
    }

    function updateSummary(parsed) {
        const key = parsed.scenario;

        if (!summaryData[key]) {
            summaryData[key] = { total: 0, items: {} };
        }

        if (parsed.type === 'cash') {
            summaryData[key].total += parsed.amount;
        } else if (parsed.type === 'item') {
            if (!summaryData[key].items[parsed.item]) {
                summaryData[key].items[parsed.item] = 0;
            }
            summaryData[key].items[parsed.item] += parsed.count;
        }
    }

    function generateTable() {
        let totalCash = 0;
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '20px';
        container.style.right = '20px';
        container.style.zIndex = '9999';
        container.style.border = '1px solid #ccc';
        container.style.background = '#f9f9f9';
        container.style.fontSize = '14px';
        container.style.minWidth = '300px';
        container.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
        container.style.padding = '8px';
        container.style.borderRadius = '8px';
        container.style.maxHeight = '80vh';
        container.style.overflowY = 'auto';
        container.id = 'earnings-summary-table';

        const table = document.createElement('table');
        table.style.width = '100%';

        const thead = table.createTHead();
        const headRow = thead.insertRow();
        ['Scenario', 'Cash', 'Items'].forEach(text => {
            const th = document.createElement('th');
            th.textContent = text;
            th.style.borderBottom = '1px solid #aaa';
            th.style.padding = '5px';
            th.style.color = '#000';
            th.style.fontWeight = 'bold';
            headRow.appendChild(th);
        });

        const tbody = table.createTBody();
        for (const [scenario, data] of Object.entries(summaryData)) {
            const row = tbody.insertRow();
            const cellScenario = row.insertCell();
            const cellCash = row.insertCell();
            const cellItems = row.insertCell();

            cellScenario.textContent = scenario;
            cellCash.textContent = formatCurrency(data.total);
            totalCash += data.total;

            const itemsText = Object.entries(data.items).map(([item, count]) => `${count}x ${item}`).join(', ');
            cellItems.textContent = itemsText || '-';

            [cellScenario, cellCash, cellItems].forEach(cell => {
                cell.style.padding = '4px';
            });
        }

        const totalRow = tbody.insertRow();
        const totalCell = totalRow.insertCell();
        totalCell.colSpan = 3;
        totalCell.style.padding = '6px';
        totalCell.style.fontWeight = 'bold';
        totalCell.textContent = `Total Cash: ${formatCurrency(totalCash)}`;

        container.appendChild(table);

        // Add reset button
        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Reset';
        resetBtn.style.marginTop = '10px';
        resetBtn.style.padding = '5px 10px';
        resetBtn.style.cursor = 'pointer';
        resetBtn.style.border = '1px solid #999';
        resetBtn.style.borderRadius = '4px';
        resetBtn.style.background = '#eee';
        resetBtn.onclick = resetSummary;

        container.appendChild(resetBtn);

        return container;
    }

    function refreshTable() {
        const existing = document.getElementById('earnings-summary-table');
        if (existing) existing.remove();

        const summary = generateTable();
        document.body.appendChild(summary);
    }

    function processAllMessages() {
        const messages = document.querySelectorAll('.message___RSW3S');
        messages.forEach(msg => {
            if (!msg.dataset.processed) {
                const parsed = parseEventMessage(msg.textContent);
                if (parsed) {
                    updateSummary(parsed);
                }
                msg.dataset.processed = 'true';
            }
        });
        refreshTable();
    }

    function resetSummary() {
        // Clear data
        for (const key in summaryData) {
            delete summaryData[key];
        }

        // Clear processed flags
        const messages = document.querySelectorAll('.message___RSW3S');
        messages.forEach(msg => {
            delete msg.dataset.processed;
        });

        processAllMessages();
    }

    function observeNewMessages() {
        const list = document.querySelector('.eventsList___uoDYV');
        if (!list) return;

        const observer = new MutationObserver(() => {
            processAllMessages();
        });

        observer.observe(list, {
            childList: true,
            subtree: true,
        });
    }

    function hookSearchButton() {
        const searchBtn = document.querySelector('button.submitEvents___Y8DTd');
        if (!searchBtn) return;

        searchBtn.addEventListener('click', () => {
            setTimeout(() => {
                resetSummary();
            }, 1000);
        });
    }

    function hookSearchButton() {
    function attach() {
        const searchBtn = document.querySelector('button.submitEvents___Y8DTd');
        if (!searchBtn || searchBtn.dataset.hooked) return;

        searchBtn.dataset.hooked = 'true';

        searchBtn.addEventListener('click', () => {
            setTimeout(() => {
                resetSummary();
            }, 1000); // Adjust delay if needed
        });
    }

    // Attach once immediately
    attach();

    // Observe the entire page for re-rendered search UI
    const observer = new MutationObserver(attach);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

setTimeout(() => {
    processAllMessages();
    observeNewMessages();
    hookSearchButton(); // <- uses the improved version above
}, 1000);


})();
