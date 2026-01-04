// ==UserScript==
// @name         NHL Tresty
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Zobrazí tabulku trestů na stránkách NHL
// @author       Michal
// @match        https://www.nhl.com/scores/htmlreports/*/GS*.HTM
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515211/NHL%20Tresty.user.js
// @updateURL https://update.greasyfork.org/scripts/515211/NHL%20Tresty.meta.js
// ==/UserScript==

(function() {
    'use strict';

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

    function findSpecificTDAndDisplayPenalties() {
        const element = document.getElementById("PenaltySummary");

        if (!element) {
            createTable(0, 0, 0, 0, 0, 0);
            return;
        }

        const tdElements = element.getElementsByTagName("td");
        let countTwoMinutePenaltiesAway = 0;
        let countMajorPenaltiesAway = 0;
        let countTwoMinutePenaltiesHome = 0;
        let countMajorPenaltiesHome = 0;

        let isHomeTeamSection = false;

        for (let i = 0; i < tdElements.length; i++) {
            const td = tdElements[i];

            if (
                td.getAttribute("width") === "50%" &&
                td.getAttribute("valign") === "top" &&
                td.getAttribute("align") === "center" &&
                td.getAttribute("class") === "lborder + rborder + tborder"
            ) {
                const trElements = td.getElementsByTagName("tr");

                for (let j = 0; j < trElements.length; j++) {
                    const tr = trElements[j];

                    if (tr.classList.contains("oddColor") || tr.classList.contains("evenColor")) {
                        const centeredTDs = Array.from(tr.getElementsByTagName("td")).filter(td => td.getAttribute("align") === "center");

                        if (centeredTDs.length >= 4) {
                            const fourthCenteredTD = centeredTDs[3];
                            const penaltyValue = parseInt(fourthCenteredTD.textContent.trim(), 10);

                            if (penaltyValue === 0) continue;

                            if (!isHomeTeamSection) {
                                if (penaltyValue === 2) countTwoMinutePenaltiesAway++;
                                else if (penaltyValue === 4) countTwoMinutePenaltiesAway += 2;
                                else if (!isNaN(penaltyValue)) countMajorPenaltiesAway++;
                            } else {
                                if (penaltyValue === 2) countTwoMinutePenaltiesHome++;
                                else if (penaltyValue === 4) countTwoMinutePenaltiesHome += 2;
                                else if (!isNaN(penaltyValue)) countMajorPenaltiesHome++;
                            }
                        }
                    }
                }

                isHomeTeamSection = true;
            }
        }

        const totalPenaltiesAway = countTwoMinutePenaltiesAway + countMajorPenaltiesAway;
        const totalPenaltiesHome = countTwoMinutePenaltiesHome + countMajorPenaltiesHome;

        createTable(totalPenaltiesHome, totalPenaltiesAway, countTwoMinutePenaltiesHome, countTwoMinutePenaltiesAway, countMajorPenaltiesHome, countMajorPenaltiesAway);
    }

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
            cell1.textContent = rowData[0];
            const cell2 = row.insertCell(1);
            cell2.textContent = rowData[1];
        });

        document.body.appendChild(table);
    }

    findSpecificTDAndDisplayPenalties();

    const targetNode = document.getElementById('PenaltySummary');
    const observerOptions = { childList: true, subtree: true };

    const observer = new MutationObserver(() => {
        findSpecificTDAndDisplayPenalties();
    });

    if (targetNode) {
        observer.observe(targetNode, observerOptions);
    }
})();
