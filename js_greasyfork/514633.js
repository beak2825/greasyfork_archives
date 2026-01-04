// ==UserScript==
// @name         Cricheroes
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Fetchuje zdrojový kód a vytváří tabulku s výsledky zápasu na stránce každých 7–15 sekund s náhodným intervalem mezi voláními.
// @author       MK
// @match        https://cricheroes.com/scorecard/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cricheroes.com
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/514633/Cricheroes.user.js
// @updateURL https://update.greasyfork.org/scripts/514633/Cricheroes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Funkce pro vytvoření tabulky a přidání na stránku
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

        const rows = [
            { id: 'Match_Event', label: 'Match Event', value: matchData.matchEvent },
            { id: 'Match_Result', label: 'Match Result', value: matchData.matchResult },
            { id: 'Toss', label: 'Toss', value: matchData.tossDetails }
        ];

        rows.forEach(row => {
            const tr = document.createElement('tr');
            tr.id = row.id;
            const tdLabel = document.createElement('td');
            tdLabel.textContent = row.label;
            tr.appendChild(tdLabel);

            const tdValue = document.createElement('td');
            tdValue.textContent = row.value;
            tr.appendChild(tdValue);

            table.appendChild(tr);
        });

        document.body.appendChild(table);
    }

    // Stylování tabulky podle tvého nastavení
    const style = document.createElement('style');
    style.textContent = `
        .custom-table {
            position: fixed;
            top: 60px;
            left: 30px;
            border: 3px solid black;
            background-color: white;
            font-size: 20px;
            vertical-align: middle;
            z-index: 999999999;
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

    // Funkce pro načítání dat a aktualizaci tabulky
    async function fetchDataAndUpdateTable() {
        document.querySelectorAll('script').forEach(async s => {
            if (s.src.endsWith('_buildManifest.js')) {
                const hash = s.src.match(/static\/(.*?)\/_buildManifest.js/)[1];
                const pathMatch = window.location.href.match(/cricheroes\.com\/scorecard\/(.*\/(?=[^\/]*$))/);
                const path = pathMatch ? pathMatch[1] : null;

                if (path) {
                    const url = `https://cricheroes.com/_next/data/${hash}/scorecard/${path}scorecard.json`;
                    try {
                        const response = await fetch(url);
                        const jsonData = await response.json();

                        const teamAInnings = jsonData.pageProps.miniScorecard.data.team_a.innings.map(
                            inning => `${inning.total_run}/${inning.total_wicket} (${inning.overs_played})`
                        );
                        const teamBInnings = jsonData.pageProps.miniScorecard.data.team_b.innings.map(
                            inning => `${inning.total_run}/${inning.total_wicket} (${inning.overs_played})`
                        );

                        const matchEvent = jsonData.pageProps.miniScorecard.data.match_event;
                        const matchResult = jsonData.pageProps.miniScorecard.data.match_result;
                        const tossDetails = jsonData.pageProps.miniScorecard.data.toss_details;

                        const matchData = {
                            teamA: teamAInnings,
                            teamB: teamBInnings,
                            matchEvent: matchEvent,
                            matchResult: matchResult,
                            tossDetails: tossDetails
                        };

                        createTable(matchData);

                        console.log("Data uložena do sessionStorage a zobrazena na stránce:", matchData);

                    } catch (error) {
                        console.error("Chyba při načítání JSON:", error);
                    }
                } else {
                    console.error("Path not found in URL");
                }
            }
        });

        // Nastaví nový interval mezi 7 a 15 sekundami a znovu zavolá funkci
        const randomInterval = Math.floor(Math.random() * (15 - 7 + 1) + 7) * 1000;
        setTimeout(fetchDataAndUpdateTable, randomInterval);
    }

    // První volání hned při načtení stránky
    fetchDataAndUpdateTable();

})();
