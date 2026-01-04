// ==UserScript==
// @name         Sploop IO KDR
// @namespace    lore
// @version      beta - v1
// @description  Adds KDR to the profile stats
// @author       lore
// @license      MIT
// @match        *://*sploop.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497949/Sploop%20IO%20KDR.user.js
// @updateURL https://update.greasyfork.org/scripts/497949/Sploop%20IO%20KDR.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function calculateKDR() {
        const totalKillsElement = document.getElementById('total-kill');
        const totalDeathsElement = document.getElementById('total-death');
        const kdrElement = document.getElementById('kdrr');

        if (totalKillsElement && totalDeathsElement && kdrElement) {
            const totalKills = parseInt(totalKillsElement.textContent, 10);
            const totalDeaths = parseInt(totalDeathsElement.textContent, 10);

            if (!isNaN(totalKills) && !isNaN(totalDeaths)) {
                const kdr = totalDeaths === 0 ? totalKills : (totalKills / totalDeaths).toFixed(2);
                kdrElement.textContent = kdr;
            }
        }
    }

    function addKDRElement() {
        const bestKillElement = document.querySelector('div > div.text-shadowed-3.profile-score[id="best-kill"]').parentElement;

        if (bestKillElement) {
            const kdrElement = document.createElement('div');
            kdrElement.innerHTML = `
                <div class="text-shadowed-3 profile-score">KDR</div>
                <div class="text-shadowed-3 profile-score yellow-text" id="kdrr">0</div>
            `;

            bestKillElement.parentNode.insertBefore(kdrElement, bestKillElement.nextSibling);
            setInterval(calculateKDR, 500);
        }
    }

    function checkAndAddKDRElement() {
        const bestKillElement = document.querySelector('div > div.text-shadowed-3.profile-score[id="best-kill"]');
        if (bestKillElement) {
            addKDRElement();
            observer.disconnect();
        }
    }

    const observer = new MutationObserver(checkAndAddKDRElement);
    observer.observe(document.body, { childList: true, subtree: true });
    checkAndAddKDRElement();
})();
