// ==UserScript==
// @name         Serie A - Statistiky
// @namespace    http://tampermonkey.net/
// @version      1.1
// @author       Michal
// @description  Tlačítko na proklik do statistik
// @match        https://www.legaseriea.it/en/serie-a
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482051/Serie%20A%20-%20Statistiky.user.js
// @updateURL https://update.greasyfork.org/scripts/482051/Serie%20A%20-%20Statistiky.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createButton(link) {
        const button = document.createElement('a');
        button.href = link + '/statistiche';
        button.innerText = 'Statistiky';
        button.className = 'statistics-button';

        button.style.display = 'inline-block';
        button.style.backgroundColor = '#2047e3';
        button.style.color = '#ffffff';
        button.style.padding = '8px 16px';
        button.style.textAlign = 'center';
        button.style.textDecoration = 'none';
        button.style.borderRadius = '4px';
        button.style.border = 'none';

        return button;
    }

    function addButtonToMatchRow(row) {
        const matchDetails = row.querySelector('.hm-button-icon');
        if (matchDetails) {
            const link = matchDetails.getAttribute('href');
            const statisticsButton = createButton(link);
            row.appendChild(statisticsButton);
        }
    }

    function addStatisticsButtons() {
        const scheduleRows = document.querySelectorAll('.hm-row-schedule');
        if (scheduleRows) {
            scheduleRows.forEach(addButtonToMatchRow);
        }
    }

    setTimeout(addStatisticsButtons, 3000);
})();
