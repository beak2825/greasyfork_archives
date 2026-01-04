// ==UserScript==
// @name         Pump.fun Auto-Sell Draggable Line
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds a draggable line to Pump.fun that locks in place and auto-sells when the token price crosses it. Uses approved CDN for interact.js.
// @author       YourName
// @match        https://pump.fun/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/interact.js/1.10.27/interact.min.js
// @homepage     https://greasyfork.org/en/scripts/XXXXX
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536792/Pumpfun%20Auto-Sell%20Draggable%20Line.user.js
// @updateURL https://update.greasyfork.org/scripts/536792/Pumpfun%20Auto-Sell%20Draggable%20Line.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inject CSS
    const styles = `
        #custom-menu {
            position: fixed;
            top: 10px;
            right: 10px;
            background-color: #333;
            color: white;
            padding: 10px;
            border-radius: 5px;
            z-index: 10000;
        }
        #custom-menu button {
            display: block;
            margin: 5px 0;
            padding: 8px;
            width: 100%;
            background-color: #555;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        }
        #custom-menu button:hover {
            background-color: #777;
        }
        #price-line {
            position: fixed;
            width: 100%;
            height: 2px;
            background-color: red;
            cursor: move;
            z-index: 9999;
        }
        #price-label {
            position: absolute;
            left: 10px;
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 2px 5px;
            font-size: 12px;
        }
        .hidden {
            display: none;
        }
    `;
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Inject Menu and Line
    const menu = document.createElement('div');
    menu.id = 'custom-menu';
    menu.innerHTML = `
        <button onclick="window._pumpFunScript.toggleLine()">Toggle Line</button>
        <button onclick="window._pumpFunScript.setThreshold()">Set Sell Threshold</button>
        <button onclick="window._pumpFunScript.resetLine()">Reset Line</button>
    `;
    document.body.appendChild(menu);

    const priceLine = document.createElement('div');
    priceLine.id = 'price-line';
    priceLine.innerHTML = '<span id="price-label">Price: $100</span>';
    document.body.appendChild(priceLine);

    // Script Logic
    window._pumpFunScript = {
        lineY: 200, // Initial y-position
        holdings: 10, // Simulated holdings
        priceLine: document.getElementById('price-line'),
        priceLabel: document.getElementById('price-label'),

        init: function() {
            // Setup draggable line
            interact('#price-line')
                .draggable({
                    modifiers: [
                        interact.modifiers.restrictRect({
                            restriction: 'parent',
                            endOnly: true
                        })
                    ],
                    listeners: {
                        move: (event) => {
                            const newY = this.lineY + event.dy;
                            this.priceLine.style.transform = `translateY(${newY}px)`;
                            this.updatePriceLabel(newY);
                        },
                        end: (event) => {
                            this.lineY += event.dy; // Lock position on drop
                            this.priceLine.style.transform = `translateY(${this.lineY}px)`;
                            this.updatePriceLabel(this.lineY);
                        }
                    }
                });

            // Initial position
            this.priceLine.style.transform = `translateY(${this.lineY}px)`;
            this.updatePriceLabel();

            // Start price monitoring (placeholder)
            setInterval(() => this.checkPrice(), 1000);
        },

        toggleLine: function() {
            this.priceLine.classList.toggle('hidden');
        },

        setThreshold: function() {
            const price = prompt('Enter sell threshold price ($):', '100');
            if (price && !isNaN(price)) {
                this.lineY = this.priceToYPosition(parseFloat(price));
                this.priceLine.style.transform = `translateY(${this.lineY}px)`;
                this.updatePriceLabel(this.lineY);
            }
        },

        resetLine: function() {
            this.lineY = 200;
            this.priceLine.style.transform = `translateY(${this.lineY}px)`;
            this.priceLine.classList.remove('hidden');
            this.updatePriceLabel(this.lineY);
        },

        priceToYPosition: function(price) {
            const maxPrice = 200; // Adjust based on Pump.fun's price range
            const windowHeight = window.innerHeight;
            return windowHeight - (price / maxPrice) * windowHeight;
        },

        yPositionToPrice: function(y) {
            const maxPrice = 200;
            const windowHeight = window.innerHeight;
            return (1 - y / windowHeight) * maxPrice;
        },

        updatePriceLabel: function(y = this.lineY) {
            const price = this.yPositionToPrice(y).toFixed(2);
            this.priceLabel.textContent = `Price: $${price}`;
        },

        getCurrentPrice: function() {
            // Placeholder: Inspect Pump.fun's DOM to find price element
            // Example: const priceElement = document.querySelector('.price-class');
            // return priceElement ? parseFloat(priceElement.textContent) : 100;
            return 100 + (Math.random() - 0.5) * 2; // Simulated price
        },

        checkPrice: function() {
            if (this.holdings <= 0) return;

            const currentPrice = this.getCurrentPrice();
            const priceY = this.priceToYPosition(currentPrice);

            if (Math.abs(priceY - this.lineY) < 2) {
                this.sellStock(currentPrice);
            }
        },

        sellStock: function(price) {
            console.log(`Selling ${this.holdings} tokens at $${price.toFixed(2)}`);
            // Placeholder: Simulate sell by clicking Pump.fun's sell button
            // Example: const sellButton = document.querySelector('.sell-button-class');
            // if (sellButton) sellButton.click();
            /*
            // API-based sell (requires wallet setup)
            fetch('https://pumpportal.fun/api/trade-local', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    publicKey: 'your-public-key',
                    action: 'sell',
                    mint: 'token-ca-here',
                    denominatedInSol: 'false',
                    amount: this.holdings,
                    slippage: 1,
                    priorityFee: 0.00001,
                    pool: 'pump'
                })
            }).then(response => response.json()).then(data => {
                console.log('Sell transaction:', data);
            });
            */
            alert(`Sold ${this.holdings} tokens at $${price.toFixed(2)}`);
            this.holdings = 0;
        }
    };

    // Initialize script
    window._pumpFunScript.init();
})();