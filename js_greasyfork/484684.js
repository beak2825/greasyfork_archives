// ==UserScript==
// @name         SR Tresty
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  try to take over the world!
// @author       MK
// @match        https://lmt.fn.sportradar.com/demolmt/en/Etc:UTC/gismo/match_timeline/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sportradar.com
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/484684/SR%20Tresty.user.js
// @updateURL https://update.greasyfork.org/scripts/484684/SR%20Tresty.meta.js
// ==/UserScript==

(function() {
    'use strict';
const preTag = document.body.querySelector("pre");
const matchDataText = preTag.textContent || preTag.innerText;
const matchData = JSON.parse(matchDataText);

let penalty = {
    home2: 0,
    away2: 0,
    home5: 0,
    away5: 0,
    home4: 0,
    away4: 0,
    home25: 0,
    away25: 0,
    home20: 0,
    away20: 0,
    homeTotal: 0,
    awayTotal: 0,
    home10: 0,
    away10: 0
};

matchData.doc[0].data.events.forEach(event => {
    if (event.name === 'Suspension') {
        let minutesString = event.minutes.toString();
        switch (minutesString) {
            case '2':
                event.team === 'home' ? penalty.home2++ : penalty.away2++;
                break;
            case '5':
                event.team === 'home' ? penalty.home5++ : penalty.away5++;
                break;
            case '4':
                event.team === 'home' ? penalty.home4++ : penalty.away4++;
                break;
            case '25':
                event.team === 'home' ? penalty.home25++ : penalty.away25++;
                break;
            case '20':
                event.team === 'home' ? penalty.home25++ : penalty.away25++;
                break;
            case '10':
                event.team === 'home' ? penalty.home10++ : penalty.away10++;
                break;
            default:
                // Počítá všechny 'Suspension' události bez ohledu na hodnotu minut
                event.team === 'home' ? penalty.homeTotal++ : penalty.awayTotal++;
                break;
        }
    }
});


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
            <tr><td>2-min Penalty:</td><td id="penalty2_home">${penalty.home2 + penalty.home4*2}</td><td id="penalty2_away">${penalty.away2 + penalty.away4*2}</td></tr>
            <tr><td>Major Penalty:</td><td id="penalty_major_home">${penalty.home5 + penalty.home25 + penalty.home10}</td><td id="penalty_major_away">${penalty.away5 + penalty.away25 + penalty.away10}</td></tr>
        `;
    document.body.appendChild(table);
})();