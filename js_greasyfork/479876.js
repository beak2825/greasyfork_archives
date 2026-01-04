// ==UserScript==
// @name         SleeperTables
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Replaces matchups and standings with more compact tables
// @author       nabraham
// @match        https://sleeper.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sleeper.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479876/SleeperTables.user.js
// @updateURL https://update.greasyfork.org/scripts/479876/SleeperTables.meta.js
// ==/UserScript==

var initialized = false;

function genTableRow(items) {
    return items.map(item => `<td><div class="st-table-item">${item}</div></td>`).join('');
}

function parseStandingRow(row) {
    let wl = row.getElementsByClassName('description')[0].innerHTML.split('-');
    let wins = wl[0];
    let losses = wl[1];
    let rank = row.getElementsByClassName('rank')[0].innerHTML;
    let name = row.getElementsByClassName('name')[0].innerHTML;
    let owner = row.getElementsByClassName('team-name')[0]?.innerHTML ?? '?';
    let avatar = row.getElementsByClassName('avatar-container')[0]?.innerHTML ?? '';
    let values = Array.from(row.getElementsByClassName('value')).map(x => x.innerHTML);
    let pf = values[1];
    let pa = values[3];
    let waiver = values[5];

    return genTableRow([rank, avatar, name, wins, losses, pf, pa, waiver]);
}

function parseMatchupRow(row) {
    let scores = Array.from(row.getElementsByClassName('score')).map(x => x.innerHTML);
    let avatars = Array.from(row.getElementsByClassName('avatar-container')).map(x => x.innerHTML);
    let teams = Array.from(row.getElementsByClassName('team-name')).map(x => x.innerHTML);
    let projections = Array.from(row.getElementsByClassName('projections')).map(x => x.innerHTML);
    let pcts = Array.from(row.getElementsByClassName('win-percentage-number')).map(x => x.innerHTML);
    let awayWinner = parseFloat(projections[0]) > parseFloat(projections[1]);

    return genTableRow([
        `<div class="${awayWinner ? 'st-winner' : ''}">${scores[0]} (${projections[0]})</div>`,
        pcts[0],
        avatars[0],
        teams[0],
        teams[1],
        avatars[1],
        pcts[1],
        `<div class="${!awayWinner ? 'st-winner' : ''}">${scores[1]} (${projections[1]})</div>`
    ]);
}

function genTableHeader(items, clazz='') {
    return `<table class="st-table ${clazz}">` +
        '<tbody><tr class="team-name">' +
        items.map(item => `<th>${item}</th>`).join('') +
        '</tr>';
}

function genTableBottom() {
    return '</tbody></table>';
}

function genDataRows(rows, parser) {
    return Array.from(rows).map(r => `<tr class="name">${parser(r)}</tr>`).join('');
}

function prettyStandings() {
    console.log('[SleeperTables]  - pretty standings');
    var leagueStandingList = document.getElementsByClassName('league-standing-list')[0];
    if (!leagueStandingList) {
        return;
    }
    var standingRows = document.getElementsByClassName('league-standing-item');

    var tableTop = genTableHeader(['Place', '', 'Team', 'Wins', 'Losses', 'PF', 'PA', 'Waiver']);
    var tableBottom = genTableBottom();
    var tableMid = genDataRows(standingRows, parseStandingRow);

    let table = [tableTop, tableMid, tableBottom].join('');
    leagueStandingList.innerHTML = table;
}

function prettyMatchups() {
    console.log('[SleeperTables]  - pretty matchups');
    var leagueMatchupsList = document.getElementsByClassName('league-matchups')[1];
    if (!leagueMatchupsList) {
        return;
    }
    var matchupRows = document.getElementsByClassName('league-matchup-row-item');

    var tableTop = genTableHeader(['Pts (Proj)', '', '', '', '', '', '', 'Pts (Proj)'], 'st-margin-25');
    var tableBottom = genTableBottom();
    var tableMid = genDataRows(matchupRows, parseMatchupRow);

    let table = [tableTop, tableMid, tableBottom].join('');
    leagueMatchupsList.innerHTML = table;
}

function insertStyles() {
    var styles = `
    .st-winner {
        font-weight: bold;
        color: rgb(69, 230, 167);
    }
    .st-table-item {
        padding-top: 9px;
    }
    tr:nth-child(odd) {
       background-color: #1f324aef
    }
    .st-margin-25 {
        margin: 25px;
    }
`;
    var styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
}

function pretty() {
    if (!initialized) {
        insertStyles();
        initialized = true;
    }

    console.log('[SleeperTables] prettying up sleeper');
    if (!document.getElementsByClassName('st-table')?.length) {
        prettyStandings();
        prettyMatchups();
    }
}

(function() {
    'use strict';
    setTimeout(pretty, 2000);
    document.onmouseup = () => {
        setTimeout(pretty, 1000);
    };
})();