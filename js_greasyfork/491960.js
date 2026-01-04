// ==UserScript==
// @name         LBL basket
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Tabulka pro skóre a stats
// @author       Michal
// @match        https://lbl.basket.lv/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491960/LBL%20basket.user.js
// @updateURL https://update.greasyfork.org/scripts/491960/LBL%20basket.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        .custom-table-container {
            position: fixed;
            top: 30px;
            left: 30px;
            max-width: calc(100% - 60px);
            max-height: calc(100% - 60px);
            overflow: auto;
            background-color: rgba(255, 255, 255, 0.9);
            border: 3px solid black;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
            z-index: 999;
        }

        table.custom-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 18px;
        }
        table.custom-table td {
            border: 1px solid black;
            padding: 12px;
            text-align: center;
        }
        table.custom-table td:first-child {
            width: auto;
            text-align: left;
            font-weight: bold;
            background-color: #f0f0f0;
        }
    `;

    document.head.appendChild(style);

    var widgetShadowRoot = document.querySelector('.widget').shadowRoot;

    var container = document.createElement('div');
    container.classList.add('custom-table-container');
    document.body.appendChild(container);

    var table1 = document.createElement('table');
    table1.classList.add('custom-table');
    container.appendChild(table1);

    var previousData = null;

    setInterval(function() {
        var scoreElement = widgetShadowRoot.querySelector('.sw-fixture-banner-main-score-box-value');
        var statusElement = widgetShadowRoot.querySelector('.sw-fixture-banner-status-state-label');

        var match = scoreElement ? scoreElement.textContent.trim().match(/(\d+) - (\d+)/) : null;
        var homeScore = match ? match[1] : '';
        var awayScore = match ? match[2] : '';
        var statusText = statusElement ? statusElement.textContent.trim() : '';

        var titles = [];

        widgetShadowRoot.querySelectorAll('thead > tr > th').forEach(th => {
            if(th.getAttribute('title')) {
                titles.push(th.getAttribute('title'));
            }
        });

        var lastRowTds = widgetShadowRoot.querySelectorAll('tbody > tr:last-child > td');

        var data = [];

        for (let i = 4; i < lastRowTds.length && i - 4 < titles.length; i++) {
            data.push(lastRowTds[i].textContent);
        }

        var newData = JSON.stringify({homeScore, awayScore, statusText, data});

        if (newData !== previousData) {
            previousData = newData;

            table1.innerHTML = `
                <tr>
                    <td id="Home_Score">Home Score</td>
                    <td id="Home_Score_Value">${homeScore}</td>
                </tr>
                <tr>
                    <td id="Away_Score">Away Score</td>
                    <td id="Away_Score_Value">${awayScore}</td>
                </tr>
                <tr>
                    <td id="Status">Status</td>
                    <td id="Status_Value">${statusText}</td>
                </tr>
            `;

            let personalFoulsIndex = titles.indexOf('Izprovocētas piezīme');
            let isHome = true;

            for (let i = 4; i < lastRowTds.length && i - 4 < titles.length; i++) {
                let team = isHome ? 'Home' : 'Away';
                let id = `Row${lastRowTds.length - 4}_Col${i - 3}`;

                if (titles[i - 4] === 'Izprovocētas piezīme') {
                    isHome = false;
                }

                if (titles[i - 4] !== 'Efektivitāte' && titles[i - 4] !== 'Plus/mīnus') {
                    table1.innerHTML += `
                        <tr>
                            <td>${team} ${titles[i - 4]}</td>
                            <td id="${team}_${id}_Value">${data[i - 4]}</td>
                        </tr>
                    `;
                }
            }
        }

    }, 2000);
})();