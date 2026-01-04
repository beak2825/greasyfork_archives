// ==UserScript==
// @name         Hokej Penalties - Finále
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Vytvoří tabulku s počtem penalizací pro každý tým na stránce s hokejovými informacemi.
// @author       Michal
// @match        https://www.hockey.no/live/Live/Gamesheet/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486126/Hokej%20Penalties%20-%20Fin%C3%A1le.user.js
// @updateURL https://update.greasyfork.org/scripts/486126/Hokej%20Penalties%20-%20Fin%C3%A1le.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const intervalId = setInterval(function () {
        const homeTeamPenalties = Array.from(document.querySelectorAll('[data-bind="template: {name: \'team-summary-template\', data: HomeTeam}"] [data-bind="text: PenaltyLength"]'));
        const awayTeamPenalties = Array.from(document.querySelectorAll('[data-bind="template: {name: \'team-summary-template\', data: AwayTeam}"] [data-bind="text: PenaltyLength"]'));

        const homeTeamPenaltyCount = countOccurrences(homeTeamPenalties);
        const awayTeamPenaltyCount = countOccurrences(awayTeamPenalties);

        const homeTeam2MinPenaltyCount = countOccurrencesOfValue(homeTeamPenalties, 2);
        const awayTeam2MinPenaltyCount = countOccurrencesOfValue(awayTeamPenalties, 2);

        const homeTeamMajorPenaltyCount = countOccurrencesOfValueExcept(homeTeamPenalties, 2);
        const awayTeamMajorPenaltyCount = countOccurrencesOfValueExcept(awayTeamPenalties, 2);

        createTable(homeTeamPenaltyCount, awayTeamPenaltyCount, homeTeam2MinPenaltyCount, awayTeam2MinPenaltyCount, homeTeamMajorPenaltyCount, awayTeamMajorPenaltyCount);
    }, 1000);

    function countOccurrences(penaltyElements) {
        let penaltyCount = 0;
        penaltyElements.forEach(element => {
            const penaltyLength = parseInt(element.textContent.trim());
            if (!isNaN(penaltyLength)) {
                penaltyCount += 1;
            }
        });
        return penaltyCount;
    }

    function countOccurrencesOfValue(penaltyElements, value) {
        let count = 0;
        penaltyElements.forEach(element => {
            const penaltyLength = parseInt(element.textContent.trim());
            if (!isNaN(penaltyLength) && penaltyLength === value) {
                count += 1;
            }
        });
        return count;
    }

    function countOccurrencesOfValueExcept(penaltyElements, value) {
        let count = 0;
        penaltyElements.forEach(element => {
            const penaltyLength = parseInt(element.textContent.trim());
            if (!isNaN(penaltyLength) && penaltyLength !== value) {
                count += 1;
            }
        });
        return count;
    }

    const style = document.createElement('style');
    style.textContent = `
        table.custom-table {
            position: fixed;
            top: 60px;
            left: 30px;
            border: 3px solid black;
            background-color: white;
            font-size: 16px;
            vertical-align: middle;
            z-index: 999;
        }
        table.custom-table td {
            border: 1px solid black;
            padding: 8px;
            text-align: center;
        }
        table.custom-table td:first-child {
            width: 200px;
            text-align: right;
            padding-right: 10px;
        }
        table.custom-table td:last-child {
            width: 50px;
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);

    function createTable(homeTeamPenaltyCount, awayTeamPenaltyCount, homeTeam2MinPenaltyCount, awayTeam2MinPenaltyCount, homeTeamMajorPenaltyCount, awayTeamMajorPenaltyCount) {
        const existingTable = document.getElementById('penaltyTable');
        if (existingTable) {
            existingTable.remove();
        }

        const table = document.createElement('table');
        table.id = 'penaltyTable';
        table.className = 'custom-table';

        const rowsData = [
            ['Home Penalties', homeTeamPenaltyCount],
            ['Away Penalties', awayTeamPenaltyCount],
            ['Home 2-Min Penalty', homeTeam2MinPenaltyCount],
            ['Away 2-Min Penalty', awayTeam2MinPenaltyCount],
            ['Home Major Penalty', homeTeamMajorPenaltyCount],
            ['Away Major Penalty', awayTeamMajorPenaltyCount]
        ];

        rowsData.forEach(rowData => {
            const row = table.insertRow();
            const cell1 = row.insertCell(0);
            cell1.style.border = '1px solid black';
            cell1.style.padding = '8px';
            cell1.style.textAlign = 'right';
            cell1.textContent = rowData[0];

            const cell2 = row.insertCell(1);
            cell2.style.border = '1px solid black';
            cell2.style.padding = '8px';
            cell2.style.textAlign = 'center';
            cell2.textContent = rowData[1];
        });

        document.body.appendChild(table);
    }
})();