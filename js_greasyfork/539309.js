// ==UserScript==
// @name         Torn RPG Blackjack Helper
// @namespace    https://www.torn.com/
// @version      1.0
// @description  Overlay basic strategy advice for Blackjack in Torn PDA
// @author       ChatGPT
// @match        https://www.torn.com/pda.php*step=blackjack*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539309/Torn%20RPG%20Blackjack%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/539309/Torn%20RPG%20Blackjack%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Strategy Tables ---
    const hardStrategy = {
        '5': { '2-10': 'Hit' },
        '6': { '2-10': 'Hit' },
        '7': { '2-10': 'Hit' },
        '8': { '2-10': 'Hit' },
        '9': { '3-6': 'Double', 'else': 'Hit' },
        '10': { '2-9': 'Double', 'else': 'Hit' },
        '11': { '2-10': 'Double', 'else': 'Hit' },
        '12': { '4-6': 'Stand', 'else': 'Hit' },
        '13': { '2-6': 'Stand', 'else': 'Hit' },
        '14': { '2-6': 'Stand', 'else': 'Hit' },
        '15': { '2-6': 'Stand', 'else': 'Hit' },
        '16': { '2-6': 'Stand', 'else': 'Hit' },
        '17': { '2-10': 'Stand' },
        '18': { '2-10': 'Stand' },
        '19': { '2-10': 'Stand' },
        '20': { '2-10': 'Stand' },
        '21': { '2-10': 'Stand' }
    };

    const softStrategy = {
        'A,2': { '5-6': 'Double', 'else': 'Hit' },
        'A,3': { '5-6': 'Double', 'else': 'Hit' },
        'A,4': { '4-6': 'Double', 'else': 'Hit' },
        'A,5': { '4-6': 'Double', 'else': 'Hit' },
        'A,6': { '3-6': 'Double', 'else': 'Hit' },
        'A,7': { '3-6': 'Double', '2,7-8': 'Stand', '9-10': 'Hit' },
        'A,8': { '2-10': 'Stand' },
        'A,9': { '2-10': 'Stand' }
    };

    const pairStrategy = {
        'A,A': { '2-10': 'Split' },
        '10,10': { '2-10': 'Stand' },
        '9,9': { '2-6,8-9': 'Split', '7,10': 'Stand' },
        '8,8': { '2-10': 'Split' },
        '7,7': { '2-7': 'Split', '8-10': 'Hit' },
        '6,6': { '2-6': 'Split', '7-10': 'Hit' },
        '5,5': { '2-9': 'Double', 'else': 'Hit' },
        '4,4': { '5-6': 'Split', 'else': 'Hit' },
        '3,3': { '2-7': 'Split', '8-10': 'Hit' },
        '2,2': { '2-7': 'Split', '8-10': 'Hit' }
    };

    // --- Utility Functions ---
    function parseCardValue(card) {
        if (!card) return null;
        const rank = card.textContent.trim();
        if (['J','Q','K'].includes(rank)) return 10;
        if (rank === 'A') return 11;
        return parseInt(rank, 10) || 0;
    }

    function getDealerUpcard() {
        const card = document.querySelector('.dealer-cards .card');
        return parseCardValue(card);
    }

    function getPlayerHand() {
        const cards = Array.from(document.querySelectorAll('.player-cards .card'));
        return cards.map(parseCardValue).filter(val => val !== null);
    }

    function isPair(hand) {
        return hand.length === 2 && hand[0] === hand[1];
    }

    function isSoft(hand) {
        return hand.includes(11);
    }

    function handTotal(hand) {
        let sum = hand.reduce((a, b) => a + b, 0);
        let aces = hand.filter(v => v === 11).length;
        
        while (sum > 21 && aces > 0) {
            sum -= 10;
            aces--;
        }
        return sum;
    }

    function lookupDecision(dealer, hand) {
        const total = handTotal(hand);
        if (hand.length === 2 && isPair(hand)) {
            const key = hand.join(',');
            return matchStrategy(pairStrategy[key], dealer);
        }
        if (hand.length === 2 && isSoft(hand)) {
            const other = hand.find(v => v !== 11);
            const key = `A,${other}`;
            return matchStrategy(softStrategy[key], dealer);
        }
        const strat = hardStrategy[String(total)];
        return matchStrategy(strat, dealer);
    }

    function matchStrategy(strat, dealer) {
        if (!strat) return '---';
        for (let range in strat) {
            const parts = range.split(',');
            for (let part of parts) {
                if (part === 'else') continue;
                const [min, max] = part.split('-').map(Number);
                if (dealer >= min && dealer <= max) {
                    return strat[range];
                }
            }
        }
        return strat['else'] || '---';
    }

    // --- Overlay UI ---
    function createOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'bj-helper-overlay';
        
        Object.assign(overlay.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            color: '#FFD700',
            padding: '15px',
            borderRadius: '10px',
            border: '2px solid #FFD700',
            fontSize: '20px',
            fontWeight: 'bold',
            fontFamily: 'Arial, sans-serif',
            textAlign: 'center',
            zIndex: '9999',
            boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
            minWidth: '180px',
            minHeight: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        });
        
        const advice = document.createElement('div');
        advice.id = 'bj-helper-advice';
        advice.textContent = '---';
        advice.style.textShadow = '0 0 5px #000';
        
        overlay.appendChild(advice);
        document.body.appendChild(overlay);
        return overlay;
    }

    // --- Game State Observer ---
    function initObserver() {
        const observer = new MutationObserver(() => {
            const dealerCard = getDealerUpcard();
            const playerHand = getPlayerHand();
            
            if (!dealerCard || playerHand.length < 2) {
                updateAdvice('---');
                return;
            }
            
            const decision = lookupDecision(dealerCard, playerHand);
            updateAdvice(decision);
        });

        const dealerArea = document.querySelector('.dealer-cards');
        const playerArea = document.querySelector('.player-cards');
        
        if (dealerArea && playerArea) {
            observer.observe(dealerArea, { childList: true, subtree: true });
            observer.observe(playerArea, { childList: true, subtree: true });
        }
    }

    function updateAdvice(decision) {
        const adviceEl = document.getElementById('bj-helper-advice');
        if (adviceEl) adviceEl.textContent = decision;
    }

    // --- Initialization ---
    function init() {
        if (!document.querySelector('.blackjack')) return;
        
        if (!document.getElementById('bj-helper-overlay')) {
            createOverlay();
        }
        
        initObserver();
        updateAdvice('---');
    }

    // Start when page is ready
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();