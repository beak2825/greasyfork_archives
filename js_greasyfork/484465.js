// ==UserScript==
// @name         ATP StatsScript
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Skript vytvářející tabulku se statistikami
// @author       JK
// @match        https://www.atptour.com/-/Hawkeye/MatchStats/2024/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atptour.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484465/ATP%20StatsScript.user.js
// @updateURL https://update.greasyfork.org/scripts/484465/ATP%20StatsScript.meta.js
// ==/UserScript==

setTimeout(function() {
    'use strict';
    const preTag = document.body.querySelector("pre");
    const matchDataText = preTag.textContent || preTag.innerText;
    const matchData = JSON.parse(matchDataText);
    const statsHome = matchData.Match.PlayerTeam.SetScores.find(setInfo => setInfo.SetNumber === 0).Stats;
    const statsAway = matchData.Match.OpponentTeam.SetScores.find(setInfo => setInfo.SetNumber === 0).Stats;

    let acesHome = statsHome.ServiceStats.Aces.Number;
    let acesAway = statsAway.ServiceStats.Aces.Number;
    let doubleFaultsHome = statsHome.ServiceStats.DoubleFaults.Number;
    let doubleFaultsAway = statsAway.ServiceStats.DoubleFaults.Number;
    let firstServeHome = statsHome.ServiceStats.FirstServePointsWon.Dividend + "/" + statsHome.ServiceStats.FirstServePointsWon.Divisor;
    let firstServeAway = statsAway.ServiceStats.FirstServePointsWon.Dividend + "/" + statsAway.ServiceStats.FirstServePointsWon.Divisor;
    let secondServeHome = statsHome.ServiceStats.SecondServePointsWon.Dividend + "/" + statsHome.ServiceStats.SecondServePointsWon.Divisor;
    let secondServeAway = statsAway.ServiceStats.SecondServePointsWon.Dividend + "/" + statsAway.ServiceStats.SecondServePointsWon.Divisor;
    let firstReturnPointsWonHome = statsHome.ReturnStats.FirstServeReturnPointsWon.Dividend;
    let firstReturnPointsWonAway = statsAway.ReturnStats.FirstServeReturnPointsWon.Dividend;
    let secondReturnPointsWonHome = statsHome.ReturnStats.SecondServeReturnPointsWon.Dividend;
    let secondReturnPointsWonAway = statsAway.ReturnStats.SecondServeReturnPointsWon.Dividend;
    let winnersHome;
    let winnersAway;
    let unforcedErrorsHome;
    let unforcedErrorsAway;
    let netPointsHome;
    let netPointsAway;

    let style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
            table.custom-table {
                position: fixed;
                top: 60px;
                left: 30px;
                border: 3px solid black;
                background-color: white;
                font-size: 20px;
                vertical-align: middle;
                z-index: 999;
            }
            table.custom-table td {
                border: 1px solid black;
            }

            table.custom-table td:not(:first-child) {
                width: 50px;
                text-align: center;
                font-weight: bold;
            }
            table.custom-table td:first-child {
                width: 200px;
                text-align: right;
                padding-right: 10px;
            }
        `;
    document.head.appendChild(style);

    let table = document.createElement('table');
    table.className = 'custom-table';

    table.innerHTML = `
            <tr><th></th><th>Home</th><th>Away</th></tr>
            <tr><td>Aces:</td><td id="aces_home">${acesHome ? acesHome : "Null"}</td><td id="aces_away">${acesAway ? acesAway : "Null"}</td></tr>
            <tr><td>Double Faults:</td><td id="double_faults_home">${doubleFaultsHome ? doubleFaultsHome : "Null"}</td><td id="double_faults_away">${doubleFaultsAway ? doubleFaultsAway : "Null"}</td></tr>
            <tr><td>1st Serve:</td><td id="first_serve_home">${firstServeHome ? firstServeHome : "Null"}</td><td id="first_serve_away">${firstServeAway ? firstServeAway : "Null"}</td></tr>
            <tr><td>2nd Serve:</td><td id="second_serve_home">${secondServeHome ? secondServeHome : "Null"}</td><td id="second_serve_away">${secondServeAway ? secondServeAway : "Null"}</td></tr>
            <tr><td>1st Return Points Won:</td><td id="first_return_points_home">${firstReturnPointsWonHome ? firstReturnPointsWonHome : "Null"}</td><td id="first_return_points_away">${firstReturnPointsWonAway ? firstReturnPointsWonAway : "Null"}</td></tr>
            <tr><td>2nd Return Points Won:</td><td id="second_return_points_home">${secondReturnPointsWonHome ? secondReturnPointsWonHome : "Null"}</td><td id="second_return_points_away">${secondReturnPointsWonAway ? secondReturnPointsWonAway : "Null"}</td></tr>
            <tr><td>Winners:</td><td id="winners_home">${winnersHome ? winnersHome : "Null"}</td><td id="winners_away">${winnersAway ? winnersAway : "Null"}</td></tr>
            <tr><td>Unforced Errors:</td><td id="unforced_errors_home">${unforcedErrorsHome ? unforcedErrorsHome : "Null"}</td><td id="unforced_errors_away">${unforcedErrorsAway ? unforcedErrorsAway : "Null"}</td></tr>
            <tr><td>Net Points:</td><td id="net_points_home">${netPointsHome ? netPointsHome : "Null"}</td><td id="net_points_away">${netPointsAway ? netPointsAway : "Null"}</td></tr>
        `;
    document.body.appendChild(table);

},2000)();