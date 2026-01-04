// ==UserScript==
// @name         Sportradar FetchingScript
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Volá JSON soubor s daty.
// @author       Martin Kaprál
// @match        https://widgets.sir.sportradar.com/live-match-tracker*
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/488698/Sportradar%20FetchingScript.user.js
// @updateURL https://update.greasyfork.org/scripts/488698/Sportradar%20FetchingScript.meta.js
// ==/UserScript==

setInterval(function() {
    'use strict';
    const link = window.location.href;
    const matchId = link.match(/matchId\S([0-9]+)/)[1];
    const sportId = link.match(/sportId\S([0-9]+)/)[1];
    if (sportId == "20" || "23" || "5" || "34" || "31") {
    const fetchData = async () => {
        const url = 'https://widgets.fn.sportradar.com/demolmt/en/Etc:UTC/gismo/match_info/' + matchId;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const matchData = await response.json();
            console.log(matchData);

            const homeScore = matchData.doc[0].data.match.result.home;
            const awayScore = matchData.doc[0].data.match.result.away;
            const homeSet1 = matchData.doc[0].data.match.periods?.p1?.home || "N/A";
            const awaySet1 = matchData.doc[0].data.match.periods?.p1?.away || "N/A";
            const homeSet2 = matchData.doc[0].data.match.periods?.p2?.home || "N/A";
            const awaySet2 = matchData.doc[0].data.match.periods?.p2?.away || "N/A";
            const homeSet3 = matchData.doc[0].data.match.periods?.p3?.home || "N/A";
            const awaySet3 = matchData.doc[0].data.match.periods?.p3?.away || "N/A";
            const homeSet4 = matchData.doc[0].data.match.periods?.p4?.home || "N/A";
            const awaySet4 = matchData.doc[0].data.match.periods?.p4?.away || "N/A";
            const homeSet5 = matchData.doc[0].data.match.periods?.p5?.home || "N/A";
            const awaySet5 = matchData.doc[0].data.match.periods?.p5?.away || "N/A";
            const homeGamescore = matchData.doc[0].data.match.gamescore?.home || "N/A";
            const awayGamescore = matchData.doc[0].data.match.gamescore?.away || "N/A";

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
                z-index: 999;
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
            <tr><th id="home-gamescore">Tennis Home Score:</th><td id="home-gamescore">${homeGamescore}</td></tr>
            <tr><th id="away-gamescore">Tennis Away Score:</th><td id="away-gamescore">${awayGamescore}</td></tr>
        `;
            table.innerHTML = tableHTML;
    document.body.appendChild(table);

        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    fetchData();
    }

},5000)();
