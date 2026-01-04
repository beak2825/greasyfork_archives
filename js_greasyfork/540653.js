// ==UserScript==
// @name         Torn Keno Hot Numbers
// @namespace    torn.keno.hotnumbers.tracker
// @version      3.4
// @description  Tracks Keno number frequency during a session and displays the top 10 hottest numbers. Waits for dynamic content.
// @author       eaksquad
// @match        https://www.torn.com/page.php?sid=keno
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540653/Torn%20Keno%20Hot%20Numbers.user.js
// @updateURL https://update.greasyfork.org/scripts/540653/Torn%20Keno%20Hot%20Numbers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function main() {
        const KENO_DATA_URL_FRAGMENT = 'page.php?rfcv=';
        const STORAGE_KEY = 'kenoHotNumbersData_v2'; // New key for the new data structure
        let isInitialized = false;

        // --- ENHANCED STATE ---
        let gameCount = 0; // The new game counter
        let numberData = {}; // Will hold { count, lastSeen }

        // --- ENHANCED STORAGE FUNCTIONS ---

        function loadSession() {
            const savedState = sessionStorage.getItem(STORAGE_KEY);
            if (savedState) {
                try {
                    const parsedState = JSON.parse(savedState);
                    numberData = parsedState.numberData || {};
                    gameCount = parsedState.gameCount || 0;
                    console.log(`[Keno Tracker] Loaded session. Game count: ${gameCount}`);
                } catch (e) {
                    console.error("[Keno Tracker] Could not parse session data.", e);
                }
            }
        }

        function saveSession() {
            const stateToSave = { gameCount, numberData };
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
        }

        function addCustomStyles() {
            const style = document.createElement('style');
            style.innerHTML = `
                #keno-hot-numbers-container { flex-basis: 100%; background-color: #f2f2f2; border-radius: 5px; margin-bottom: 15px; border: 1px solid #ccc; box-shadow: 0 2px 3px rgba(0,0,0,0.1); }
                .dark-mode #keno-hot-numbers-container { background-color: #3d3d3d; border-color: #444; }
                .keno-hot-numbers-header { padding: 10px; background-color: #e8e8e8; border-top-left-radius: 5px; border-top-right-radius: 5px; font-weight: bold; font-size: 14px; color: #333; border-bottom: 1px solid #ddd; text-align: center; }
                .dark-mode .keno-hot-numbers-header { background-color: #2e2e2e; border-color: #444; color: #ccc; }
                #keno-hot-numbers-body { padding: 15px; display: flex; flex-wrap: wrap; gap: 8px 12px; justify-content: center; min-height: 40px; align-items: center; color: #666; }
                .dark-mode #keno-hot-numbers-body { color: #999; }
                .hot-number-pill { background-color: #fff; border: 1px solid #ccc; border-radius: 20px; padding: 5px 12px; font-size: 14px; display: flex; align-items: center; gap: 6px; box-shadow: 0 1px 1px rgba(0,0,0,0.05); transition: transform 0.2s ease; }
                .dark-mode .hot-number-pill { background-color: #2a2a2a; border-color: #555; box-shadow: none; }
                .hot-number-pill:hover { transform: translateY(-2px); }
                .hot-number-pill strong { color: #000; font-size: 15px; }
                .dark-mode .hot-number-pill strong { color: #eee; }
                .hot-number-pill span { font-size: 11px; font-weight: bold; color: #555; }
                .dark-mode .hot-number-pill span { color: #888; }
            `;
            document.head.appendChild(style);
        }

        function createHotNumbersUI() {
            const kenoGame = document.getElementById('kenoGame');
            if (kenoGame && !document.getElementById('keno-hot-numbers-container')) {
                kenoGame.style.flexWrap = 'wrap';
                const container = document.createElement('div');
                container.id = 'keno-hot-numbers-container';
                container.innerHTML = `<div class="keno-hot-numbers-header">Hot Numbers (Session)</div><div id="keno-hot-numbers-body">Play a round to start tracking numbers...</div>`;
                kenoGame.prepend(container);
            }
        }

        // *** THIS FUNCTION CONTAINS THE NEW LOGIC ***
        function updateHotNumbersDisplay(drawnNumbers) {
            // If new numbers were provided from a game result...
            if (drawnNumbers && drawnNumbers.length) {
                gameCount++; // Increment the game counter for this round
                drawnNumbers.forEach(num => {
                    // Ensure the entry exists
                    if (!numberData[num]) {
                        numberData[num] = { count: 0, lastSeen: 0 };
                    }
                    // Update its count and the last time it was seen
                    numberData[num].count++;
                    numberData[num].lastSeen = gameCount;
                });
                saveSession(); // Save the new state
            }

            // Always update the display
            const sortedNumbers = Object.entries(numberData)
                .sort(([, aData], [, bData]) => {
                    // Tier 1: Sort by hit count (descending)
                    const countDiff = bData.count - aData.count;
                    if (countDiff !== 0) return countDiff;

                    // Tier 2 (Tie-breaker): Sort by when it was last seen (descending)
                    return bData.lastSeen - aData.lastSeen;
                })
                .slice(0, 10);

            const displayBody = document.getElementById('keno-hot-numbers-body');
            if (displayBody) {
                if (sortedNumbers.length > 0) {
                    displayBody.innerHTML = sortedNumbers.map(([number, { count }]) => `<div class="hot-number-pill"><strong>${number}</strong><span>(x${count})</span></div>`).join('');
                } else {
                     displayBody.innerHTML = 'Play a round to start tracking numbers...';
                }
            }
        }

        function interceptXHR() {
            const open = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function(method, url) { this._url = url; return open.apply(this, arguments); };
            const send = XMLHttpRequest.prototype.send;
            XMLHttpRequest.prototype.send = function() {
                this.addEventListener('load', function() {
                    if (this._url && this._url.includes(KENO_DATA_URL_FRAGMENT)) {
                        try {
                            const data = JSON.parse(this.responseText);
                            if (data && data.randomNumbers) updateHotNumbersDisplay(data.randomNumbers);
                        } catch (e) { console.error("[Keno Tracker] Error parsing game JSON.", e); }
                    }
                });
                return send.apply(this, arguments);
            };
        }

        function initializeScript() {
            if (isInitialized) return;
            isInitialized = true;
            loadSession();
            addCustomStyles();
            createHotNumbersUI();
            updateHotNumbersDisplay(); // Initial render from loaded data
            interceptXHR();
        }

        const observer = new MutationObserver(() => {
            if (document.getElementById('boardContainer')) {
                initializeScript();
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        if (document.getElementById('boardContainer')) {
            initializeScript();
            observer.disconnect();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main, { once: true });
    } else {
        main();
    }
})();