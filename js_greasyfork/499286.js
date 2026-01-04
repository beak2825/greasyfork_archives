// ==UserScript==
// @name         Ankly's Poker HUD
// @namespace    http://tampermonkey.net/
// @version      v0.1
// @description  Standard Poker HUD for Torn City
// @author       Ankly [2787727]
// @match        https://www.torn.com/page.php?sid=holdem
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/499286/Ankly%27s%20Poker%20HUD.user.js
// @updateURL https://update.greasyfork.org/scripts/499286/Ankly%27s%20Poker%20HUD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let playerStats = {};
    let currentGameId = null;
    let messageLog = [];
    let currentStage = 'preflop';

    function updatePlayerStats(player, action, stage) {
        const currentPlayerHand = playerStats[player]?.currentGameId
        if (!playerStats[player]) {
            playerStats[player] = { vpip: 0, pfr: 0, hands: 0, raises: 0, voluntaryActions: 0, currentGameId: null };
        }

        if(playerStats[player].hands > 0) {
            if (stage === 'preflop') {
                if (action.includes('raised')) {
                    playerStats[player].raises++;
                    if(currentPlayerHand !== currentGameId){
                        playerStats[player].voluntaryActions++;
                        playerStats[player].currentGameId = currentGameId

                    }
                } else if (action.includes('called') && !action.includes('posted')) {
                    if( currentPlayerHand !== currentGameId){
                        playerStats[player].voluntaryActions++;
                        playerStats[player].currentGameId = currentGameId

                    }
                }
            }

            playerStats[player].vpip = playerStats[player].voluntaryActions / playerStats[player].hands;
            playerStats[player].pfr = playerStats[player].raises / playerStats[player].hands;
        }
        renderHUD(player);
    }

    function renderHUD(player) {
        const nameElements = document.querySelectorAll("[class^='name_']");
        nameElements.forEach((nameElement) => {
            const playerName = nameElement.textContent.trim();
            if (playerName.includes(player)) {
                let hudElement = nameElement.querySelector('.hud');
                if (!hudElement) {
                    hudElement = document.createElement('div');
                    hudElement.className = 'hud';
                    hudElement.style.width = '100%';
                    hudElement.style.color = 'white';
                    nameElement.appendChild(hudElement);
                }
                const handsText = playerStats[player].hands || 0;
                const vpipText = (playerStats[player].vpip * 100).toFixed() || 0;
                const pfrText = (playerStats[player].pfr * 100).toFixed() || 0;
                hudElement.innerHTML = `<p><abbr title="VPIP - PFR - Hands Played">${vpipText}% - ${pfrText}% - ${handsText}</abbr></p>`;

            }
        });
    }

    function parseActionMessage(message) {
        messageLog.push(message);

        if (message.includes('Game')) {
            currentGameId = message.split(' ')[0];
            currentStage = 'preflop';

            Object.keys(playerStats).forEach(player => {
                playerStats[player].hands += 1;
                updatePlayerStats(player, 'new hand', 'preflop');
            });
            return;
        }

        if (message.includes('flop') && !message.includes('preflop')) {
            currentStage = 'flop';
            return;
        }

        if (message.includes('turn')) {
            currentStage = 'turn';
            return;
        }

        if (message.includes('river')) {
            currentStage = 'river';
            return;
        }

        const regex = /^(.+?)\s+(.+)/;
        const match = message.match(regex);
        if (match) {
            const player = match[1].trim();
            const action = match[2].trim().toLowerCase();
            updatePlayerStats(player, action, currentStage);
        }
    }

    function handleAddedNodes(mutations) {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && node.matches(".message___RlFXd")) {
                    const message = node.textContent.trim();
                    parseActionMessage(message);
                }
            });
        });
    }

    const observer = new MutationObserver((mutations) => {
        handleAddedNodes(mutations);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();