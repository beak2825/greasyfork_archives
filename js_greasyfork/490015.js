// ==UserScript==
// @name         MLB
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Tabulka přes Fetch
// @author       Michal
// @match        https://www.mlb.com/gameday/*/live/summary*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490015/MLB.user.js
// @updateURL https://update.greasyfork.org/scripts/490015/MLB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function fetchDataAndUpdateTable() {
        const gameId = window.location.pathname.split("/")[6];
        const apiUrl = `https://ws.statsapi.mlb.com/api/v1.1/game/${gameId}/feed/live?language=en`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const awayScore = data.liveData.plays.currentPlay.result.awayScore || "0";
                const homeScore = data.liveData.plays.currentPlay.result.homeScore || "0";
                const Status = data.gameData.status.abstractGameState;
                const awayHits = data.liveData.boxscore.teams.away.teamStats.batting.hits || "0";
                const homeHits = data.liveData.boxscore.teams.home.teamStats.batting.hits || "0";
                const awayErrors = data.liveData.boxscore.teams.away.teamStats.fielding.errors || "0";
                const homeErrors = data.liveData.boxscore.teams.home.teamStats.fielding.errors || "0";
                const awayAtbats = data.liveData.boxscore.teams.away.teamStats.batting.atBats || "0";
                const homeAtbats = data.liveData.boxscore.teams.home.teamStats.batting.atBats || "0";
                const awayLeftOnBase = data.liveData.boxscore.teams.away.teamStats.batting.leftOnBase || "0";
                const homeLeftOnBase = data.liveData.boxscore.teams.home.teamStats.batting.leftOnBase || "0";
                const awayStrikeOuts = data.liveData.boxscore.teams.away.teamStats.batting.strikeOuts || "0";
                const homeStrikeOuts = data.liveData.boxscore.teams.home.teamStats.batting.strikeOuts || "0";
                const awayHomeRuns = data.liveData.boxscore.teams.away.teamStats.batting.homeRuns || "0";
                const homeHomeRuns = data.liveData.boxscore.teams.home.teamStats.batting.homeRuns || "0";
                const awayRbi = data.liveData.boxscore.teams.away.teamStats.batting.rbi || "0";
                const homeRbi = data.liveData.boxscore.teams.home.teamStats.batting.rbi || "0";
                const awayBaseOnBalls = data.liveData.boxscore.teams.away.teamStats.batting.baseOnBalls || "0";
                const homeBaseOnBalls = data.liveData.boxscore.teams.home.teamStats.batting.baseOnBalls || "0";
                const awayRuns = data.liveData.boxscore.teams.away.teamStats.batting.runs || "0";
                const homeRuns = data.liveData.boxscore.teams.home.teamStats.batting.runs || "0";
                const awayStolenBases = data.liveData.boxscore.teams.away.teamStats.batting.stolenBases || "0";
                const homeStolenBases = data.liveData.boxscore.teams.home.teamStats.batting.stolenBases || "0";
                const awayDoubles = data.liveData.boxscore.teams.away.teamStats.batting.doubles || "0";
                const homeDoubles = data.liveData.boxscore.teams.home.teamStats.batting.doubles || "0";
                const awayTriples = data.liveData.boxscore.teams.away.teamStats.batting.triples || "0";
                const homeTriples = data.liveData.boxscore.teams.home.teamStats.batting.triples || "0";
                const awayBatters = Math.max(0, data.liveData.boxscore.teams.away.batters.length);
                const homeBatters = Math.max(0, data.liveData.boxscore.teams.home.batters.length);
                const awayPitchers = Math.max(0, data.liveData.boxscore.teams.away.pitchers.length);
                const homePitchers = Math.max(0, data.liveData.boxscore.teams.home.pitchers.length);

                const awayBatPitch = awayBatters - awayPitchers;
                const homeBatPitch = homeBatters - homePitchers;

                     let table = document.getElementById('custom-table-' + gameId);
                if (!table) {
                    let style = document.createElement('style');
                    style.type = 'text/css';
                    style.innerHTML = `
                        .custom-table {
                            position: absolute;
                            top: 200px;
                            left: 5px;
                            border-collapse: collapse;
                            border: 3px solid black;
                            background-color: white;
                            font-size: 16px;
                            z-index: 999;
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
                    document.head.appendChild(style);

                    table = document.createElement('table');
                    table.id = 'custom-table-' + gameId;
                    table.className = 'custom-table';
                    document.body.appendChild(table);
                }

                table.innerHTML = `
                    <tr><th id="away-score">Away score:</th><td id="away-score-value">${awayScore}</td></tr>
                    <tr><th id="home-score">Home score:</th><td id="home-score-value">${homeScore}</td></tr>
                    <tr><th id="Status">Status:</th><td id="Status-value">${Status}</td></tr>
                    <tr><th id="away-hits">Away hits:</th><td id="away-hits-value">${awayHits}</td></tr>
                    <tr><th id="home-hits">Home hits:</th><td id="home-hits-value">${homeHits}</td></tr>
                    <tr><th id="away-errors">Away errors:</th><td id="away-errors-value">${awayErrors}</td></tr>
                    <tr><th id="home-errors">Home errors:</th><td id="home-errors-value">${homeErrors}</td></tr>
                    <tr><th id="away-atbats">Away at bats:</th><td id="away-atbats-value">${awayAtbats}</td></tr>
                    <tr><th id="home-atbats">Home at bats:</th><td id="home-atbats-value">${homeAtbats}</td></tr>
                    <tr><th id="away-left-on-base">Away left on base:</th><td id="away-left-on-base-value">${awayLeftOnBase}</td></tr>
                    <tr><th id="home-left-on-base">Home left on base:</th><td id="home-left-on-base-value">${homeLeftOnBase}</td></tr>
                    <tr><th id="away-strike-outs">Away strike outs:</th><td id="away-strike-outs-value">${awayStrikeOuts}</td></tr>
                    <tr><th id="home-strike-outs">Home strike outs:</th><td id="home-strike-outs-value">${homeStrikeOuts}</td></tr>
                    <tr><th id="away-home-runs">Away home runs:</th><td id="away-home-runs-value">${awayHomeRuns}</td></tr>
                    <tr><th id="home-home-runs">Home home runs:</th><td id="home-home-runs-value">${homeHomeRuns}</td></tr>
                    <tr><th id="away-rbi">Away RBI:</th><td id="away-rbi-value">${awayRbi}</td></tr>
                    <tr><th id="home-rbi">Home RBI:</th><td id="home-rbi-value">${homeRbi}</td></tr>
                    <tr><th id="away-base-on-balls">Away base on balls:</th><td id="away-base-on-balls-value">${awayBaseOnBalls}</td></tr>
                    <tr><th id="home-base-on-balls">Home base on balls:</th><td id="home-base-on-balls-value">${homeBaseOnBalls}</td></tr>
                    <tr><th id="away-runs">Away runs:</th><td id="away-runs-value">${awayRuns}</td></tr>
                    <tr><th id="home-runs">Home runs:</th><td id="home-runs-value">${homeRuns}</td></tr>
                    <tr><th id="away-stolen-bases">Away stolen bases:</th><td id="away-stolen-bases-value">${awayStolenBases}</td></tr>
                    <tr><th id="home-stolen-bases">Home stolen bases:</th><td id="home-stolen-bases-value">${homeStolenBases}</td></tr>
                    <tr><th id="away-doubles">Away doubles:</th><td id="away-doubles-value">${awayDoubles}</td></tr>
                    <tr><th id="home-doubles">Home doubles:</th><td id="home-doubles-value">${homeDoubles}</td></tr>
                    <tr><th id="away-triples">Away triples:</th><td id="away-triples-value">${awayTriples}</td></tr>
                    <tr><th id="home-triples">Home triples:</th><td id="home-triples-value">${homeTriples}</td></tr>
                    <tr><th id="away-batters">Away Batters:</th><td id="away-batters-value">${awayBatPitch}</td></tr>
                    <tr><th id="home-batters">Home Batters:</th><td id="home-batters-value">${homeBatPitch}</td></tr>
                    <tr><th id="away-pitchers">Away pitchers:</th><td id="away-pitchers-value">${awayPitchers}</td></tr>
                    <tr><th id="home-pitchers">Home pitchers:</th><td id="home-pitchers-value">${homePitchers}</td></tr>

                `;
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    fetchDataAndUpdateTable();
    setInterval(fetchDataAndUpdateTable, 3000);
})();