// ==UserScript==
// @name         AtoZ Punch History Enhanced with Statistics
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Show daily punch in/out in a dedicated column with weekly and monthly statistics
// @author       wmehedis
// @match        https://atoz.amazon.work/time/balance-ledger/TimeOff_ATPLUS_DE_CF_PaidAbsenceFlexDismantlingHour
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538985/AtoZ%20Punch%20History%20Enhanced%20with%20Statistics.user.js
// @updateURL https://update.greasyfork.org/scripts/538985/AtoZ%20Punch%20History%20Enhanced%20with%20Statistics.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const styles = `
        .punch-column-header {
            font-weight: bold;
            background-color: #f0f2f5;
            text-align: center;
        }
        .punch-cell {
            font-size: 13px;
            text-align: center;
            padding: 4px;
            font-family: "Amazon Ember", Arial, sans-serif;
            background-color: #f9f9f9;
        }
        .punch-card {
            display: inline-block;
            background-color: #fff;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            padding: 4px 8px;
            margin: 0 2px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
        }
        .punch-out {
            color: #c62828;
            font-weight: bold;
        }
        .punch-in {
            color: #2e7d32;
            font-weight: bold;
        }
        .stats-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 1000;
            max-width: 300px;
        }
    `;

    function injectStyles() {
        const styleSheet = document.createElement("style");
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    async function fetchPunchData() {
        const employeeId = window.AtoZContext?.employee?.employeeId;
        if (!employeeId) return null;

        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 2);

        const url = `https://atoz-apps.amazon.work/apis/AtoZTimeoffService/punches?employeeId=${employeeId}&startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}&temporalRouting=false&usePaycodeDomainAPI=true`;

        const res = await fetch(url, {
            headers: {
                'accept': '*/*',
                'x-atoz-client-id': 'ATOZ_TIMEOFF_SERVICE'
            },
            credentials: 'include'
        });

        if (!res.ok) return null;
        return await res.json();
    }

    function formatTime(dateTime) {
        return new Date(dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    }

    function parseDate(text) {
        const match = text.match(/(\d+)\.\s+(\w+\.?)\s+(\d{4})/) || text.match(/(\w+)\s+(\d+),\s+(\d{4})/);
        if (!match) return null;

        const [_, part1, part2, year] = match;
        const day = part1.length <= 2 ? part1 : part2;
        const monthName = (part1.length <= 2 ? part2 : part1).replace('.', '');

        const months = {
            Jan: '01', January: '01',
            Feb: '02', February: '02',
            Mar: '03', March: '03',
            Apr: '04', April: '04',
            May: '05',
            Jun: '06', June: '06',
            Jul: '07', July: '07',
            Aug: '08', August: '08',
            Sep: '09', September: '09',
            Oct: '10', October: '10',
            Nov: '11', November: '11',
            Dec: '12', December: '12'
        };

        const month = months[monthName];
        if (!month) return null;

        return new Date(`${year}-${month}-${day.padStart(2, '0')}`);
    }

    function getPunchesForDate(data, date) {
        if (!data || !data.punchesTimeSegments) return [];
        return data.punchesTimeSegments.filter(p => new Date(p.startDateTime).toDateString() === date.toDateString());
    }

    function addPunchColumnHeader(table) {
        const headerRow = table.querySelector('thead tr');
        const th = document.createElement('th');
        th.className = 'punch-column-header';
        th.textContent = 'Punch Times';
        headerRow.appendChild(th);
    }

    function calculateWorkHours(inTime, outTime) {
        const start = new Date(`2000-01-01 ${inTime}`);
        const end = new Date(`2000-01-01 ${outTime}`);
        const diff = (end - start) / (1000 * 60 * 60); // Convert to hours
        return Math.round(diff * 100) / 100;
    }

    function createStatsPanel(punchData) {
        const statsPanel = document.createElement('div');
        statsPanel.className = 'stats-panel';

        const now = new Date();
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        let weeklyHours = 0;
        let monthlyHours = 0;

        punchData.punchesTimeSegments.forEach(punch => {
            const punchDate = new Date(punch.startDateTime);
            const inTime = formatTime(punch.startDateTime);
            const outTime = formatTime(punch.endDateTime || punch.startDateTime);
            const hours = calculateWorkHours(inTime, outTime);

            if (punchDate >= weekStart) {
                weeklyHours += hours;
            }
            if (punchDate >= monthStart) {
                monthlyHours += hours;
            }
        });

        statsPanel.innerHTML = `
            <h3>Work Statistics</h3>
            <p>Weekly Hours: ${weeklyHours.toFixed(2)}</p>
            <p>Monthly Hours: ${monthlyHours.toFixed(2)}</p>
        `;

        document.body.appendChild(statsPanel);
    }

    async function processTable() {
        const table = document.querySelector('table[data-test-component="StencilTable"]');
        if (!table) return;

        injectStyles();
        addPunchColumnHeader(table);

        const punchData = await fetchPunchData();
        if (!punchData) return;

        createStatsPanel(punchData);

        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const dateCell = row.querySelector('.css-1vslykb');
            const dateText = dateCell?.querySelector('.css-1kgbsl4')?.textContent;
            const date = parseDate(dateText);

            const cell = document.createElement('td');
            cell.className = 'punch-cell';

            if (date) {
                const punches = getPunchesForDate(punchData, date);
                if (punches.length > 0) {
                    const inTime = formatTime(punches[0].startDateTime);
                    const outTime = formatTime(punches[punches.length - 1].endDateTime || punches[punches.length - 1].startDateTime);

                    cell.innerHTML = `
                        <span class="punch-card">
                            In: <span class="punch-in">${inTime}</span>
                        </span>
                        <span class="punch-card">
                            Out: <span class="punch-out">${outTime}</span>
                        </span>
                    `;
                } else {
                    cell.textContent = '—';
                }
            } else {
                cell.textContent = 'Invalid';
            }

            row.appendChild(cell);
        });
    }

    // Wait for table to load
    let attempts = 0;
    const interval = setInterval(() => {
        attempts++;
        if (document.querySelector('table[data-test-component="StencilTable"]')) {
            clearInterval(interval);
            processTable();
        }
        if (attempts > 20) clearInterval(interval);
    }, 500);

})();
