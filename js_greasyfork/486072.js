// ==UserScript==
// @name         Hokej Penalties Tabulka Norsko
// @namespace    http://tampermonkey.net/
// @version      11
// @description  Vytvoří tabulku s penalties
// @author       Michal
// @match        https://www.hockey.no/live/Live/Gamesheet/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486072/Hokej%20Penalties%20Tabulka%20Norsko.user.js
// @updateURL https://update.greasyfork.org/scripts/486072/Hokej%20Penalties%20Tabulka%20Norsko.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function() {
        const homeTeamPenalties = Array.from(document.querySelectorAll('[data-bind="template: {name: \'team-summary-template\', data: HomeTeam}"] [data-bind="text: PenaltyLength"]'));
        const awayTeamPenalties = Array.from(document.querySelectorAll('[data-bind="template: {name: \'team-summary-template\', data: AwayTeam}"] [data-bind="text: PenaltyLength"]'));

        const homeTeamPenaltyCount = countOccurrences(homeTeamPenalties);
        const awayTeamPenaltyCount = countOccurrences(awayTeamPenalties);

        const homeTeam2MinPenaltyCount = countOccurrencesOfValue(homeTeamPenalties, 2);
        const awayTeam2MinPenaltyCount = countOccurrencesOfValue(awayTeamPenalties, 2);

        const homeTeamMajorPenaltyCount = countOccurrencesOfValueExcept(homeTeamPenalties, 2);
        const awayTeamMajorPenaltyCount = countOccurrencesOfValueExcept(awayTeamPenalties, 2);

        createTable(homeTeamPenaltyCount, awayTeamPenaltyCount, homeTeam2MinPenaltyCount, awayTeam2MinPenaltyCount, homeTeamMajorPenaltyCount, awayTeamMajorPenaltyCount);
    }, 3000);

    function countOccurrences(penaltyElements) {
        let penaltyCount = 0;
        penaltyElements.forEach(element => {
            const penaltyLength = parseInt(element.textContent.trim());
            if (!isNaN(penaltyLength)) {
                penaltyCount += 1;
            }
        });
        return penaltyCount;
    }

    function countOccurrencesOfValue(penaltyElements, value) {
        let count = 0;
        penaltyElements.forEach(element => {
            const penaltyLength = parseInt(element.textContent.trim());
            if (!isNaN(penaltyLength) && penaltyLength === value) {
                count += 1;
            }
        });
        return count;
    }

    function countOccurrencesOfValueExcept(penaltyElements, value) {
        let count = 0;
        penaltyElements.forEach(element => {
            const penaltyLength = parseInt(element.textContent.trim());
            if (!isNaN(penaltyLength) && penaltyLength !== value) {
                count += 1;
            }
        });
        return count;
    }

    function createTable(homeTeamPenaltyCount, awayTeamPenaltyCount, homeTeam2MinPenaltyCount, awayTeam2MinPenaltyCount, homeTeamMajorPenaltyCount, awayTeamMajorPenaltyCount) {
        const table = document.createElement('table');
        table.className = 'custom-table';
        table.style.position = 'fixed';
        table.style.top = '60px';
        table.style.left = '30px';
        table.style.borderCollapse = 'collapse';
        table.style.border = '3px solid black';
        table.style.backgroundColor = 'white';
        table.style.fontSize = '16px';
        table.style.verticalAlign = 'middle';
        table.style.zIndex = '999';

        const homeTeamRow = table.insertRow();
        const homeTeamCell = homeTeamRow.insertCell();
        homeTeamCell.style.border = '1px solid black';
        homeTeamCell.style.padding = '8px';
        homeTeamCell.style.textAlign = 'center';
        homeTeamCell.innerText = 'Home Penalties:';
        const homeCell = homeTeamRow.insertCell();
        homeCell.style.border = '1px solid black';
        homeCell.style.padding = '8px';
        homeCell.style.textAlign = 'center';
        homeCell.innerText = `${homeTeamPenaltyCount}`;

        const home2MinRow = table.insertRow();
        const home2MinCell = home2MinRow.insertCell();
        home2MinCell.style.border = '1px solid black';
        home2MinCell.style.padding = '8px';
        home2MinCell.style.textAlign = 'center';
        home2MinCell.innerText = 'Home 2-Min Penalty';
        const home2MinCountCell = home2MinRow.insertCell();
        home2MinCountCell.style.border = '1px solid black';
        home2MinCountCell.style.padding = '8px';
        home2MinCountCell.style.textAlign = 'center';
        home2MinCountCell.innerText = `${homeTeam2MinPenaltyCount}`;

        const homeMajorRow = table.insertRow();
        const homeMajorCell = homeMajorRow.insertCell();
        homeMajorCell.style.border = '1px solid black';
        homeMajorCell.style.padding = '8px';
        homeMajorCell.style.textAlign = 'center';
        homeMajorCell.innerText = 'Home Major Penalty';
        const homeMajorCountCell = homeMajorRow.insertCell();
        homeMajorCountCell.style.border = '1px solid black';
        homeMajorCountCell.style.padding = '8px';
        homeMajorCountCell.style.textAlign = 'center';
        homeMajorCountCell.innerText = `${homeTeamMajorPenaltyCount}`;

        const awayTeamRow = table.insertRow();
        const awayTeamCell = awayTeamRow.insertCell();
        awayTeamCell.style.border = '1px solid black';
        awayTeamCell.style.padding = '8px';
        awayTeamCell.style.textAlign = 'center';
        awayTeamCell.innerText = 'Away Penalties';
        const awayCell = awayTeamRow.insertCell();
        awayCell.style.border = '1px solid black';
        awayCell.style.padding = '8px';
        awayCell.style.textAlign = 'center';
        awayCell.innerText = `${awayTeamPenaltyCount}`;

        const away2MinRow = table.insertRow();
        const away2MinCell = away2MinRow.insertCell();
        away2MinCell.style.border = '1px solid black';
        away2MinCell.style.padding = '8px';
        away2MinCell.style.textAlign = 'center';
        away2MinCell.innerText = 'Away 2-Min Penalty';
        const away2MinCountCell = away2MinRow.insertCell();
        away2MinCountCell.style.border = '1px solid black';
        away2MinCountCell.style.padding = '8px';
        away2MinCountCell.style.textAlign = 'center';
        away2MinCountCell.innerText = `${awayTeam2MinPenaltyCount}`;

        const awayMajorRow = table.insertRow();
        const awayMajorCell = awayMajorRow.insertCell();
        awayMajorCell.style.border = '1px solid black';
        awayMajorCell.style.padding = '8px';
        awayMajorCell.style.textAlign = 'center';
        awayMajorCell.innerText = 'Away Major Penalty';
        const awayMajorCountCell = awayMajorRow.insertCell();
        awayMajorCountCell.style.border = '1px solid black';
        awayMajorCountCell.style.padding = '8px';
        awayMajorCountCell.style.textAlign = 'center';
        awayMajorCountCell.innerText = `${awayTeamMajorPenaltyCount}`;

        document.body.appendChild(table);
    }
})();