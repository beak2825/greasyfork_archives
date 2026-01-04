// ==UserScript==
// @name         Tlačítko IHF
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Přidá tlačítko
// @author       Michal
// @match        https://www.ihf.info/competitions/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481145/Tla%C4%8D%C3%ADtko%20IHF.user.js
// @updateURL https://update.greasyfork.org/scripts/481145/Tla%C4%8D%C3%ADtko%20IHF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function() {
        function getMatchID(matchElement) {
            return matchElement.getAttribute('data-ihf-competitions-match-id');
        }

        function getCompetitionInfo() {
            const competitionPath = window.location.pathname;
            const competitionInfo = competitionPath.match(/\/(women|men|youth-women|junior-women|youth-men)\/(\d+)\/([^/]+\/\d+)\//);
            return competitionInfo ? {
                category: competitionInfo[1],
                competitionID: competitionInfo[2],
                competitionName: competitionInfo[3],
            } : null;
        }

        function createLiveLink(matchID, category, competitionID, competitionName) {
            return `https://www.ihf.info/competitions/${category}/${competitionID}/${competitionName}/match-center/${matchID}`;
        }

        const matches = document.querySelectorAll('[data-ihf-competitions-match-id]');

        matches.forEach((match) => {
            const matchID = getMatchID(match);
            const competitionInfo = getCompetitionInfo();
            if (!competitionInfo) return; // Exit if competition info not found

            const { category, competitionID, competitionName } = competitionInfo;
            const liveLink = createLiveLink(matchID, category, competitionID, competitionName);

            const matchTime = match.querySelector('.matchTime');

            const button = document.createElement('a');
            button.textContent = 'Live URL';
            button.href = liveLink;
            button.setAttribute('target', '_blank');
            button.style.display = 'inline-block';
            button.style.textAlign = 'center';
            button.style.padding = '10px 20px';
            button.style.backgroundColor = '#3498db';
            button.style.color = '#fff';
            button.style.textDecoration = 'none';
            button.style.border = '2px solid #3498db';
            button.style.borderRadius = '5px';
            button.style.fontWeight = 'bold';
            button.style.fontSize = '16px';

            if (matchTime) {
                matchTime.parentNode.insertBefore(button, matchTime);
            }
        });
    }, 3000);
})();
