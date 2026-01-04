// ==UserScript==
// @name         BSP FF Value Displayer & Offline Indicator
// @namespace    bsp.ff.displayer
// @version      2.5
// @description  Displays FF value and highlights offline users 
// @author       aquagloop
// @match        https://www.torn.com/war.php*
// @match        https://www.torn.com/factions.php*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543905/BSP%20FF%20Value%20Displayer%20%20Offline%20Indicator.user.js
// @updateURL https://update.greasyfork.org/scripts/543905/BSP%20FF%20Value%20Displayer%20%20Offline%20Indicator.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const StorageKey = {
        PlayerBattleStats: 'tdup.battleStatsPredictor.playerBattleStats',
        PlayerId: 'tdup.battleStatsPredictor.PlayerId',
        BSPPrediction: 'tdup.battleStatsPredictor.cache.prediction.',
        TornStatsSpy: 'tdup.battleStatsPredictor.cache.spy_v2.tornstats_',
        YataSpy: 'tdup.battleStatsPredictor.cache.spy_v2.yata_',
    };

    function getUsersScore() {
        const userDataJSON = localStorage.getItem(StorageKey.PlayerBattleStats);
        if (!userDataJSON) return null;
        try {
            const userData = JSON.parse(userDataJSON);
            return userData.Score > 0 ? userData.Score : null;
        } catch (e) { return null; }
    }

    function getTargetScore(playerId) {
        const calculateScore = (stats) => {
            if (!stats || !stats.str || !stats.def || !stats.spd || !stats.dex) return 0;
            return Math.sqrt(stats.str) + Math.sqrt(stats.def) + Math.sqrt(stats.spd) + Math.sqrt(stats.dex);
        };
        const tsSpyJSON = localStorage.getItem(StorageKey.TornStatsSpy + playerId);
        const yataSpyJSON = localStorage.getItem(StorageKey.YataSpy + playerId);
        let bestSpy = null;
        try {
            const tsSpy = tsSpyJSON ? JSON.parse(tsSpyJSON) : null;
            const yataSpy = yataSpyJSON ? JSON.parse(yataSpyJSON) : null;
            if (tsSpy && yataSpy) bestSpy = tsSpy.timestamp >= yataSpy.timestamp ? tsSpy : yataSpy;
            else bestSpy = tsSpy || yataSpy;
            if (bestSpy) {
                const score = calculateScore(bestSpy);
                if (score > 0) return score;
            }
        } catch (e) {}
        const predictionJSON = localStorage.getItem(StorageKey.BSPPrediction + playerId);
        if (!predictionJSON) return null;
        try {
            const predictionData = JSON.parse(predictionJSON);
            return predictionData.Score || null;
        } catch (e) { return null; }
    }

    function calculateFF(userScore, targetScore) {
        if (!userScore || !targetScore) return null;
        const ff = Math.min(3, 1 + (8 / 3) * (targetScore / userScore));
        return Math.max(1, ff).toFixed(2);
    }

    function injectFFValue(element, ffValue) {
        const parentLi = element.closest('li');
        if (!parentLi || parentLi.querySelector('.bsp-ff-display-box')) return;
        parentLi.style.position = 'relative';
        const ffSpan = document.createElement('span');
        ffSpan.className = 'bsp-ff-display-box';
        ffSpan.style.position = 'absolute';
        ffSpan.style.left = '5px';
        ffSpan.style.top = '50%';
        ffSpan.style.transform = 'translateY(-50%)';
        ffSpan.style.fontSize = '11px';
        ffSpan.style.fontWeight = 'bold';
        ffSpan.style.padding = '2px 4px';
        ffSpan.style.borderRadius = '3px';
        ffSpan.style.backgroundColor = '#e8e8e8';
        ffSpan.style.border = '1px solid #aaa';
        ffSpan.style.zIndex = '10';
        ffSpan.style.whiteSpace = 'nowrap';
        if (ffValue) {
            ffSpan.textContent = `FF: ${ffValue}`;
            if (ffValue > 2.5) {
                ffSpan.style.color = '#28a745';
                ffSpan.style.borderColor = '#28a745';
            } else if (ffValue > 2) {
                ffSpan.style.color = '#fd7e14';
                ffSpan.style.borderColor = '#fd7e14';
            } else {
                ffSpan.style.color = '#dc3545';
                ffSpan.style.borderColor = '#dc3545';
            }
        } else {
            ffSpan.textContent = `FF: N/A`;
            ffSpan.style.color = "#777";
        }
        parentLi.appendChild(ffSpan);
    }

    function processAllLinks() {
        const userScore = getUsersScore();
        const selfId = localStorage.getItem(StorageKey.PlayerId);
        if (!userScore) return;

        const isFactionPage = location.href.includes('/factions.php');

        const container = isFactionPage
            ? document.querySelector('#faction_war_list_id > li.descriptions > div > div.faction-war.membersWrap___NbYLx')
            : document;

        if (!container) return;

        container.querySelectorAll('a[href*="profiles.php?XID="]').forEach(linkElement => {
            if (linkElement.closest('#chatRoot, #sidebar')) return;

            const parentLi = linkElement.closest('li');
            if (!parentLi) return;

            const isOffline = parentLi.querySelector('svg[fill*="offline"]');
            parentLi.style.backgroundColor = isOffline ? 'rgba(40, 167, 69, 0.2)' : '';

            if (parentLi.querySelector('.bsp-ff-display-box')) return;
            const href = linkElement.getAttribute('href');
            const match = href.match(/XID=(\d+)/);
            if (!match) return;

            const playerId = match[1];
            if (playerId === selfId) return;

            const targetScore = getTargetScore(playerId);
            const ffValue = calculateFF(userScore, targetScore);
            injectFFValue(linkElement, ffValue);
        });
    }

    function startObserver() {
        const isFactionPage = location.href.includes('/factions.php');

        const targetNode = isFactionPage
            ? document.querySelector('#faction_war_list_id > li.descriptions > div > div.faction-war.membersWrap___NbYLx')
            : document.getElementById('mainContainer');

        if (!targetNode) return;

        const observer = new MutationObserver(() => {
            setTimeout(processAllLinks, 500);
        });

        observer.observe(targetNode, { childList: true, subtree: true });
    }

    setTimeout(() => {
        processAllLinks();
        startObserver();
    }, 1000);
})();
