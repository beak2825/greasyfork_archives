// ==UserScript==
// @name         Enhanced Poker Odds Calculator for Torn
// @namespace    https://openuserjs.org/users/torn/pokerodds
// @version      2.0.0
// @description  Advanced poker calculator with starting hand guidance for Torn
// @author       Your Name
// @match        https://www.torn.com/page.php?sid=holdem*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531917/Enhanced%20Poker%20Odds%20Calculator%20for%20Torn.user.js
// @updateURL https://update.greasyfork.org/scripts/531917/Enhanced%20Poker%20Odds%20Calculator%20for%20Torn.meta.js
// ==/UserScript==

// Starting Hand Rankings (Chen Formula)
const STARTING_HAND_SCORES = {
    // Pocket Pairs
    'AA': 'Premium (10.0)', 'KK': 'Premium (9.0)', 'QQ': 'Premium (8.0)',
    'JJ': 'Strong (7.0)', 'TT': 'Strong (6.0)', '99': 'Playable (5.0)',
    '88': 'Playable (4.0)', '77': 'Speculative (3.0)', '66': 'Speculative (2.0)',
    '55': 'Speculative (2.0)', '44': 'Marginal (1.0)', '33': 'Marginal (1.0)', '22': 'Marginal (1.0)',
    
    // Suited Connectors
    'AKs': 'Premium (8.0)', 'AQs': 'Premium (7.0)', 'AJs': 'Strong (6.5)',
    'KQs': 'Strong (6.0)', 'ATs': 'Strong (6.0)', 'KJs': 'Strong (5.5)',
    'QJs': 'Playable (5.0)', 'JTs': 'Playable (4.5)', 'T9s': 'Speculative (3.5)',
    '98s': 'Speculative (3.0)', '87s': 'Speculative (2.5)', '76s': 'Speculative (2.0)',
    
    // Offsuit Broadway
    'AK': 'Premium (7.0)', 'AQ': 'Strong (6.5)', 'AJ': 'Playable (5.5)',
    'KQ': 'Playable (5.0)', 'AT': 'Playable (5.0)', 'KJ': 'Playable (4.5)',
    'QJ': 'Speculative (4.0)', 'JT': 'Speculative (3.5)'
};

class EnhancedPokerCalculator {
    constructor() {
        this.setupStyles();
        this.setupUI();
        this.startMonitoring();
    }

    setupStyles() {
        const styles = `
            .poker-helper {
                background: #fff;
                border: 1px solid #ddd;
                border-radius: 4px;
                margin: 10px;
                padding: 15px;
                font-family: Arial, sans-serif;
            }

            .hand-strength {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
            }

            .hand-advice {
                background: #f5f5f5;
                padding: 10px;
                border-radius: 4px;
                margin-top: 10px;
            }

            .premium { color: #2ecc71; }
            .strong { color: #3498db; }
            .playable { color: #f1c40f; }
            .speculative { color: #e67e22; }
            .marginal { color: #e74c3c; }

            .stats-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 10px;
            }

            .stats-table th, .stats-table td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
            }

            .stats-table th {
                background: #f5f5f5;
            }
        `;

        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }

    setupUI() {
        const container = document.createElement('div');
        container.className = 'poker-helper';
        container.innerHTML = `
            <div class="hand-strength">
                <div>
                    <h3>Current Hand</h3>
                    <div id="current-hand"></div>
                </div>
                <div>
                    <h3>Hand Strength</h3>
                    <div id="hand-rating"></div>
                </div>
            </div>
            <div class="hand-advice" id="hand-advice"></div>
            <table class="stats-table">
                <thead>
                    <tr>
                        <th>Stat</th>
                        <th>Value</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="stats-body"></tbody>
            </table>
        `;

        // Insert after the poker table
        const pokerTable = document.querySelector('.poker-table');
        if (pokerTable) {
            pokerTable.parentNode.insertBefore(container, pokerTable.nextSibling);
        }
    }

    getHandRating(cards) {
        if (cards.length !== 2) return null;
        
        const [card1, card2] = cards.sort((a, b) => b.value - a.value);
        const suited = card1.suit === card2.suit;
        
        let key = '';
        if (card1.value === card2.value) {
            // Pocket pair
            key = `${this.valueToRank(card1.value)}${this.valueToRank(card2.value)}`;
        } else {
            // Non-pair
            key = `${this.valueToRank(card1.value)}${this.valueToRank(card2.value)}${suited ? 's' : ''}`;
        }
        
        return STARTING_HAND_SCORES[key] || 'Fold';
    }

    valueToRank(value) {
        const ranks = {
            14: 'A', 13: 'K', 12: 'Q', 11: 'J', 10: 'T'
        };
        return ranks[value] || value.toString();
    }

    getPlayAdvice(handRating) {
        const advice = {
            'Premium': 'Raise from any position. Re-raise if raised before you.',
            'Strong': 'Raise from middle/late position. Call or re-raise if raised before you.',
            'Playable': 'Raise from late position. Call from middle position if no raises.',
            'Speculative': 'Call from late position if no raises. Fold to significant action.',
            'Marginal': 'Fold from early position. Only play if getting good pot odds.'
        };

        return advice[handRating.split(' ')[0]] || 'Consider folding this hand.';
    }

    updateDisplay(cards) {
        const handRating = this.getHandRating(cards);
        if (!handRating) return;

        document.getElementById('current-hand').textContent = cards.map(c => 
            `${this.valueToRank(c.value)}${c.suit.charAt(0)}`).join(' ');
        
        document.getElementById('hand-rating').textContent = handRating;
        document.getElementById('hand-advice').textContent = this.getPlayAdvice(handRating);
    }

    startMonitoring() {
        setInterval(() => {
            // Monitor for changes in the player's cards
            const playerCards = this.getPlayerCards();
            if (playerCards) {
                this.updateDisplay(playerCards);
            }
        }, 1000);
    }

    getPlayerCards() {
        // Implementation depends on Torn's DOM structure
        // This is a placeholder - needs to be adapted to actual DOM
        const cardElements = document.querySelectorAll('.player-cards .card');
        if (cardElements.length !== 2) return null;

        return Array.from(cardElements).map(el => ({
            value: this.parseCardValue(el.dataset.value),
            suit: el.dataset.suit
        }));
    }

    parseCardValue(value) {
        const values = { 'A': 14, 'K': 13, 'Q': 12, 'J': 11 };
        return values[value] || parseInt(value);
    }
}

// Initialize when the page loads
window.addEventListener('load', () => {
    new EnhancedPokerCalculator();
});