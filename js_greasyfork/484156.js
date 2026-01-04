// ==UserScript==
// @name         Australian Open
// @namespace    http://tampermonkey.net/
// @version      2024-01-07
// @description  Skript vytvářející tabulku se statistikami
// @author       MK
// @match        https://prod-scores-api.ausopen.com/match-centre/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ausopen.com
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/484156/Australian%20Open.user.js
// @updateURL https://update.greasyfork.org/scripts/484156/Australian%20Open.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const preTag = document.body.querySelector("pre");
    const matchDataText = preTag.textContent || preTag.innerText;
    const matchData = JSON.parse(matchDataText);
    const allSetStats = matchData.stats.key_stats[0].sets.find(setInfo => setInfo.set === 'All').stats;

    let acesHome = allSetStats.find(stat => stat.name === 'Aces').teamA.primary;
    let acesAway = allSetStats.find(stat => stat.name === 'Aces').teamB.primary;
    let doubleFaultsHome = allSetStats.find(stat => stat.name === 'Double faults').teamA.primary;
    let doubleFaultsAway = allSetStats.find(stat => stat.name === 'Double faults').teamB.primary;
    let winnersHome = allSetStats.find(stat => stat.name === 'Winners').teamA.primary;
    let winnersAway = allSetStats.find(stat => stat.name === 'Winners').teamB.primary;
    let unforcedErrorsHome = allSetStats.find(stat => stat.name === 'Unforced errors').teamA.primary;
    let unforcedErrorsAway = allSetStats.find(stat => stat.name === 'Unforced errors').teamB.primary;
    let firstServeHome = allSetStats.find(stat => stat.name === 'Win 1st serve').teamA.secondary;
    let firstServeAway = allSetStats.find(stat => stat.name === 'Win 1st serve').teamB.secondary;
    let secondServeHome = allSetStats.find(stat => stat.name === 'Win 2nd serve').teamA.secondary;
    let secondServeAway = allSetStats.find(stat => stat.name === 'Win 2nd serve').teamB.secondary;
    let netPointsHome = allSetStats.find(stat => stat.name === 'Net points won').teamA.secondary;
    let netPointsAway = allSetStats.find(stat => stat.name === 'Net points won').teamB.secondary;
    let firstReturnPointsHome = firstServeAway.match(/\/([0-9]+)/)[1] - firstServeAway.match(/([0-9]+)\//)[1];
    let firstReturnPointsAway = firstServeHome.match(/\/([0-9]+)/)[1] - firstServeHome.match(/([0-9]+)\//)[1];
    let secondReturnPointsHome = secondServeAway.match(/\/([0-9]+)/)[1] - secondServeAway.match(/([0-9]+)\//)[1];
    let secondReturnPointsAway = secondServeHome.match(/\/([0-9]+)/)[1] - secondServeHome.match(/([0-9]+)\//)[1];


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
            <tr><td>Aces:</td><td id="aces_home">${acesHome}</td><td id="aces_away">${acesAway}</td></tr>
            <tr><td>Double Faults:</td><td id="double_faults_home">${doubleFaultsHome}</td><td id="double_faults_away">${doubleFaultsAway}</td></tr>
            <tr><td>1st Serve Points:</td><td id="first_serve_points_home">${firstServeHome}</td><td id="first_serve_points_away">${firstServeAway}</td></tr>
            <tr><td>2nd Serve Points:</td><td id="second_serve_points_home">${secondServeHome}</td><td id="second_serve_points_away">${secondServeAway}</td></tr>
            <tr><td>1st Return Points:</td><td id="first_return_points_home">${firstReturnPointsHome}</td><td id="first_return_points_away">${firstReturnPointsAway}</td></tr>
            <tr><td>2nd Return Points:</td><td id="second_return_points_home">${secondReturnPointsHome}</td><td id="second_return_points_away">${secondReturnPointsAway}</td></tr>
            <tr><td>Winners:</td><td id="winners_home">${winnersHome}</td><td id="winners_away">${winnersAway}</td></tr>
            <tr><td>Unforced Errors:</td><td id="unforced_errors_home">${unforcedErrorsHome}</td><td id="unforced_errors_away">${unforcedErrorsAway}</td></tr>
            <tr><td>Net points:</td><td id="net_points_home">${netPointsHome}</td><td id="net_points_away">${netPointsAway}</td></tr>
        `;
        document.body.appendChild(table);
})();