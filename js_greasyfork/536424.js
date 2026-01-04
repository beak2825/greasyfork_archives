// ==UserScript==
// @name         Torn Poker Helper - Hole Cards & Flop Tracker
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      2.5
// @description  Tracks your cards and flop cards in Torn poker game
// @author       SynthSlash
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536424/Torn%20Poker%20Helper%20-%20Hole%20Cards%20%20Flop%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/536424/Torn%20Poker%20Helper%20-%20Hole%20Cards%20%20Flop%20Tracker.meta.js
// ==/UserScript==



(function () {
    'use strict';

    let currentHoleCards = [];
    let hudEl = null;
    const tableSize = 9;

    function waitForLogContainer() {
        const logContainer = document.querySelector('div[class*="messagesWrap___"]');
        if (logContainer) {
            startAutoUpdater();
            createHUD();
        } else {
            setTimeout(waitForLogContainer, 1000);
        }
    }

    function startAutoUpdater() {
        setInterval(() => {
            const cards = getAllParsedCards();
            if (cards.length >= 2) {
                currentHoleCards = cards.slice(-2);
                updateHUD();
            }
        }, 1000);
    }

    function getAllParsedCards() {
        const cards = Array.from(document.querySelectorAll('div[class*="fourColors___"]'));
        return parseCardClasses(cards);
    }

    function getBoardCardsFromDOM() {
        const all = getAllParsedCards();
        const boardOnly = all.slice(0, all.length - 2);
        if (boardOnly.length > 5) return [];
        return boardOnly;
    }

    function parseCardClasses(cards) {
        return cards.map(card => {
            const classStr = card.className;
            const match = classStr.match(/(hearts|spades|clubs|diamonds)-([2-9]|10|[JQKA])(?:_|\b)/i);
            if (!match) return null;
            const suitMap = { spades: 's', clubs: 'c', hearts: 'h', diamonds: 'd' };
            const rank = match[2].toUpperCase() === '10' ? 'T' : match[2].toUpperCase();
            const suit = suitMap[match[1].toLowerCase()];
            return `${rank}${suit}`;
        }).filter(Boolean);
    }

    function estimateOdds(hole, board) {
        const cards = [...board, ...hole];
        const ranks = cards.map(c => c[0]);
        const suits = cards.map(c => c[1]);

        let result = [];
        const rankCount = ranks.reduce((acc, r) => { acc[r] = (acc[r] || 0) + 1; return acc; }, {});
        const suitCount = suits.reduce((acc, s) => { acc[s] = (acc[s] || 0) + 1; return acc; }, {});

        const hasPair = Object.values(rankCount).some(x => x >= 2);
        const hasTrips = Object.values(rankCount).some(x => x >= 3);
        const hasFlush = Object.values(suitCount).some(x => x >= 5);

        if (hasFlush) result.push("Flush potential");
        if (hasTrips) result.push("3 of a Kind");
        else if (hasPair) result.push("Pair detected");
        else result.push("High card only");

        return result.join(", ");
    }

    function simulateWinChance(hole, board) {
        if (hole.length !== 2 || board.length === 0) return null;

        const topBoard = board.map(c => c[0]);
        const heroStrength = estimateOdds(hole, board);

        let base = 25;
        if (heroStrength.includes("3 of a Kind")) base = 85;
        else if (heroStrength.includes("Flush")) base = 75;
        else if (heroStrength.includes("Pair")) base = 45;

        const dangerousRanks = ['A', 'K', 'Q', 'J', 'T'];
        const dangerCount = topBoard.filter(r => dangerousRanks.includes(r)).length;

        let penalty = dangerCount * 5;
        if (topBoard.includes(hole[0][0]) || topBoard.includes(hole[1][0])) penalty -= 5;
        penalty += (tableSize - 1) * 4;

        const adjusted = Math.max(base - penalty, 3);
        return `~${adjusted}%`;
    }

    function detectComboThreat(board) {
        if (board.length === 0) return "";
        const suits = board.map(c => c[1]);
        const suitCount = suits.reduce((a, b) => { a[b] = (a[b] || 0) + 1; return a; }, {});
        const flushThreat = Object.values(suitCount).some(count => count >= 3);

        const ranks = board.map(c => "A23456789TJQK".indexOf(c[0])).sort((a, b) => a - b);
        let straightThreat = false;
        for (let i = 0; i <= ranks.length - 3; i++) {
            const window = ranks.slice(i, i + 3);
            const range = window[2] - window[0];
            if (window.length === 3 && range <= 4) straightThreat = true;
        }

        const threats = [];
        if (flushThreat) threats.push("Flush draw possible");
        if (straightThreat) threats.push("Straight draw possible");
        return threats.join(", ");
    }

    function detectHeroPotential(hole, board) {
        if (board.length === 0) return "";
        const suits = [...board, ...hole].map(c => c[1]);
        const suitCount = suits.reduce((a, b) => { a[b] = (a[b] || 0) + 1; return a; }, {});
        const flushPotential = Object.values(suitCount).some(count => count === 4);

        const allRanks = [...board, ...hole].map(c => "A23456789TJQK".indexOf(c[0]));
        const uniqueRanks = [...new Set(allRanks)].sort((a, b) => a - b);

        let straightNear = false;
        for (let i = 0; i <= uniqueRanks.length - 4; i++) {
            const window = uniqueRanks.slice(i, i + 4);
            const range = window[3] - window[0];
            if (range <= 4 && window.length === 4) {
                straightNear = true;
                break;
            }
        }

        const potentials = [];
        if (flushPotential) potentials.push("1 to Flush");
        if (straightNear) potentials.push("1 to Straight");
        return potentials.join(", ");
    }

    function createHUD() {
        hudEl = document.createElement('div');
        hudEl.id = 'pokerHUD';
        hudEl.style.position = 'fixed';
        hudEl.style.top = '20px';
        hudEl.style.right = '20px';
        hudEl.style.zIndex = '9999';
        hudEl.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        hudEl.style.color = 'lime';
        hudEl.style.fontFamily = 'monospace';
        hudEl.style.padding = '10px';
        hudEl.style.borderRadius = '8px';
        hudEl.style.fontSize = '14px';
        hudEl.style.cursor = 'move';
        hudEl.innerText = 'Waiting for cards...';
        document.body.appendChild(hudEl);

        makeDraggable(hudEl);
    }

    function makeDraggable(el) {
        let isDown = false;
        let offset = [0, 0];

        el.addEventListener('mousedown', (e) => {
            isDown = true;
            offset = [el.offsetLeft - e.clientX, el.offsetTop - e.clientY];
        });

        document.addEventListener('mouseup', () => { isDown = false; });

        document.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            el.style.left = (e.clientX + offset[0]) + 'px';
            el.style.top = (e.clientY + offset[1]) + 'px';
            el.style.right = 'auto';
        });
    }

    function updateHUD() {
        if (!hudEl) return;

        const board = getBoardCardsFromDOM();
        const threat = estimateOdds(currentHoleCards, board);
        const winChance = simulateWinChance(currentHoleCards, board);
        const comboThreat = detectComboThreat(board);
        const heroPot = detectHeroPotential(currentHoleCards, board);

        let html = '';
        if (board.length > 0) html += `🃏 Board: ${board.join(" ")}<br>`;
        html += `📊 Odds: ${threat}<br>`;
        html += `🎯 Win Chance: ${winChance || "-"}<br>`;
        if (comboThreat) html += `🧨 Competitor: ${comboThreat}<br>`;
        if (heroPot) html += `🔮 Potential: ${heroPot}`;

        hudEl.innerHTML = html;
    }

    waitForLogContainer();
    window.updateHUD = updateHUD;
    window.getAllParsedCards = getAllParsedCards;
})();
