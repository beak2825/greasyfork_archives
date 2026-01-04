// ==UserScript==
// @name         Esketit - Add Net Return and Colorize Fields
// @namespace    http://esketit.com/
// @version      20250729
// @description  Adds Net Return to the statement and colorizes contributing fields.
// @author       rs232
// @match        https://*esketit.com/investor/account-statement
// @icon         https://www.google.com/s2/favicons?sz=32&domain_url=https%3A%2F%2Fwww.esketit.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512959/Esketit%20-%20Add%20Net%20Return%20and%20Colorize%20Fields.user.js
// @updateURL https://update.greasyfork.org/scripts/512959/Esketit%20-%20Add%20Net%20Return%20and%20Colorize%20Fields.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the colors for easy modification
    const DARK_GREEN = "#2E8B57";
    const PALE_GREEN = "#F0FFF0";

    // Define amber colors as requested
    const LIGHTER_AMBER_BACKGROUND = "#FFF8E1"; // A very light, almost cream amber
    const DARKER_AMBER_TEXT = "#E65100";      // A darker, more orange-brown amber

    // Helper function to parse currency strings.
    function parseCurrency(value) {
        if (!value) return 0;
        return parseFloat(value.replace('€', '').trim().replace(/\s/g, '').replace(',', '.')) || 0;
    }

    // Helper function to find a table row by its first cell's text.
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

    // Function to apply colors to summary rows based on their value.
    function colorizeSummaryRows() {
        const rowsToColorize = {
            green: ["Interest received", "Bonus received", "Referral bonus received", "Secondary market income"],
            red: ["Secondary market expense"],
            amber: ["Sold on secondary market"]
        };

        // Handle green rows
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
                } else {
                    labelCell.style.color = "";
                    valueCell.style.color = "";
                    row.style.backgroundColor = "";
                }
            }
        });

        // Handle red rows
        rowsToColorize.red.forEach(label => {
            const row = findRowByLabel(label);
            if (row) {
                const valueCell = row.querySelector('td:nth-child(2)');
                const labelCell = row.querySelector('td:first-child');
                const value = valueCell ? parseCurrency(valueCell.textContent) : 0;

                if (value < 0) {
                    labelCell.style.color = '#FA5053';
                    valueCell.style.color = '#FA5053';
                    row.style.backgroundColor = "#FFeeea"; // pale red
                } else {
                    labelCell.style.color = "";
                    valueCell.style.color = "";
                    row.style.backgroundColor = "";
                }
            }
        });

        // Handle amber rows with the new lighter background and darker text
        rowsToColorize.amber.forEach(label => {
            const row = findRowByLabel(label);
            if (row) {
                const valueCell = row.querySelector('td:nth-child(2)');
                const labelCell = row.querySelector('td:first-child');
                const value = valueCell ? parseCurrency(valueCell.textContent) : 0;

                if (value > 0) {
                    labelCell.style.color = DARKER_AMBER_TEXT;       // Darker amber text
                    valueCell.style.color = DARKER_AMBER_TEXT;       // Darker amber text
                    row.style.backgroundColor = LIGHTER_AMBER_BACKGROUND; // Lighter amber background
                } else {
                    labelCell.style.color = "";
                    valueCell.style.color = "";
                    row.style.backgroundColor = "";
                }
            }
        });
    }

    // This function will be called periodically to recalculate and update the UI.
    function updateNetReturn() {
        const closingBalanceRow = findRowByLabel("Closing balance");
        const interestReceivedRow = findRowByLabel("Interest received");

        if (closingBalanceRow && interestReceivedRow) {
            const interestValueCell = interestReceivedRow.querySelector('td:nth-child(2)');
            const interestValue = interestValueCell ? parseCurrency(interestValueCell.textContent) : 0;

            if (interestValue !== 0 || findRowByLabel("Secondary market expense")?.querySelector('td:nth-child(2)')?.textContent.trim() !== '€0,00') {
                 let netReturnTotal = 0;
                 const labelsForNetReturn = [
                     "Interest received",
                     "Bonus received",
                     "Referral bonus received",
                     "Secondary market income",
                     "Secondary market expense"
                 ];

                 labelsForNetReturn.forEach(label => {
                     const row = findRowByLabel(label);
                     if (row) {
                         const valueCell = row.querySelector('td:nth-child(2)');
                         if (valueCell) {
                             netReturnTotal += parseCurrency(valueCell.textContent);
                         }
                     }
                 });

                 const formattedNetReturn = `€${netReturnTotal.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0')}`;
                 let netReturnRow = document.getElementById('net-return-row');

                 const exampleRow = findRowByLabel("Opening balance");
                 const exampleLabelCell = exampleRow ? exampleRow.querySelector('td:first-child') : null;
                 const exampleValueCell = exampleRow ? exampleRow.querySelector('td:nth-child(2)') : null;

                 if (!netReturnRow) {
                     netReturnRow = document.createElement('tr');
                     netReturnRow.id = 'net-return-row';

                     if (exampleRow && exampleRow.hasAttribute('data-v-344f568a')) {
                         netReturnRow.setAttribute('data-v-344f568a', exampleRow.getAttribute('data-v-344f568a'));
                     }

                     const labelCell = exampleLabelCell ? exampleLabelCell.cloneNode(false) : document.createElement('td');
                     const valueCell = exampleValueCell ? exampleValueCell.cloneNode(false) : document.createElement('td');

                     labelCell.textContent = 'Net return';
                     labelCell.style.fontWeight = 'bold';
                     labelCell.style.color = '#ffffff'; // Swapped text color

                     valueCell.textContent = formattedNetReturn;
                     valueCell.style.fontWeight = 'bold';
                     valueCell.style.color = PALE_GREEN; // Swapped text color
                     valueCell.style.textAlign = 'right';

                     netReturnRow.appendChild(labelCell);
                     netReturnRow.appendChild(valueCell);

                     closingBalanceRow.parentNode.insertBefore(netReturnRow, closingBalanceRow.nextSibling);
                 } else {
                     const valueCell = netReturnRow.querySelector('td:nth-child(2)');
                     if (valueCell) {
                         valueCell.textContent = formattedNetReturn;
                         valueCell.style.fontWeight = 'bold';
                         valueCell.style.color = PALE_GREEN; // Swapped text color
                         valueCell.style.textAlign = 'right';
                     }
                     const labelCell = netReturnRow.querySelector('td:first-child');
                     if (labelCell) {
                         labelCell.style.fontWeight = 'bold';
                         labelCell.style.color = PALE_GREEN; // Swapped text color
                     }
                 }
                 netReturnRow.style.backgroundColor = DARK_GREEN; // Swapped background color

                 colorizeSummaryRows();
            }
        }
    }

    // Set up a continuous polling loop to update the Net Return and colors.
    setInterval(updateNetReturn, 500);

})();