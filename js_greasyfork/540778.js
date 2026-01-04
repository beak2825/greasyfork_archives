// ==UserScript==
// @name         Torn Blackjack Assist
// @namespace    torn.blackjack.assist
// @version      2.1
// @description  Displays real-time basic strategy advice for Blackjack on both desktop and Torn PDA.
// @author       eaksquad
// @match        https://www.torn.com/page.php?sid=blackjack*
// @match        https://www.torn.com/pda.php*step=blackjack*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540778/Torn%20Blackjack%20Assist.user.js
// @updateURL https://update.greasyfork.org/scripts/540778/Torn%20Blackjack%20Assist.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const A = { HIT: 'Hit', STAND: 'Stand', DOUBLE: 'Double', SPLIT: 'Split' };
    const strategy = {
        hard: {
            8: [A.HIT, A.HIT, A.HIT, A.HIT, A.HIT, A.HIT, A.HIT, A.HIT, A.HIT, A.HIT, A.HIT],
            9: [A.HIT, A.HIT, A.DOUBLE, A.DOUBLE, A.DOUBLE, A.DOUBLE, A.HIT, A.HIT, A.HIT, A.HIT, A.HIT],
            10: [A.HIT, A.DOUBLE, A.DOUBLE, A.DOUBLE, A.DOUBLE, A.DOUBLE, A.DOUBLE, A.DOUBLE, A.DOUBLE, A.HIT, A.HIT],
            11: [A.HIT, A.DOUBLE, A.DOUBLE, A.DOUBLE, A.DOUBLE, A.DOUBLE, A.DOUBLE, A.DOUBLE, A.DOUBLE, A.DOUBLE, A.HIT],
            12: [A.HIT, A.HIT, A.STAND, A.STAND, A.STAND, A.HIT, A.HIT, A.HIT, A.HIT, A.HIT, A.HIT],
            13: [A.HIT, A.STAND, A.STAND, A.STAND, A.STAND, A.STAND, A.HIT, A.HIT, A.HIT, A.HIT, A.HIT],
            14: [A.HIT, A.STAND, A.STAND, A.STAND, A.STAND, A.STAND, A.HIT, A.HIT, A.HIT, A.HIT, A.HIT],
            15: [A.HIT, A.STAND, A.STAND, A.STAND, A.STAND, A.STAND, A.HIT, A.HIT, A.HIT, A.HIT, A.HIT],
            16: [A.HIT, A.STAND, A.STAND, A.STAND, A.STAND, A.STAND, A.HIT, A.HIT, A.HIT, A.HIT, A.HIT],
            17: Array(11).fill(A.STAND), 18: Array(11).fill(A.STAND),
            19: Array(11).fill(A.STAND), 20: Array(11).fill(A.STAND), 21: Array(11).fill(A.STAND),
        },
        soft: {
            13: [A.HIT, A.HIT, A.HIT, A.HIT, A.DOUBLE, A.DOUBLE, A.HIT, A.HIT, A.HIT, A.HIT, A.HIT],
            14: [A.HIT, A.HIT, A.HIT, A.HIT, A.DOUBLE, A.DOUBLE, A.HIT, A.HIT, A.HIT, A.HIT, A.HIT],
            15: [A.HIT, A.HIT, A.HIT, A.DOUBLE, A.DOUBLE, A.DOUBLE, A.HIT, A.HIT, A.HIT, A.HIT, A.HIT],
            16: [A.HIT, A.HIT, A.HIT, A.DOUBLE, A.DOUBLE, A.DOUBLE, A.HIT, A.HIT, A.HIT, A.HIT, A.HIT],
            17: [A.HIT, A.HIT, A.DOUBLE, A.DOUBLE, A.DOUBLE, A.DOUBLE, A.DOUBLE, A.HIT, A.HIT, A.HIT, A.HIT],
            18: [A.STAND, A.DOUBLE, A.DOUBLE, A.DOUBLE, A.DOUBLE, A.STAND, A.STAND, A.HIT, A.HIT, A.STAND, A.STAND],
            19: Array(11).fill(A.STAND), 20: Array(11).fill(A.STAND),
        },
        pair: {
            2: [A.SPLIT, A.SPLIT, A.SPLIT, A.SPLIT, A.SPLIT, A.SPLIT, A.HIT, A.HIT, A.HIT, A.HIT, A.HIT],
            3: [A.SPLIT, A.SPLIT, A.SPLIT, A.SPLIT, A.SPLIT, A.SPLIT, A.HIT, A.HIT, A.HIT, A.HIT, A.HIT],
            4: [A.HIT, A.HIT, A.HIT, A.SPLIT, A.SPLIT, A.HIT, A.HIT, A.HIT, A.HIT, A.HIT, A.HIT],
            5: [A.HIT, A.DOUBLE, A.DOUBLE, A.DOUBLE, A.DOUBLE, A.DOUBLE, A.DOUBLE, A.DOUBLE, A.DOUBLE, A.HIT, A.HIT],
            6: [A.HIT, A.SPLIT, A.SPLIT, A.SPLIT, A.SPLIT, A.SPLIT, A.HIT, A.HIT, A.HIT, A.HIT, A.HIT],
            7: [A.SPLIT, A.SPLIT, A.SPLIT, A.SPLIT, A.SPLIT, A.SPLIT, A.SPLIT, A.HIT, A.HIT, A.HIT, A.HIT],
            8: Array(11).fill(A.SPLIT),
            9: [A.SPLIT, A.SPLIT, A.SPLIT, A.SPLIT, A.SPLIT, A.STAND, A.SPLIT, A.SPLIT, A.STAND, A.STAND, A.STAND],
            10: Array(11).fill(A.STAND),
            11: Array(11).fill(A.SPLIT),
        }
    };

    function getCardValue(cardElement) {
        if (!cardElement) return 0;
        const match = cardElement.className.match(/card-\w+-(\w+)/);
        if (!match || !match[1]) return 0;
        const rank = match[1];
        if (['J', 'Q', 'K'].includes(rank)) return 10;
        if (rank === 'A') return 11;
        return parseInt(rank, 10);
    }

    function getHandInfo(cardContainerSelector) {
        const cardElements = document.querySelectorAll(`${cardContainerSelector} div[class*="card-"]`);
        const cards = Array.from(cardElements).map(getCardValue);
        let sum = cards.reduce((a, b) => a + b, 0);
        let aces = cards.filter(v => v === 11).length;
        while (sum > 21 && aces-- > 0) sum -= 10;
        const isPair = cards.length === 2 && cards[0] === cards[1];
        return { cards, total: sum, isSoft: aces > 0 && sum <= 21, isPair };
    }

    function getDecision(dealerCardValue, playerHand) {
        // *** THE FINAL FIX *** A dealer Ace (11) maps to index 1 in our tables.
        const dealerIndex = dealerCardValue === 11 ? 1 : dealerCardValue;

        if (playerHand.isPair) {
            const pairValue = playerHand.cards[0] === 11 ? 11 : playerHand.cards[0];
            return strategy.pair[pairValue]?.[dealerIndex] || A.HIT;
        }
        if (playerHand.isSoft) {
            return strategy.soft[playerHand.total]?.[dealerIndex] || A.STAND;
        }
        return strategy.hard[playerHand.total]?.[dealerIndex] || A.STAND;
    }

    function mainObserverCallback() {
        const dealerCardEl = document.querySelector('.dealer-cards div[class*="card-"]');
        const dealerCardValue = getCardValue(dealerCardEl);
        const playerHand = getHandInfo('.player-cards');
        const canTakeAction = document.querySelector('#hit, #stand');

        if (!dealerCardValue || playerHand.cards.length < 2 || !canTakeAction || playerHand.total >= 21) {
            updateOverlay('---');
            return;
        }

        const decision = getDecision(dealerCardValue, playerHand);
        updateOverlay(decision, playerHand.total);
    }

    // --- UI, Styling, Draggable Logic ---
    function addStyles() {
        const style = document.createElement('style');
        style.innerHTML = `#bj-helper-overlay { position: fixed; background-color: rgba(0,0,0,0.85); color: white; padding: 12px 18px; border-radius: 10px; border: 2px solid; font-family: Arial,"Helvetica Neue",Helvetica,sans-serif; text-align: center; z-index: 9999; box-shadow: 0 4px 8px rgba(0,0,0,0.5); min-width: 150px; transition: all 0.3s ease; cursor: move; user-select: none; } #bj-helper-advice-text { font-size: 24px; font-weight: bold; text-shadow: 0 0 5px #000; } #bj-helper-hand-total { font-size: 14px; opacity: 0.8; margin-top: 4px; } .bj-hit { border-color: #ff9900; background-color: rgba(102,60,0,0.7); } .bj-stand, .bj-double { border-color: #4CAF50; background-color: rgba(30,77,32,0.7); } .bj-split { border-color: #2196F3; background-color: rgba(13,60,99,0.7); } .bj-idle { border-color: #666; }`;
        document.head.appendChild(style);
    }

    function makeDraggable(element) {
        const STORAGE_POS_KEY = 'bjHelperPosition'; let isDragging = false, offsetX, offsetY; const savedPos = localStorage.getItem(STORAGE_POS_KEY); if (savedPos) { const { top, left } = JSON.parse(savedPos); element.style.top = top; element.style.left = left; } else { element.style.right = '20px'; element.style.bottom = '20px'; } const onDragStart = (e) => { isDragging = true; e.preventDefault(); const event = e.touches ? e.touches[0] : e; offsetX = event.clientX - element.offsetLeft; offsetY = event.clientY - element.offsetTop; element.style.right = ''; element.style.bottom = ''; window.addEventListener('mousemove', onDragMove, { passive: false }); window.addEventListener('touchmove', onDragMove, { passive: false }); window.addEventListener('mouseup', onDragEnd); window.addEventListener('touchend', onDragEnd); }; const onDragMove = (e) => { if (!isDragging) return; e.preventDefault(); const event = e.touches ? e.touches[0] : e; element.style.left = `${event.clientX - offsetX}px`; element.style.top = `${event.clientY - offsetY}px`; }; const onDragEnd = () => { isDragging = false; localStorage.setItem(STORAGE_POS_KEY, JSON.stringify({ top: element.style.top, left: element.style.left })); window.removeEventListener('mousemove', onDragMove); window.removeEventListener('touchmove', onDragMove); window.removeEventListener('mouseup', onDragEnd); window.removeEventListener('touchend', onDragEnd); }; element.addEventListener('mousedown', onDragStart); element.addEventListener('touchstart', onDragStart);
    }
    
    function createOverlay() {
        if (document.getElementById('bj-helper-overlay')) return;
        const overlay = document.createElement('div');
        overlay.id = 'bj-helper-overlay';
        overlay.innerHTML = `<div><div id="bj-helper-advice-text">---</div><div id="bj-helper-hand-total">Waiting for hand</div></div>`;
        document.body.appendChild(overlay);
        makeDraggable(overlay);
    }

    function updateOverlay(decision = '---', total = 0) {
        const overlay = document.getElementById('bj-helper-overlay');
        const adviceEl = document.getElementById('bj-helper-advice-text');
        const totalEl = document.getElementById('bj-helper-hand-total');
        if (!overlay || !adviceEl || !totalEl) return;
        adviceEl.textContent = decision;
        totalEl.textContent = total > 0 ? `on your ${total}` : 'Waiting for hand';
        overlay.className = '';
        if (decision !== '---') { overlay.classList.add(`bj-${decision.toLowerCase()}`); } else { overlay.classList.add('bj-idle'); }
    }
    
    function initialize() {
        const gameContainer = document.querySelector('.blackjack, .blackjack-wrap');
        if (!gameContainer) return;
        if (!document.getElementById('bj-helper-overlay')) {
            addStyles();
            createOverlay();
        }
        const observer = new MutationObserver(mainObserverCallback);
        observer.observe(gameContainer, { childList: true, subtree: true });
        mainObserverCallback();
    }

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();