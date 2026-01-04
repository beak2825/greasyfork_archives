// ==UserScript==
// @name         Tresty - m.sihf.ch
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Vytváří tabulku s tresty
// @author       You
// @match        *://m.sihf.ch/de/*
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/483863/Tresty%20-%20msihfch.user.js
// @updateURL https://update.greasyfork.org/scripts/483863/Tresty%20-%20msihfch.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(() => {
        let rows = document.querySelectorAll('table.table__game-process > tbody > tr');
        let minorPenaltyRegex = /2 Min/;
        let majorPenaltyRegex = /[3-9]+ Min/;
        let penaltyTotalRegex = /[1-9][0-9]? Min/;
        let penaltyShotRegex = /\b0 Min/

        function calculatePenalty(teamSelector, penaltyRegex) {
            let penalty = 0;
            let teamElement = document.querySelector(teamSelector);
            let team = teamElement.getAttribute('data-ng-style').match(/Club\/(\d+)\./)[1];

            rows.forEach(row => {
                let img = row.querySelector('td:nth-child(2) > img');
                let span = row.querySelector('td:nth-child(4) > span');
                let idMatch = img ? img.getAttribute('data-ng-src').match(/Club\/(\d+)\./) : null;

                if (idMatch && idMatch[1] === team && span && penaltyRegex.test(span.textContent)) {
                    penalty++;
                }
            });

            return penalty;
        }

        let homePenalty2 = calculatePenalty('.game-result-team:nth-child(1) > div:nth-child(1)', minorPenaltyRegex);
        let awayPenalty2 = calculatePenalty('.game-result-team:nth-child(2) > div:nth-child(1)', minorPenaltyRegex);
        let homePenaltyTotal = calculatePenalty('.game-result-team:nth-child(1) > div:nth-child(1)', penaltyTotalRegex);
        let awayPenaltyTotal = calculatePenalty('.game-result-team:nth-child(2) > div:nth-child(1)', penaltyTotalRegex);
        let homePenaltyShot = calculatePenalty('.game-result-team:nth-child(1) > div:nth-child(1)', penaltyShotRegex);
        let awayPenaltyShot = calculatePenalty('.game-result-team:nth-child(2) > div:nth-child(1)', penaltyShotRegex);
        let homePenaltyMajor = homePenaltyTotal - homePenalty2;
        let awayPenaltyMajor = awayPenaltyTotal - awayPenalty2;

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
            table.custom-table td:first-child {
                width: 200px;
                text-align: right;
                padding-right: 10px;
            }
            table.custom-table td:last-child {
                width: 50px;
                text-align: center;
                font-weight: bold;
            }
        `;
        document.head.appendChild(style);

        let table = document.createElement('table');
        table.className = 'custom-table';

        table.innerHTML = `
            <tr id="penalties_home_2"><td>Home 2-Min Penalty: </td><td>${homePenalty2}</td></tr>
            <tr id="penalties_away_2"><td>Away 2-Min Penalty: </td><td>${awayPenalty2}</td></tr>
            <tr id="penalties_home_major"><td>Home Major Penalty: </td><td>${homePenaltyMajor}</td></tr>
            <tr id="penalties_away_major"><td>Away Major Penalty: </td><td>${awayPenaltyMajor}</td></tr>
            <tr id="penalties_home_total"><td>Home Penalties: </td><td>${homePenaltyTotal}</td></tr>
            <tr id="penalties_away_total"><td>Away Penalties: </td><td>${awayPenaltyTotal}</td></tr>
            <tr id="penalty_shots_home"><td>Home Penalty Shots: </td><td>${homePenaltyShot}</td></tr>
            <tr id="penalty_shots_away"><td>Away Penalty Shots: </td><td>${awayPenaltyShot}</td></tr>
        `;

        document.body.appendChild(table);

    }, 2000);

})();