// ==UserScript==
// @name         Esketit - Add Net Return, remove some fields and Colorize where relevant.
// @namespace    http://esketit.com/
// @version      20260123
// @description  Adds Net Return to the statement and colorizes contributing fields.
// @author       rs232
// @match        https://*.esketit.com/*
// @icon         https://www.google.com/s2/favicons?sz=32&domain_url=https%3A%2F%2Fwww.esketit.com/
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/512959/Esketit%20-%20Add%20Net%20Return%2C%20remove%20some%20fields%20and%20Colorize%20where%20relevant.user.js
// @updateURL https://update.greasyfork.org/scripts/512959/Esketit%20-%20Add%20Net%20Return%2C%20remove%20some%20fields%20and%20Colorize%20where%20relevant.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DARK_GREEN = "#2E8B57";
    const PALE_GREEN = "#F0FFF0";
    const LIGHTER_AMBER_BACKGROUND = "#FFF8E1";
    const DARKER_AMBER_TEXT = "#E65100";
    const DARK_BLUE = "#2222BB";
    const LIGHT_BLUE = "#E6F7FF";

    function parseCurrency(value) {
        if (!value) return 0;
        return parseFloat(value.replace('€', '').trim().replace(/\s/g, '').replace(',', '.')) || 0;
    }

    function findRowByLabel(label) {
        const rows = document.querySelectorAll('tr');
        for (const row of rows) {
            const firstCell = row.querySelector('td:first-child');
            if (firstCell && firstCell.textContent.trim() === label) {
                return row;
            }
        }
        return null;
    }

    function colorizeSummaryRows() {
        const rowsToColorize = {
            green: ["Interest received", "Bonus received", "Referral bonus received", "Secondary market income"],
            red: ["Secondary market expense"],
            amber: ["Sold on secondary market"],
            blue: ["Allocated on primary market", "Bought on secondary market"]
        };

        rowsToColorize.green.forEach(label => {
            const row = findRowByLabel(label);
            if (row) {
                const valueCell = row.querySelector('td:nth-child(2)');
                const labelCell = row.querySelector('td:first-child');
                const value = valueCell ? parseCurrency(valueCell.textContent) : 0;
                if (value > 0) {
                    labelCell.style.color = DARK_GREEN;
                    valueCell.style.color = DARK_GREEN;
                    row.style.backgroundColor = PALE_GREEN;
                }
            }
        });

        rowsToColorize.red.forEach(label => {
            const row = findRowByLabel(label);
            if (row) {
                const valueCell = row.querySelector('td:nth-child(2)');
                const labelCell = row.querySelector('td:first-child');
                const value = valueCell ? parseCurrency(valueCell.textContent) : 0;
                if (value < 0) {
                    labelCell.style.color = '#FA5053';
                    valueCell.style.color = '#FA5053';
                    row.style.backgroundColor = "#FFeeea";
                }
            }
        });

        rowsToColorize.amber.forEach(label => {
            const row = findRowByLabel(label);
            if (row) {
                const valueCell = row.querySelector('td:nth-child(2)');
                const labelCell = row.querySelector('td:first-child');
                const value = valueCell ? parseCurrency(valueCell.textContent) : 0;
                if (value > 0) {
                    labelCell.style.color = DARKER_AMBER_TEXT;
                    valueCell.style.color = DARKER_AMBER_TEXT;
                    row.style.backgroundColor = LIGHTER_AMBER_BACKGROUND;
                }
            }
        });

        rowsToColorize.blue.forEach(label => {
            const row = findRowByLabel(label);
            if (row) {
                const valueCell = row.querySelector('td:nth-child(2)');
                const labelCell = row.querySelector('td:first-child');
                const value = valueCell ? parseCurrency(valueCell.textContent) : 0;
                if (value !== 0) {
                    labelCell.style.color = DARK_BLUE;
                    valueCell.style.color = DARK_BLUE;
                    row.style.backgroundColor = LIGHT_BLUE;
                }
            }
        });
    }

    function hideRows() {
        const rowsToHide = ["Opening balance", "Top-up", "Withdrawal", "Closing balance"];
        rowsToHide.forEach(label => {
            const row = findRowByLabel(label);
            if (row) row.style.display = 'none';
        });
    }

    function updateNetReturn() {
        // Only run if we are on the correct path
        if (!window.location.href.includes('/investor/account-statement')) return;

        const closingBalanceRow = findRowByLabel("Closing balance");
        const interestReceivedRow = findRowByLabel("Interest received");

        if (closingBalanceRow && interestReceivedRow) {
            const interestValueCell = interestReceivedRow.querySelector('td:nth-child(2)');
            const interestValue = interestValueCell ? parseCurrency(interestValueCell.textContent) : 0;

            let netReturnTotal = 0;
            const labelsForNetReturn = ["Interest received", "Bonus received", "Referral bonus received", "Secondary market income", "Secondary market expense"];

            labelsForNetReturn.forEach(label => {
                const row = findRowByLabel(label);
                if (row) {
                    const valueCell = row.querySelector('td:nth-child(2)');
                    if (valueCell) netReturnTotal += parseCurrency(valueCell.textContent);
                }
            });

            const formattedNetReturn = `€${netReturnTotal.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0')}`;
            let netReturnRow = document.getElementById('net-return-row');
            const exampleRow = findRowByLabel("Opening balance");

            if (!netReturnRow) {
                netReturnRow = document.createElement('tr');
                netReturnRow.id = 'net-return-row';
                if (exampleRow && exampleRow.hasAttribute('data-v-344f568a')) {
                    netReturnRow.setAttribute('data-v-344f568a', exampleRow.getAttribute('data-v-344f568a'));
                }
                const labelCell = document.createElement('td');
                const valueCell = document.createElement('td');

                labelCell.textContent = 'Net return';
                labelCell.style.fontWeight = 'bold';
                labelCell.style.color = '#ffffff';

                valueCell.textContent = formattedNetReturn;
                valueCell.style.fontWeight = 'bold';
                valueCell.style.color = PALE_GREEN;
                valueCell.style.textAlign = 'right';

                netReturnRow.appendChild(labelCell);
                netReturnRow.appendChild(valueCell);
                closingBalanceRow.parentNode.insertBefore(netReturnRow, closingBalanceRow.nextSibling);
            } else {
                const vCell = netReturnRow.querySelector('td:nth-child(2)');
                if (vCell) vCell.textContent = formattedNetReturn;
            }

            netReturnRow.style.backgroundColor = DARK_GREEN;
            colorizeSummaryRows();
            hideRows();
        }
    }

    // Initialize the loop
    setInterval(updateNetReturn, 500);

})();