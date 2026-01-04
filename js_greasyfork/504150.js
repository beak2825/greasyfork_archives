// ==UserScript==
// @name         ChickenSmoothie Balance Totals
// @namespace    https://www.chickensmoothie.com/
// @version      1.0
// @description  Calculates your daily C$ profits and spent totals.
// @author       OreozHere
// @match        https://www.chickensmoothie.com/payments/balance?pageStart=*
// @match        https://www.chickensmoothie.com/payments/balance
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504150/ChickenSmoothie%20Balance%20Totals.user.js
// @updateURL https://update.greasyfork.org/scripts/504150/ChickenSmoothie%20Balance%20Totals.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Helper function to parse C$ amount
    function parseCAmount(text) {
        const match = text.match(/C\$([\d]+)/);
        return match ? parseInt(match[1], 10) : 0;
    }

    // Helper function to get the current date in UTC format
    function getCurrentUTCDate() {
        const now = new Date();
        return now.toISOString().split('T')[0]; // YYYY-MM-DD format
    }

    // Helper function to get the date X days ago in UTC format
    function getDateDaysAgo(days) {
        const now = new Date();
        now.setUTCDate(now.getUTCDate() - days);
        return now.toISOString().split('T')[0]; // YYYY-MM-DD format
    }

    // Helper function to fetch and process a page
    async function fetchAndProcessPage(url) {
        const response = await fetch(url);
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        return processPage(doc);
    }

    // Function to process the content of a page
    function processPage(doc) {
        let dailySalesTotal = 0;
        let dailySpentTotal = 0;
        let last7DaysSalesTotal = 0;
        let last7DaysSpentTotal = 0;
        let last30DaysSalesTotal = 0;
        let last30DaysSpentTotal = 0;

        const currentDate = getCurrentUTCDate();
        const last7DaysDate = getDateDaysAgo(7);
        const last30DaysDate = getDateDaysAgo(30);

        const table = doc.querySelector('table.cstable');
        if (table) {
            const rows = table.querySelectorAll('tr');
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length > 0) {
                    const textContent = cells[0].textContent.trim();
                    const dateText = cells[1].textContent.trim(); // Assuming date is in the second cell

                    if (dateText.startsWith(currentDate)) { // Check if the date matches today's date
                        if (textContent.includes("Received C$")) {
                            dailySalesTotal += parseCAmount(textContent);
                        } else if (textContent.includes("Paid C$")) {
                            dailySpentTotal += parseCAmount(textContent);
                        }
                    }

                    if (dateText >= last7DaysDate) { // Check if the date is within the last 7 days
                        if (textContent.includes("Received C$")) {
                            last7DaysSalesTotal += parseCAmount(textContent);
                        } else if (textContent.includes("Paid C$")) {
                            last7DaysSpentTotal += parseCAmount(textContent);
                        }
                    }

                    if (dateText >= last30DaysDate) { // Check if the date is within the last 30 days
                        if (textContent.includes("Received C$")) {
                            last30DaysSalesTotal += parseCAmount(textContent);
                        } else if (textContent.includes("Paid C$")) {
                            last30DaysSpentTotal += parseCAmount(textContent);
                        }
                    }
                }
            });
        }

        return {
            dailySalesTotal,
            dailySpentTotal,
            last7DaysSalesTotal,
            last7DaysSpentTotal,
            last30DaysSalesTotal,
            last30DaysSpentTotal
        };
    }

    // Main function to aggregate totals from multiple pages
    async function calculateTotals() {
        const urls = [
            'https://www.chickensmoothie.com/payments/balance?pageStart=0',
            'https://www.chickensmoothie.com/payments/balance?pageStart=20',
            'https://www.chickensmoothie.com/payments/balance?pageStart=40',
            'https://www.chickensmoothie.com/payments/balance?pageStart=60',
            'https://www.chickensmoothie.com/payments/balance?pageStart=80',
            'https://www.chickensmoothie.com/payments/balance?pageStart=100',
            'https://www.chickensmoothie.com/payments/balance?pageStart=120',
            'https://www.chickensmoothie.com/payments/balance?pageStart=140',
            'https://www.chickensmoothie.com/payments/balance?pageStart=160',
            'https://www.chickensmoothie.com/payments/balance?pageStart=180',
            'https://www.chickensmoothie.com/payments/balance?pageStart=200',
            'https://www.chickensmoothie.com/payments/balance?pageStart=220',
            'https://www.chickensmoothie.com/payments/balance?pageStart=240',
            'https://www.chickensmoothie.com/payments/balance?pageStart=260',
            'https://www.chickensmoothie.com/payments/balance?pageStart=280',
            'https://www.chickensmoothie.com/payments/balance?pageStart=300',
            'https://www.chickensmoothie.com/payments/balance?pageStart=320',
            'https://www.chickensmoothie.com/payments/balance?pageStart=340',
            'https://www.chickensmoothie.com/payments/balance?pageStart=360',
            'https://www.chickensmoothie.com/payments/balance?pageStart=380',
            'https://www.chickensmoothie.com/payments/balance?pageStart=400',
            'https://www.chickensmoothie.com/payments/balance?pageStart=420',
            'https://www.chickensmoothie.com/payments/balance?pageStart=440',
            'https://www.chickensmoothie.com/payments/balance?pageStart=460',
            'https://www.chickensmoothie.com/payments/balance?pageStart=480',
            'https://www.chickensmoothie.com/payments/balance?pageStart=500',
            'https://www.chickensmoothie.com/payments/balance?pageStart=520',
            'https://www.chickensmoothie.com/payments/balance?pageStart=540',
            'https://www.chickensmoothie.com/payments/balance?pageStart=560',
            'https://www.chickensmoothie.com/payments/balance?pageStart=580',
            'https://www.chickensmoothie.com/payments/balance?pageStart=600',
            'https://www.chickensmoothie.com/payments/balance?pageStart=620',
            'https://www.chickensmoothie.com/payments/balance?pageStart=640',
            'https://www.chickensmoothie.com/payments/balance?pageStart=660',
            'https://www.chickensmoothie.com/payments/balance?pageStart=680',
            'https://www.chickensmoothie.com/payments/balance?pageStart=700',
            'https://www.chickensmoothie.com/payments/balance?pageStart=720',
            'https://www.chickensmoothie.com/payments/balance?pageStart=740',
            'https://www.chickensmoothie.com/payments/balance?pageStart=760',
            'https://www.chickensmoothie.com/payments/balance?pageStart=780',
            'https://www.chickensmoothie.com/payments/balance?pageStart=800',
            'https://www.chickensmoothie.com/payments/balance?pageStart=820',
            'https://www.chickensmoothie.com/payments/balance?pageStart=840',
            'https://www.chickensmoothie.com/payments/balance?pageStart=860',
            'https://www.chickensmoothie.com/payments/balance?pageStart=880',
            'https://www.chickensmoothie.com/payments/balance?pageStart=900',
            'https://www.chickensmoothie.com/payments/balance?pageStart=920',
            'https://www.chickensmoothie.com/payments/balance?pageStart=940',
            'https://www.chickensmoothie.com/payments/balance?pageStart=960',
            'https://www.chickensmoothie.com/payments/balance?pageStart=980',
            'https://www.chickensmoothie.com/payments/balance?pageStart=1000',
            'https://www.chickensmoothie.com/payments/balance?pageStart=1020',
            'https://www.chickensmoothie.com/payments/balance?pageStart=1040',
            'https://www.chickensmoothie.com/payments/balance?pageStart=1060',
            'https://www.chickensmoothie.com/payments/balance?pageStart=1080',
            'https://www.chickensmoothie.com/payments/balance?pageStart=1100',
            'https://www.chickensmoothie.com/payments/balance?pageStart=1120',
            'https://www.chickensmoothie.com/payments/balance?pageStart=1140',
            'https://www.chickensmoothie.com/payments/balance?pageStart=1160',
            'https://www.chickensmoothie.com/payments/balance?pageStart=1180',
            'https://www.chickensmoothie.com/payments/balance?pageStart=1200',
            'https://www.chickensmoothie.com/payments/balance?pageStart=1220',
            'https://www.chickensmoothie.com/payments/balance?pageStart=1240',
            'https://www.chickensmoothie.com/payments/balance?pageStart=1260',
            'https://www.chickensmoothie.com/payments/balance?pageStart=1280',
            'https://www.chickensmoothie.com/payments/balance?pageStart=1300',
            'https://www.chickensmoothie.com/payments/balance?pageStart=1320',
            'https://www.chickensmoothie.com/payments/balance?pageStart=1340',
            'https://www.chickensmoothie.com/payments/balance?pageStart=1360',
            'https://www.chickensmoothie.com/payments/balance?pageStart=1380',
            'https://www.chickensmoothie.com/payments/balance?pageStart=1400',
            'https://www.chickensmoothie.com/payments/balance?pageStart=1420',
            'https://www.chickensmoothie.com/payments/balance?pageStart=1440',
            'https://www.chickensmoothie.com/payments/balance?pageStart=1460',
            'https://www.chickensmoothie.com/payments/balance?pageStart=1480',
            'https://www.chickensmoothie.com/payments/balance?pageStart=1500',
            'https://www.chickensmoothie.com/payments/balance?pageStart=1520',
            'https://www.chickensmoothie.com/payments/balance?pageStart=1540',
            'https://www.chickensmoothie.com/payments/balance?pageStart=1560',
            'https://www.chickensmoothie.com/payments/balance?pageStart=1580',
            'https://www.chickensmoothie.com/payments/balance?pageStart=1600',
            'https://www.chickensmoothie.com/payments/balance?pageStart=1620',
            'https://www.chickensmoothie.com/payments/balance?pageStart=1640',
            'https://www.chickensmoothie.com/payments/balance?pageStart=1660',
            'https://www.chickensmoothie.com/payments/balance?pageStart=1680',
            'https://www.chickensmoothie.com/payments/balance?pageStart=1700',
            'https://www.chickensmoothie.com/payments/balance?pageStart=1720',
            'https://www.chickensmoothie.com/payments/balance?pageStart=1740',
            'https://www.chickensmoothie.com/payments/balance?pageStart=1760',
            'https://www.chickensmoothie.com/payments/balance?pageStart=1780',
            'https://www.chickensmoothie.com/payments/balance?pageStart=1800',
            'https://www.chickensmoothie.com/payments/balance?pageStart=1820',
            'https://www.chickensmoothie.com/payments/balance?pageStart=1840',
            'https://www.chickensmoothie.com/payments/balance?pageStart=1860',
            'https://www.chickensmoothie.com/payments/balance?pageStart=1880',
            'https://www.chickensmoothie.com/payments/balance?pageStart=1900',
            'https://www.chickensmoothie.com/payments/balance?pageStart=1920',
            'https://www.chickensmoothie.com/payments/balance?pageStart=1940',
            'https://www.chickensmoothie.com/payments/balance?pageStart=1960',
            'https://www.chickensmoothie.com/payments/balance?pageStart=1980',
            'https://www.chickensmoothie.com/payments/balance?pageStart=2000',

        ];

        let totalDailySales = 0;
        let totalDailySpent = 0;
        let totalLast7DaysSales = 0;
        let totalLast7DaysSpent = 0;
        let totalLast30DaysSales = 0;
        let totalLast30DaysSpent = 0;

        // Display loading message
        const balanceHeader = document.querySelector('h2');
        if (balanceHeader) {
            const loadingDiv = document.createElement('div');
            loadingDiv.innerHTML = `<strong>Totals loading...</strong>`;
            balanceHeader.insertAdjacentElement('afterend', loadingDiv);

            for (const url of urls) {
                const totals = await fetchAndProcessPage(url);
                totalDailySales += totals.dailySalesTotal;
                totalDailySpent += totals.dailySpentTotal;
                totalLast7DaysSales += totals.last7DaysSalesTotal;
                totalLast7DaysSpent += totals.last7DaysSpentTotal;
                totalLast30DaysSales += totals.last30DaysSalesTotal;
                totalLast30DaysSpent += totals.last30DaysSpentTotal;
            }

            // Remove loading message and display totals
            loadingDiv.innerHTML = `
                <strong>Total Sales Today: C$${totalDailySales}</strong><br>
                <strong>Total Spent Today: C$${totalDailySpent}</strong><br><br>
                <strong>Total Sales Last 7 Days: C$${totalLast7DaysSales}</strong><br>
                <strong>Total Spent Last 7 Days: C$${totalLast7DaysSpent}</strong><br><br>
                <strong>Total Sales Last 30 Days: C$${totalLast30DaysSales}</strong><br>
                <strong>Total Spent Last 30 Days: C$${totalLast30DaysSpent}</strong><br><br>
            `;
        }
    }

    // Run the main function
    calculateTotals();
})();
