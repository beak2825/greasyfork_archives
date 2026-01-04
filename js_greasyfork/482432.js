// ==UserScript==
// @name         AvistaZ Bonus Point Plus+
// @namespace    https://github.com/royspace/AvistaZ-Bonus-Point-Plus
// @homepage     https://github.com/royspace/AvistaZ-Bonus-Point-Plus
// @version      0.4
// @author       Roy
// @description  Adds a "Shortfall" and "Time Calculation" to Exchange table, Adds BP per second, minute,...
// @match        https://avistaz.to/profile/*/bonus
// @icon         https://avistaz.to/images/avistaz-favicon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482432/AvistaZ%20Bonus%20Point%20Plus%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/482432/AvistaZ%20Bonus%20Point%20Plus%2B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function createCalculationTable(pointsPerHour) {
        const pointsPerSecond = pointsPerHour / 3600;
        const pointsPerMinute = pointsPerHour / 60;
        const pointsPerDay = pointsPerHour * 24;
        const pointsPerWeek = pointsPerDay * 7;
        const pointsPerMonth = pointsPerDay * 30;
        const pointsPerYear = pointsPerDay * 365;

        const table = document.createElement('table');
        table.style.borderCollapse = 'collapse';
        table.style.marginTop = '10px';
        table.style.width = '100%';

        const tableHeader = table.createTHead();
        const headerRow = tableHeader.insertRow();
        const headerCellLabel = headerRow.insertCell();
        const headerCellValue = headerRow.insertCell();

        headerCellLabel.innerHTML = 'Calculation';
        headerCellLabel.style.backgroundColor = '#001F3F';
        headerCellLabel.style.fontWeight = 'bold';
        headerCellLabel.style.padding = '10px';

        headerCellValue.innerHTML = 'Value';
        headerCellValue.style.backgroundColor = '#001F3F';
        headerCellValue.style.fontWeight = 'bold';
        headerCellValue.style.padding = '10px';

        const tableBody = table.createTBody();

        function addRow(label, value) {
            const row = tableBody.insertRow();
            const cellLabel = row.insertCell(0);
            const cellValue = row.insertCell(1);

            cellLabel.innerHTML = label;
            cellLabel.style.textAlign = 'left';
            cellLabel.style.paddingLeft = '10px';
            cellLabel.style.fontWeight = '400';

            cellValue.innerHTML = value.toFixed(2);
            cellValue.style.textAlign = 'right';
            cellValue.style.paddingRight = '10px';
            cellValue.style.fontWeight = '550';
        }

        addRow('Points Per Second', pointsPerSecond);
        addRow('Points Per Minute', pointsPerMinute);
        addRow('Points Per Hour', pointsPerHour);
        addRow('Points Per Day', pointsPerDay);
        addRow('Points Per Week', pointsPerWeek);
        addRow('Points Per Month', pointsPerMonth);
        addRow('Points Per Year', pointsPerYear);

        return table;
    }

    function addCalculationColumn() {
        const pointsPerHour = parseFloat(document.querySelector('td:nth-child(3) strong').textContent);
        const header = document.querySelector('div > div > .col-sm-8 > table > thead > tr');

        if (header) {
            const shortfallHeaderCell = document.createElement('th');
            shortfallHeaderCell.textContent = 'Shortfall';
            header.querySelector('th:nth-child(2)').after(shortfallHeaderCell);

            const timeCalculationHeaderCell = document.createElement('th');
            timeCalculationHeaderCell.textContent = 'Time Calculation';
            shortfallHeaderCell.after(timeCalculationHeaderCell);
        }

        const tbody = document.querySelector('div > div > .col-sm-8 > table > tbody');
        const trimValueElement = document.querySelector('h2');
        const trimValue = parseFloat(trimValueElement.textContent.replace(/[^\d.]/g, '')) || 0;

        function formatTime(hours) {
            const months = Math.floor(hours / (30 * 24));
            const days = Math.floor((hours % (30 * 24)) / 24);
            const remainingHours = Math.round(hours % 24);
            let result = '';

            if (months > 0) result += `${months} month${months > 1 ? 's' : ''}, `;
            if (days > 0) result += `${days} day${days > 1 ? 's' : ''}, `;
            if (remainingHours > 0) result += `${remainingHours} hour${remainingHours > 1 ? 's' : ''}`;

            return result.trim().replace(/,\s*$/, '') || '0 hours';
        }

        if (tbody) {
            const rows = tbody.querySelectorAll('tr');
            rows.forEach(row => {
                const pointsCell = row.querySelector('td:nth-child(2)');
                const pointsValue = parseInt(pointsCell.textContent.replace(/,/g, ''), 10);
                const times = Math.floor(trimValue / pointsValue);
                const nextTarget = (times + 1) * pointsValue;
                const shortfall = nextTarget - trimValue;

                const shortfallCell = document.createElement('td');
                shortfallCell.textContent = `${Math.round(shortfall)} (${times})`;
                pointsCell.after(shortfallCell);

                const hoursNeeded = shortfall / pointsPerHour;
                const timeCalculationCell = document.createElement('td');
                timeCalculationCell.textContent = formatTime(hoursNeeded);
                shortfallCell.after(timeCalculationCell);
            });
        }
    }

    const targetElement = document.querySelector('div > div .well-sm > h3');
    if (targetElement) {
        const pointsPerHour = parseFloat(document.querySelector('td:nth-child(3) strong').textContent);
        const calculationTable = createCalculationTable(pointsPerHour);
        targetElement.parentNode.insertBefore(calculationTable, targetElement.nextSibling);
    }

    addCalculationColumn();
})();
