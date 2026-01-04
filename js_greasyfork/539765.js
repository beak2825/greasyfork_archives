// ==UserScript==
// @name         Torn War Auto-Win Timer (Pure Hour Final Version)
// @namespace    KillerCleat[2842410]
// @version      5.3
// @description  Fully accurate Torn ranked war end time estimation using exact hourly drops (with flooring and pre-24h display)
// @author       KillerCleat [2842410]
// @match        https://www.torn.com/factions.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539765/Torn%20War%20Auto-Win%20Timer%20%28Pure%20Hour%20Final%20Version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539765/Torn%20War%20Auto-Win%20Timer%20%28Pure%20Hour%20Final%20Version%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const WIKI_URL = 'https://wiki.torn.com/wiki/Ranked_War';

    const checkInterval = setInterval(() => {
        const warBox = document.querySelector('.rankBox___OzP3D');
        const timerSpans = document.querySelectorAll('.timer___fSGg8 span');
        const targetBox = document.querySelector('.target___NBVXq');
        const timerBox = document.querySelector('.timer___fSGg8');

        if (warBox && timerSpans.length >= 8 && targetBox && timerBox) {
            clearInterval(checkInterval);

            const timeParts = Array.from(timerSpans).map(span => span.textContent).join('').split(':');
            const days = parseInt(timeParts[0]);
            const hours = parseInt(timeParts[1]);
            const minutes = parseInt(timeParts[2]);
            const totalElapsedHours = (days * 24) + hours + (minutes / 60);

            const display = document.createElement('div');
            display.style.marginTop = '5px';
            display.style.fontWeight = 'bold';
            display.style.color = 'black';
            display.style.cursor = 'pointer';
            display.title = 'Click to view Torn Ranked War Wiki';
            display.onclick = () => window.open(WIKI_URL, '_blank');
            timerBox.parentElement.appendChild(display);

            if (totalElapsedHours <= 24) {
                display.textContent = `🕓 Waiting for 24h mark to begin calculations...`;
                return;
            }

            const dropHours = Math.floor(totalElapsedHours - 24);
            const [leadStr, targetStr] = targetBox.innerText.match(/(\d[\d,]*)\s*\/\s*(\d[\d,]*)/).slice(1, 3);
            const lead = parseInt(leadStr.replace(/,/g, ''));
            const currentTarget = parseInt(targetStr.replace(/,/g, ''));

            const originalTarget = currentTarget / (1 - (dropHours * 0.01));
            const DROP_PER_HOUR = originalTarget * 0.01;
            const gap = currentTarget - lead;

            const hoursRemaining = Math.floor(gap / DROP_PER_HOUR);
            display.textContent = `🕓 Current State Remaining: ${hoursRemaining}H`;
        }
    }, 1000);
})();
