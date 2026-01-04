// ==UserScript==
// @name         EASL basket
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Create a custom table with scores, status, and penalties from the specified selectors using regex
// @author       You
// @match        https://www.easl.basketball/schedule*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488280/EASL%20basket.user.js
// @updateURL https://update.greasyfork.org/scripts/488280/EASL%20basket.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        table.custom-table {
            position: fixed;
            top: 60px;
            left: 30px;
            border-collapse: collapse;
            border: 3px solid black;
            background-color: white;
            font-size: 16px;
            vertical-align: middle;
            z-index: 999;
        }
        table.custom-table td {
            border: 1px solid black;
            padding: 8px;
            text-align: center;
        }
        table.custom-table td:first-child {
            width: 200px;
            text-align: right;
            padding-right: 10px;
            font-weight: bold;
        }
    `;

    document.head.appendChild(style);

    var widgetShadowRoot = document.querySelector('.widget').shadowRoot;

    var table = document.createElement('table');
    table.classList.add('custom-table');

    document.body.appendChild(table);

    setInterval(function() {
        var scoreElement = widgetShadowRoot.querySelector('.sw-fixture-banner-main-score-box-value');
        var statusElement = widgetShadowRoot.querySelector('.sw-fixture-banner-status-state-label');

        var match = scoreElement ? scoreElement.textContent.trim().match(/(\d+) - (\d+)/) : null;
        var homeScore = match ? match[1] : '';
        var awayScore = match ? match[2] : '';
        var statusText = statusElement ? statusElement.textContent.trim() : '';

        table.innerHTML = `
            <tr id="home_score_row">
                <td>Home Score</td>
                <td id="home_score">${homeScore}</td>
            </tr>
            <tr id="away_score_row">
                <td>Away Score</td>
                <td id="away_score">${awayScore}</td>
            </tr>
            <tr id="status_row">
                <td>Status</td>
                <td id="status">${statusText}</td>
            </tr>
        `;
    }, 2000);
})();