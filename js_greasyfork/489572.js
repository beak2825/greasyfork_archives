// ==UserScript==
// @name         Sportradar - Tabulka
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Fetchuje JSON soubor s daty a aktualizuje tabulku každých 5 sekund.
// @author       Martin, Michal
// @match        https://widgets.sir.sportradar.com/live-match-tracker*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489572/Sportradar%20-%20Tabulka.user.js
// @updateURL https://update.greasyfork.org/scripts/489572/Sportradar%20-%20Tabulka.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const matchId = window.location.href.match(/matchId\S([0-9]+)/)[1];
    const sportId = window.location.href.match(/sportId\S([0-9]+)/)[1];

    async function fetchDataAndUpdateTable() {
        const url = 'https://widgets.fn.sportradar.com/demolmt/en/Etc:UTC/gismo/match_info/' + matchId;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const matchData = await response.json();
            createOrUpdateTable(matchData);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }

    function createOrUpdateTable(matchData) {
        let table = document.getElementById('custom-table-' + matchId);
        if (!table) {
            table = document.createElement('table');
            table.id = 'custom-table-' + matchId;
            table.className = 'custom-table';
            document.documentElement.appendChild(table);
           let style = document.createElement('style');
                    style.type = 'text/css';
                    style.innerHTML = `
                        .custom-table {
                            position: fixed;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            border-collapse: collapse;
                            border: 3px solid black;
                            background-color: white;
                            font-size: 20px;
                            vertical-align: middle;
                            z-index: 9999999;
                            max-width: calc(100% - 60px);
                            overflow-x: auto;
                        }
                        .custom-table th,
                        .custom-table td {
                            border: 1px solid black;
                            padding: 8px;
                            text-align: center;
                        }

                        .custom-table th:first-child,
                        .custom-table td:first-child {
                            width: 200px;
                            text-align: right;
                            padding-right: 10px;
                        }
                    `;
                    document.documentElement.appendChild(style);
        }

       if (sportId === "20" || sportId === "23" || sportId === "5" || sportId === "34" || sportId === "31") {
        const fetchData = async () => {
            const url = 'https://widgets.fn.sportradar.com/demolmt/en/Etc:UTC/gismo/match_info/' + matchId;
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const matchData = await response.json();
                console.log(matchData);

                const Hometeam = matchData.doc[0].data.match.teams.home.name || "N/A";
                const homeScore = matchData.doc[0].data.match.result.home || "-";
                const awayScore = matchData.doc[0].data.match.result.away || "-";
                const homeSet1 = matchData.doc[0].data.match.periods?.p1?.home || "N/A";
                const awaySet1 = matchData.doc[0].data.match.periods?.p1?.away || "N/A";
                const homeSet2 = matchData.doc[0].data.match.periods?.p2?.home || "N/A";
                const awaySet2 = matchData.doc[0].data.match.periods?.p2?.away || "N/A";
                const homeSet3 = matchData.doc[0].data.match.periods?.p3?.home || "N/A";
                const awaySet3 = matchData.doc[0].data.match.periods?.p3?.away || "N/A";
                const homeSet4 = matchData.doc[0].data.match.periods?.p4?.home || "N/A";
                const awaySet4 = matchData.doc[0].data.match.periods?.p4?.away || "N/A";
                const homeSet5 = matchData.doc[0].data.match.periods?.p5?.home || "N/A";
                const awaySet5 = matchData.doc[0].data.match.periods?.p5?.away || "N/A";
                const homeGamescore = matchData.doc[0].data.match.gamescore?.home || "N/A";
                const awayGamescore = matchData.doc[0].data.match.gamescore?.away || "N/A";
                const status = matchData.doc[0].data.match.status.name || "N/A";

                if (!table) {
                    let style = document.createElement('style');
                    style.type = 'text/css';
                    style.innerHTML = `
                        .custom-table {
                            position: fixed;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            border-collapse: collapse;
                            border: 3px solid black;
                            background-color: white;
                            font-size: 20px;
                            vertical-align: middle;
                            z-index: 9999999;
                            max-width: calc(100% - 60px);
                            overflow-x: auto;
                        }
                        .custom-table th,
                        .custom-table td {
                            border: 1px solid black;
                            padding: 8px;
                            text-align: center;
                        }

                        .custom-table th:first-child,
                        .custom-table td:first-child {
                            width: 200px;
                            text-align: right;
                            padding-right: 10px;
                        }
                    `;
                    document.documentElement.appendChild(style);

                    table = document.createElement('table');
                    table.id = 'custom-table-' + matchId;
                    table.className = 'custom-table';
                    document.documentElement.appendChild(table);
                }

                let tableHTML = `
                    <tr><th id="hometeam">Home team:</th><td id="HometeamID">${Hometeam}</td></tr>
                    <tr><th id="home-score">Home score:</th><td id="home-score-value">${homeScore}</td></tr>
                    <tr><th id="away-score">Away score:</th><td id="away-score-value">${awayScore}</td></tr>
                    <tr><th id="home-set-1">Home set 1:</th><td id="home-set-1-value">${homeSet1}</td></tr>
                    <tr><th id="away-set-1">Away set 1:</th><td id="away-set-1-value">${awaySet1}</td></tr>
                    <tr><th id="home-set-2">Home set 2:</th><td id="home-set-2-value">${homeSet2}</td></tr>
                    <tr><th id="away-set-2">Away set 2:</th><td id="away-set-2-value">${awaySet2}</td></tr>
                    <tr><th id="home-set-3">Home set 3:</th><td id="home-set-3-value">${homeSet3}</td></tr>
                    <tr><th id="away-set-3">Away set 3:</th><td id="away-set-3-value">${awaySet3}</td></tr>
                    <tr><th id="home-set-4">Home set 4:</th><td id="home-set-4-value">${homeSet4}</td></tr>
                    <tr><th id="away-set-4">Away set 4:</th><td id="away-set-4-value">${awaySet4}</td></tr>
                    <tr><th id="home-set-5">Home set 5:</th><td id="home-set-5-value">${homeSet5}</td></tr>
                    <tr><th id="away-set-5">Away set 5:</th><td id="away-set-5-value">${awaySet5}</td></tr>
                    <tr><th id="home-gamescore">Tennis Home Score:</th><td id="home-gamescore-value">${homeGamescore}</td></tr>
                    <tr><th id="away-gamescore">Tennis Away Score:</th><td id="away-gamescore-value">${awayGamescore}</td></tr>
                    <tr><th id="status">Status:</th><td id="statusID">${status}</td></tr>
                 `;

                if (sportId === "5" && (parseInt(homeGamescore) === 50 || parseInt(awayGamescore) === 50)) {
    tableHTML = tableHTML.replace(/<td id="home-gamescore-value">50<\/td>/g, '<td id="home-gamescore-value">A</td>');
    tableHTML = tableHTML.replace(/<td id="away-gamescore-value">50<\/td>/g, '<td id="away-gamescore-value">A</td>');
}


                table.innerHTML = tableHTML;
            } catch (error) {
                console.error('Fetch error:', error);
            }
        };

        fetchData();
    }
    else if (sportId === "1" || sportId === "6" || sportId === "12" || sportId === "22" || sportId === "19"|| sportId === "4") {
        const fetchData = async () => {
            const url = 'https://widgets.fn.sportradar.com/demolmt/en/Etc:UTC/gismo/match_info/' + matchId;
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const matchData = await response.json();
                console.log(matchData);

                const Hometeam = matchData.doc[0].data.match.teams.home.name || "N/A";
                const homeScore = matchData.doc[0].data.match.result.home|| "-";
                const awayScore = matchData.doc[0].data.match.result.away|| "-";
                const status = matchData.doc[0].data.match.status.name || "N/A";

               let minute = "-";
if (sportId === "6" || sportId === "4") {
    const secondsPlayed = matchData.doc[0].data.match.timeinfo.played;
    if (secondsPlayed !== null && !isNaN(secondsPlayed)) {
        let minutesPlayed;
        if (sportId === "6") {
            minutesPlayed = Math.floor(secondsPlayed / 60) + 1;
        } else if (sportId === "4") {
            const periodSeconds = 20 * 60;
            const periodIndex = Math.floor(secondsPlayed / periodSeconds) + 1;
            const remainingSeconds = secondsPlayed % periodSeconds;
            if (remainingSeconds === 0) {
                minutesPlayed = 20;
            } else {
                minutesPlayed = Math.floor(remainingSeconds / 60) + 1;
            }
        }
        minute = minutesPlayed;
    }
}


                if (!table) {
                    let style = document.createElement('style');
                    style.type = 'text/css';
                    style.innerHTML = `
                        .custom-table {
                            position: fixed;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            border-collapse: collapse;
                            border: 3px solid black;
                            background-color: white;
                            font-size: 20px;
                            vertical-align: middle;
                            z-index: 999;
                            max-width: calc(100% - 60px);
                            overflow-x: auto;
                        }
                        .custom-table th,
                        .custom-table td {
                            border: 1px solid black;
                            padding: 8px;
                            text-align: center;
                        }

                        .custom-table th:first-child,
                        .custom-table td:first-child {
                            width: 200px;
                            text-align: right;
                            padding-right: 10px;
                        }
                    `;
                    document.documentElement.appendChild(style);

                    table = document.createElement('table');
                    table.id = 'custom-table-' + matchId;
                    table.className = 'custom-table';
                    document.documentElement.appendChild(table);
                }

                     let tableHTML = `
                    <tr><th id="hometeam">Home team:</th><td id="HometeamID">${Hometeam}</td></tr>
                    <tr><th id="home-score">Home score:</th><td id="home-score-value">${homeScore}</td></tr>
                    <tr><th id="away-score">Away score:</th><td id="away-score-value">${awayScore}</td></tr>
                    <tr><th id="status">Status:</th><td id="statusID">${status}</td></tr>
                `;

                if (sportId === "6"|| sportId === "4") {
                    tableHTML += `<tr><th id="minute">Minute:</th><td id="minuteID">${minute}</td></tr>`;
                }

                table.innerHTML = tableHTML;

            } catch (error) {
                console.error('Fetch error:', error);
            }
        };

        fetchData();
    }
    }

    setInterval(fetchDataAndUpdateTable, 5000);
    fetchDataAndUpdateTable(); // Okamžitá inicializace po načtení
})();