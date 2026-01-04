// ==UserScript==
// @name         Aba + Aba 2
// @version      1.1
// @namespace    http://tampermonkey.net/
// @description  Generuje tlačítka pro přechod na live URL zápasů na stránce kalendáře
// @match        https://druga.aba-liga.com/calendar/*
// @match        https://www.aba-liga.com/calendar/*
// @author       Michal
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482994/Aba%20%2B%20Aba%202.user.js
// @updateURL https://update.greasyfork.org/scripts/482994/Aba%20%2B%20Aba%202.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const calendarPage = window.location.href.includes('druga') ? 'druga' : 'aba';

    const hiddenXSElements = document.querySelectorAll('.hidden-xs');

    hiddenXSElements.forEach(hiddenXSElement => {
        const matchLinks = hiddenXSElement.querySelectorAll('a[href*="/match/"], a[href*="/match-live/"]');

        matchLinks.forEach(link => {
            const href = link.getAttribute('href');
            const parts = href.split('/');

            const leagueId = parts[4];
            const date = parts[5];
            const round = parts[6];

            const homeTeam = parts[8].replace(/-/g, ' ');
            const awayTeam = parts[9].replace(/-/g, ' ');

            const liveURL = `https://www.${calendarPage}-liga.com/match/${leagueId}/${date}/${round}/Teamcomp/q1/1/home/${homeTeam}-${awayTeam}/`;

            const button = document.createElement('a');
            button.textContent = `Live url`;
            button.style.margin = '3px';
            button.style.width = '70px';
            button.style.padding = '5px 8px';
            button.style.cursor = 'pointer';
            button.setAttribute('href', liveURL);

            const tdScoreTable = document.createElement('td');
            tdScoreTable.classList.add('scoretable');
            tdScoreTable.style.width = '1%';
            tdScoreTable.style.whiteSpace = 'nowrap';

            tdScoreTable.appendChild(button);

            const parentRow = hiddenXSElement.closest('tr');
            if (parentRow) {
                parentRow.insertBefore(tdScoreTable, hiddenXSElement.nextElementSibling);
            }
        });
    });
})();
