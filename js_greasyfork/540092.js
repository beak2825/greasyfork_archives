// ==UserScript==
// @name         Tlačítko IHF
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Přidá tlačítko
// @author       JV
// @match        https://www.ihf.info/competitions/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540092/Tla%C4%8D%C3%ADtko%20IHF.user.js
// @updateURL https://update.greasyfork.org/scripts/540092/Tla%C4%8D%C3%ADtko%20IHF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function() {
        const matches = document.querySelectorAll('[data-ihf-competitions-match-id]');

        matches.forEach((match) => {
            const matchID = match.getAttribute('data-ihf-competitions-match-id');
            const aTag = match.querySelector('a[href*="/competitions/"]');
            if (!aTag) return;

            const href = aTag.getAttribute('href');
            const parts = href.split('/');

            if (parts.length < 7) return;

            const category = parts[2];
            const competitionID = parts[3];
            const competitionName = parts[4];
            const tournamentID = parts[5];

            const liveLink = `https://www.ihf.info/competitions/${category}/${competitionID}/${competitionName}/${tournamentID}/match-center/${matchID}`;

            const button = document.createElement('a');
            button.textContent = 'Live URL';
            button.href = liveLink;
            button.target = '_blank';

            button.style.display = 'inline-flex';
            button.style.alignItems = 'center';
            button.style.justifyContent = 'center';
            button.style.marginLeft = '12px';
            button.style.padding = '8px 20px';
            button.style.backgroundColor = '#ffcc00';
            button.style.color = '#000';
            button.style.textDecoration = 'none';
            button.style.border = '1px solid #bfa100';
            button.style.borderRadius = '6px';
            button.style.fontSize = '20px';
            button.style.height = '28px';
            button.style.lineHeight = '1.2';
            button.style.fontWeight = 'bold';
            button.style.cursor = 'pointer';

            const timeBlock = match.querySelector(`#ihf-competitions-match-time-${matchID}`);
            if (timeBlock) {
                const span = timeBlock.querySelector('span');
                if (span) {
                    span.appendChild(button);
                } else {
                    timeBlock.appendChild(button);
                }
            } else {
                match.appendChild(button);
            }
        });
    }, 3000);
})();