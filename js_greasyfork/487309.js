// ==UserScript==
// @name         Hokej Liiga - GK Subs & URL úprava
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Modify live URLs on Liiga website and track goalie substitutions
// @author       Michal
// @match        https://liiga.fi/en/game/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487309/Hokej%20Liiga%20-%20GK%20Subs%20%20URL%20%C3%BAprava.user.js
// @updateURL https://update.greasyfork.org/scripts/487309/Hokej%20Liiga%20-%20GK%20Subs%20%20URL%20%C3%BAprava.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let year, gameId, queryParams;
    let currentUrl = window.location.href;
    let homeTeamLogo, awayTeamLogo;
    let homeCount = 0;
    let awayCount = 0;

    window.addEventListener('load', function () {
        homeTeamLogo = document.querySelector('#game-details-team-logo-home > img').getAttribute('src');
        awayTeamLogo = document.querySelector('#game-details-team-logo-away > img').getAttribute('src');
        const events = document.querySelectorAll('#event-container');

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

        updateGoalieSubsTable();
    });

    function updateGoalieSubsTable() {
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

        document.body.appendChild(table);
    }

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

    const buttonContainer = document.createElement('div');
    buttonContainer.style = `
        position: fixed;
        bottom: 20px;
        left: 0;
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        z-index: 10000000;
        padding: 10px;
        background-color: rgba(255, 255, 255, 0.8);
    `;
    document.body.appendChild(buttonContainer);

    function createButton(text, action) {
        const button = document.createElement('button');
        button.innerHTML = text;
        button.style.marginRight = '10px';
        button.addEventListener('click', function() {
            const newUrl = `https://liiga.fi/en/game/${year}/${gameId}/${action}${queryParams}`;
            history.pushState({}, '', newUrl);
        });
        buttonContainer.appendChild(button);
    }

    createButton('Events', 'events');
    createButton('Stats', 'stats');
    createButton('Rink Maps', 'rinkmaps');

    setTimeout(checkScript, 5000);

    function checkScript() {
        const exampleElement = document.querySelector('.example-class');
        if (!exampleElement) {
            console.log('Skript přestal fungovat.');
        }
    }

    function updateURL() {
        const urlParts = window.location.href.match(/\/game\/(\d+)\/(\d+)\//);
        if (urlParts && urlParts.length === 3) {
            year = urlParts[1];
            gameId = urlParts[2];
            queryParams = window.location.search; // získá všechny parametry z URL
            currentUrl = window.location.href;
        }
    }

    setInterval(function() {
        if (window.location.href !== currentUrl) {
            updateURL();
        }
    }, 1000);

    updateURL();

    window.addEventListener('popstate', function(event) {
        updateURL();
        console.log("URL byla změněna pomocí funkce history, skript byl aktualizován.");
    });

})();
