// ==UserScript==
// @name         Hokej Liiga - GK Subs
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Count and display goalie changes for home and away teams
// @author       MK
// @match        *liiga.fi/en/game/*
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/484041/Hokej%20Liiga%20-%20GK%20Subs.user.js
// @updateURL https://update.greasyfork.org/scripts/484041/Hokej%20Liiga%20-%20GK%20Subs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait until the DOM is fully loaded
    window.addEventListener('load', function () {

        let homeTeamLogo = document.querySelector('#game-details-team-logo-home > img').getAttribute('src');
        let awayTeamLogo = document.querySelector('#game-details-team-logo-away > img').getAttribute('src');
        let homeCount = 0;
        let awayCount = 0;
        let events = document.querySelectorAll('#event-container');

        events.forEach(event => {
            let goalieChangeTextElement = event.querySelector('div:nth-child(2) > div');
            let teamLogoElement = event.querySelector('div:nth-child(3) > div:nth-child(2) > div:nth-child(2) > div#logo > img');

            if (goalieChangeTextElement && teamLogoElement) {
                let goalieChangeText = goalieChangeTextElement.textContent;
                let teamLogoSrc = teamLogoElement.getAttribute('src');

                if (goalieChangeText === "goalie change" && teamLogoSrc) {
                    if (teamLogoSrc === homeTeamLogo) {
                        homeCount++;
                    } else if (teamLogoSrc === awayTeamLogo) {
                        awayCount++;
                    }
                }
            }
        });

        // Create table and apply custom class
        let table = document.createElement('table');
        table.className = 'custom-table';
        table.innerHTML = `
            <tr id="goalie-sub-home">
                <td>Home Goalie Substitution</td>
                <td>${homeCount}</td>
            </tr>
            <tr id="goalie-sub-away">
                <td>Away Goalie Substitution</td>
                <td>${awayCount}</td>
            </tr>
        `;

        // Append table to the body of the document
        document.body.appendChild(table);

        // Create and append style element to head
        let style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
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
            .custom-table td:last-child {
                width: 50px;
                text-align: center;
                font-weight: bold;
            }
        `;
        document.head.appendChild(style);
    });
})();