// ==UserScript==
// @name         HockeySlovakia
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Přidává tlačítka pro Score, Overview a Stats
// @author       Michal
// @match        https://www.hockeyslovakia.sk/sk/stats/results-date/1067/tipos-extraliga*
// @icon         https://www.hockeyslovakia.sk/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509164/HockeySlovakia.user.js
// @updateURL https://update.greasyfork.org/scripts/509164/HockeySlovakia.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addButtonsToMatches() {
        document.querySelectorAll('.fn-tap-row').forEach(function(row) {
            if (row.querySelector('a[href*="overview"]')) return;

            let predZap = row.querySelector('a[href*="/preview"]');

            if (predZap) {
                let href = predZap.getAttribute('href');

                let matchId = href.match(/match\/(\d+)\//)[1];

                let scoreLink = document.createElement('a');
                scoreLink.href = `https://www.hockeyslovakia.sk/sk/stats/matches/1067/tipos-extraliga/match/${matchId}/`;
                scoreLink.innerText = 'Score';
                scoreLink.style.marginRight = '10px';

                let overviewLink = document.createElement('a');
                overviewLink.href = `https://www.hockeyslovakia.sk/sk/stats/matches/1067/tipos-extraliga/match/${matchId}/overview`;
                overviewLink.innerText = 'Overview';
                overviewLink.style.marginRight = '10px';

                let statsLink = document.createElement('a');
                statsLink.href = `https://www.hockeyslovakia.sk/sk/stats/matches/1067/tipos-extraliga/match/${matchId}/Stats`;
                statsLink.innerText = 'Stats';
                statsLink.style.marginRight = '10px';

                let buttonCell = document.createElement('td');
                buttonCell.style.textAlign = 'center';

                buttonCell.appendChild(scoreLink);
                buttonCell.appendChild(overviewLink);
                buttonCell.appendChild(statsLink);

                row.appendChild(buttonCell);
            }
        });
    }

    function delayedAddButtons() {
        setTimeout(addButtonsToMatches, 3000);
    }

    delayedAddButtons();

    const observer = new MutationObserver(function(mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                delayedAddButtons();
            }
        }
    });

    const matchContainer = document.querySelector('table tbody');
    if (matchContainer) {
        observer.observe(matchContainer, { childList: true, subtree: true });
    }
})();