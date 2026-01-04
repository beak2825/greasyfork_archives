// ==UserScript==
// @name         Widget - Sportradar
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Vygeneruje tabulku ve zdrojáku sportradaru
// @author       Michal
// @match        https://widgets.fn.sportradar.com/demolmt/en/Etc:UTC/gismo/match_info/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488672/Widget%20-%20Sportradar.user.js
// @updateURL https://update.greasyfork.org/scripts/488672/Widget%20-%20Sportradar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const preTag = document.body.querySelector("pre");
    const matchDataText = preTag.textContent || preTag.innerText;
    const matchData = JSON.parse(matchDataText);

    const homeScore = matchData.doc[0].data.match.result.home;
    const awayScore = matchData.doc[0].data.match.result.away;

    const regexHomeSet1 = /"p1":{"home":(\d+),"away":\d+/;
    const matchHomeSet1 = regexHomeSet1.exec(matchDataText);
    const homeSet1 = matchHomeSet1 ? matchHomeSet1[1] : 'N/A';

    const regexAwaySet1 = /"p1":{"home":\d+,"away":(\d+)/;
    const matchAwaySet1 = regexAwaySet1.exec(matchDataText);
    const awaySet1 = matchAwaySet1 ? matchAwaySet1[1] : 'N/A';

    const regexHomeSet2 = /"p2":{"home":(\d+),"away":\d+/;
    const matchHomeSet2 = regexHomeSet2.exec(matchDataText);
    const homeSet2 = matchHomeSet2 ? matchHomeSet2[1] : 'N/A';

    const regexAwaySet2 = /"p2":{"home":\d+,"away":(\d+)/;
    const matchAwaySet2 = regexAwaySet2.exec(matchDataText);
    const awaySet2 = matchAwaySet2 ? matchAwaySet2[1] : 'N/A';

    const regexHomeSet3 = /"p3":{"home":(\d+),"away":\d+/;
    const matchHomeSet3 = regexHomeSet3.exec(matchDataText);
    const homeSet3 = matchHomeSet3 ? matchHomeSet3[1] : 'N/A';

    const regexAwaySet3 = /"p3":{"home":\d+,"away":(\d+)/;
    const matchAwaySet3 = regexAwaySet3.exec(matchDataText);
    const awaySet3 = matchAwaySet3 ? matchAwaySet3[1] : 'N/A';

    const regexHomeSet4 = /"p4":{"home":(\d+),"away":\d+/;
    const matchHomeSet4 = regexHomeSet4.exec(matchDataText);
    const homeSet4 = matchHomeSet4 ? matchHomeSet4[1] : 'N/A';

    const regexAwaySet4 = /"p4":{"home":\d+,"away":(\d+)/;
    const matchAwaySet4 = regexAwaySet4.exec(matchDataText);
    const awaySet4 = matchAwaySet4 ? matchAwaySet4[1] : 'N/A';

    const regexHomeSet5 = /"p5":{"home":(\d+),"away":\d+/;
    const matchHomeSet5 = regexHomeSet5.exec(matchDataText);
    const homeSet5 = matchHomeSet5 ? matchHomeSet5[1] : 'N/A';

    const regexAwaySet5 = /"p5":{"home":\d+,"away":(\d+)/;
    const matchAwaySet5 = regexAwaySet5.exec(matchDataText);
    const awaySet5 = matchAwaySet5 ? matchAwaySet5[1] : 'N/A';

    const regex = /"name":"([^"]+)",\s*"value":"([^"]+)"/g;
    let match;
    let additionalData = {};
    while (match = regex.exec(matchDataText)) {
        additionalData[match[1]] = match[2];
    }

    let style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
            .custom-table {
                position: fixed;
                top: 60px;
                left: 30px;
                border-collapse: collapse;
                border: 3px solid black;
                background-color: white;
                font-size: 20px;
                vertical-align: middle;
                z-index: 9999999;
                max-width: calc(100% - 60px);
                overflow-x: auto;
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

    let table = document.createElement('table');
    table.className = 'custom-table';

    let tableHTML = `
            <tr><th id="home-score">Home score:</th><td id="home-score-value">${homeScore}</td></tr>
            <tr><th id="away-score">Away score:</th><td id="away-score-value">${awayScore}</td></tr>
            <tr><th id="home-set-1">Home set 1:</th><td id="home-set-1-value">${homeSet1}</td></tr>
            <tr><th id="away-set-1">Away set 1:</th><td id="away-set-1-value">${awaySet1}</td></tr>
            <tr><th id="home-set-2">Home set 2:</th><td id="home-set-2-value">${homeSet2}</td></tr>
            <tr><th id="away-set-2">Away set 2:</th><td id="away-set-2-value">${awaySet2}</td></tr>
            <tr><th id="home-set-3">Home set 3:</th><td id="home-set-3-value">${homeSet3}</td></tr>
            <tr><th id="away-set-3">Away set 3:</th><td id="away-set-3-value">${awaySet3}</td></tr>
            <tr><th id="home-set-4">Home set 4:</th><td id="home-set-4-value">${homeSet4}</td></tr>
            <tr><th id="away-set-4">Away set 4:</th><td id="away-set-4-value">${awaySet4}</td></tr>
            <tr><th id="home-set-5">Home set 5:</th><td id="home-set-5-value">${homeSet5}</td></tr>
            <tr><th id="away-set-5">Away set 5:</th><td id="away-set-5-value">${awaySet5}</td></tr>
        `;

    for (const key in additionalData) {
        const idName = key.toLowerCase().replace(/\s+/g, '-');
        tableHTML += `<tr><th id="${idName}">${key}:</th><td id="${idName}-value">${additionalData[key]}</td></tr>`;
    }

    table.innerHTML = tableHTML;
    document.body.appendChild(table);
})();