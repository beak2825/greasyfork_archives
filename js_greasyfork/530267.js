// ==UserScript==
// @name         Cricheroes JSON Table
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  Vytváří tabulku v Cricheroes zdrojáku.
// @author       MK
// @match        https://cricheroes.com/_next/data/*/scorecard/*/scorecard.json
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/530267/Cricheroes%20JSON%20Table.user.js
// @updateURL https://update.greasyfork.org/scripts/530267/Cricheroes%20JSON%20Table.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function fetchDataAndUpdateTable() {
        try {
            const preElement = document.querySelector('body pre');
            if (!preElement) throw new Error("Element <pre> s JSON daty nebyl nalezen.");

            const jsonData = JSON.parse(preElement.textContent.trim());

            const dataPath = jsonData.pageProps.summaryData?.data || jsonData.pageProps.miniScorecard?.data;
            if (!dataPath) throw new Error("Data nebyla nalezena ani v summaryData, ani v miniScorecard.");

            const teamAInnings = dataPath.team_a.innings.map(
                inning => `${inning.total_run}/${inning.total_wicket} (${inning.overs_played})`
            );
            const teamBInnings = dataPath.team_b.innings.map(
                inning => `${inning.total_run}/${inning.total_wicket} (${inning.overs_played})`
            );

            const matchData = {
                teamA: teamAInnings,
                teamB: teamBInnings,
                matchEvent: dataPath.match_event,
                matchResult: dataPath.match_result,
                tossDetails: dataPath.toss_details,
                status: dataPath.status
            };

            createTable(matchData);
            console.log("Data načtena a zobrazena:", matchData);
        } catch (error) {
            console.error("Chyba při extrakci JSON z <pre> elementu:", error);
        }
    }

    function createTable(matchData) {
        const existingTable = document.querySelector('.custom-table');
        if (existingTable) existingTable.remove();

        const table = document.createElement('table');
        table.className = 'custom-table';

        let scoreIndex = 1;
        matchData.teamA.forEach((score) => {
            const tr = document.createElement('tr');
            tr.id = `score_${scoreIndex}`;
            tr.innerHTML = `<td>Score ${scoreIndex}</td><td>${score}</td>`;
            table.appendChild(tr);
            scoreIndex++;
        });

        matchData.teamB.forEach((score) => {
            const tr = document.createElement('tr');
            tr.id = `score_${scoreIndex}`;
            tr.innerHTML = `<td>Score ${scoreIndex}</td><td>${score}</td>`;
            table.appendChild(tr);
            scoreIndex++;
        });

        const extraRows = [
            { id: 'Match_Event', label: 'Match Event', value: matchData.matchEvent },
            { id: 'Match_Result', label: 'Match Result', value: matchData.matchResult },
            { id: 'Toss', label: 'Toss', value: matchData.tossDetails },
            { id: 'Status', label: 'Status', value: matchData.status }
        ];

        extraRows.forEach(row => {
            const tr = document.createElement('tr');
            tr.id = row.id;
            tr.innerHTML = `<td>${row.label}</td><td>${row.value}</td>`;
            table.appendChild(tr);
        });

        document.body.appendChild(table);
    }

    const style = document.createElement('style');
    style.textContent = `
        .custom-table {
            position: fixed;
            top: 60px;
            left: 30px;
            border: 3px solid black;
            background-color: white;
            font-size: 20px;
            z-index: 9999;
        }
        .custom-table td {
            border: 1px solid black;
        }
        .custom-table td:first-child {
            width: 200px;
            text-align: right;
            padding-right: 10px;
        }
        .custom-table td:nth-child(n+2) {
            width: 50px;
            text-align: center;
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);

    fetchDataAndUpdateTable();
})();
