// ==UserScript==
// @name         Chumba BJ Optimal Move Display & Autoplay
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Displays and auto-plays optimal moves for Chumba Casino blackjack games
// @author       You
// @match        https://lobby.chumbacasino.com/games/blackJack*
// @match        https://gameserver.chumbacasino.com/legacy-clients/loader/index.html?company=chumba_game&myName=Black%20Jack&gameId=blackJack*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519986/Chumba%20BJ%20Optimal%20Move%20Display%20%20Autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/519986/Chumba%20BJ%20Optimal%20Move%20Display%20%20Autoplay.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // Check which context we're running in
    const isGameFrame = window.location.href.includes('gameserver.chumbacasino.com');

    if (isGameFrame) {
        // Code for game iframe context
        window.addEventListener("message", (event) => {
            if (event.data.action) {
                try {
                    const game = chumba.controller.slots.openGames.slots[0];
                    switch (event.data.action) {
                        case 'SET_SPEED':
                            game.game.time.slowMotion = event.data.speed;
                            break;
                        case 'HIT':
                            game.eventManager.dispatch('user-hit-request');
                            break;
                        case 'STAND':
                            game.eventManager.dispatch('user-stand-request');
                            break;
                        case 'DOUBLE':
                            game.eventManager.dispatch('user-double-request');
                            break;
                        case 'SPLIT':
                            game.eventManager.dispatch('user-split-request');
                            break;
                        case 'REPEAT':
                            game.eventManager.dispatch('user-rebet-and-deal-request');
                            break;
                        case 'DECLINEINSURANCE':
                            game.eventManager.dispatch('user-cancel-insurance-request');
                            break;
                    }

                    window.parent.postMessage({
                        type: "moveResult",
                        result: "success",
                        action: event.data.action
                    }, "*");
                } catch (error) {
                    window.parent.postMessage({
                        type: "moveResult",
                        result: "error",
                        error: error.message
                    }, "*");
                }
            }
        });
        return; // Exit early for game frame context
    }

    // Rest of the original userscript code for the parent window...
    // Strategy chart and all other functions remain the same
    const strategyChart = {
        2: {
            5: "H",
            6: "H",
            7: "H",
            8: "H",
            9: "H",
            10: "D",
            11: "D",
            12: "H",
            13: "S",
            14: "S",
            15: "S",
            16: "S",
            17: "S",
            18: "S",
            A2: "H",
            A3: "H",
            A4: "H",
            A5: "H",
            A6: "H",
            A7: "S",
            A8: "S",
            A9: "S",
            22: "P",
            33: "P",
            44: "H",
            55: "D",
            66: "P",
            77: "P",
            88: "P",
            99: "P",
            20: "S",
            AA: "P",
        },
        3: {
            5: "H",
            6: "H",
            7: "H",
            8: "H",
            9: "D",
            10: "D",
            11: "D",
            12: "H",
            13: "S",
            14: "S",
            15: "S",
            16: "S",
            17: "S",
            18: "S",
            A2: "H",
            A3: "H",
            A4: "H",
            A5: "H",
            A6: "H",
            A7: "S",
            A8: "S",
            A9: "S",
            22: "P",
            33: "P",
            44: "H",
            55: "D",
            66: "P",
            77: "P",
            88: "P",
            99: "P",
            20: "S",
            AA: "P",
        },
        4: {
            5: "H",
            6: "H",
            7: "H",
            8: "H",
            9: "D",
            10: "D",
            11: "D",
            12: "S",
            13: "S",
            14: "S",
            15: "S",
            16: "S",
            17: "S",
            18: "S",
            A2: "H",
            A3: "H",
            A4: "H",
            A5: "H",
            A6: "H",
            A7: "S",
            A8: "S",
            A9: "S",
            22: "P",
            33: "P",
            44: "H",
            55: "D",
            66: "P",
            77: "P",
            88: "P",
            99: "P",
            20: "S",
            AA: "P",
        },
        5: {
            5: "H",
            6: "H",
            7: "H",
            8: "H",
            9: "D",
            10: "D",
            11: "D",
            12: "S",
            13: "S",
            14: "S",
            15: "S",
            16: "S",
            17: "S",
            18: "S",
            A2: "H",
            A3: "H",
            A4: "H",
            A5: "H",
            A6: "H",
            A7: "S",
            A8: "S",
            A9: "S",
            22: "P",
            33: "P",
            44: "P",
            55: "D",
            66: "P",
            77: "P",
            88: "P",
            99: "P",
            20: "S",
            AA: "P",
        },
        6: {
            5: "H",
            6: "H",
            7: "H",
            8: "H",
            9: "D",
            10: "D",
            11: "D",
            12: "S",
            13: "S",
            14: "S",
            15: "S",
            16: "S",
            17: "S",
            18: "S",
            A2: "H",
            A3: "H",
            A4: "H",
            A5: "H",
            A6: "H",
            A7: "S",
            A8: "S",
            A9: "S",
            22: "P",
            33: "P",
            44: "P",
            55: "D",
            66: "P",
            77: "P",
            88: "P",
            99: "P",
            20: "S",
            AA: "P",
        },
        7: {
            5: "H",
            6: "H",
            7: "H",
            8: "H",
            9: "H",
            10: "D",
            11: "D",
            12: "H",
            13: "H",
            14: "H",
            15: "H",
            16: "H",
            17: "S",
            18: "S",
            A2: "H",
            A3: "H",
            A4: "H",
            A5: "H",
            A6: "H",
            A7: "S",
            A8: "S",
            A9: "S",
            22: "P",
            33: "P",
            44: "H",
            55: "D",
            66: "H",
            77: "P",
            88: "P",
            99: "S",
            20: "S",
            AA: "P",
        },
        8: {
            5: "H",
            6: "H",
            7: "H",
            8: "H",
            9: "H",
            10: "D",
            11: "D",
            12: "H",
            13: "H",
            14: "H",
            15: "H",
            16: "H",
            17: "S",
            18: "S",
            A2: "H",
            A3: "H",
            A4: "H",
            A5: "H",
            A6: "H",
            A7: "S",
            A8: "S",
            A9: "S",
            22: "H",
            33: "H",
            44: "H",
            55: "D",
            66: "H",
            77: "H",
            88: "P",
            99: "P",
            20: "S",
            AA: "P",
        },
        9: {
            5: "H",
            6: "H",
            7: "H",
            8: "H",
            9: "H",
            10: "D",
            11: "D",
            12: "H",
            13: "H",
            14: "H",
            15: "H",
            16: "H",
            17: "S",
            18: "S",
            A2: "H",
            A3: "H",
            A4: "H",
            A5: "H",
            A6: "H",
            A7: "H",
            A8: "S",
            A9: "S",
            22: "H",
            33: "H",
            44: "H",
            55: "D",
            66: "H",
            77: "H",
            88: "P",
            99: "P",
            20: "S",
            AA: "P",
        },
        10: {
            5: "H",
            6: "H",
            7: "H",
            8: "H",
            9: "H",
            10: "H",
            11: "H",
            12: "H",
            13: "H",
            14: "H",
            15: "H",
            16: "H",
            17: "S",
            18: "S",
            A2: "H",
            A3: "H",
            A4: "H",
            A5: "H",
            A6: "H",
            A7: "H",
            A8: "S",
            A9: "S",
            22: "H",
            33: "H",
            44: "H",
            55: "H",
            66: "H",
            77: "H",
            88: "H",
            99: "S",
            20: "S",
            AA: "P",
        },
        A: {
            5: "H",
            6: "H",
            7: "H",
            8: "H",
            9: "H",
            10: "H",
            11: "H",
            12: "H",
            13: "H",
            14: "H",
            15: "H",
            16: "H",
            17: "S",
            18: "S",
            A2: "H",
            A3: "H",
            A4: "H",
            A5: "H",
            A6: "H",
            A7: "H",
            A8: "S",
            A9: "S",
            22: "H",
            33: "H",
            44: "H",
            55: "H",
            66: "H",
            77: "H",
            88: "H",
            99: "S",
            20: "S",
            AA: "P",
        },
    };

    // Helper to get the player's hand key
    function getPlayerKey(hand) {
        const symbolToValue = {
            TWO: 2,
            THREE: 3,
            FOUR: 4,
            FIVE: 5,
            SIX: 6,
            SEVEN: 7,
            EIGHT: 8,
            NINE: 9,
            TEN: 10,
            JACK: 10,
            QUEEN: 10,
            KING: 10,
            ACE: 1,
        };

        const values = hand.map((card) => symbolToValue[card.symbol]);

        // Check for pair
        if (values.length === 2 && values[0] === values[1]) {
            return values[0] === 1 ? "AA" : `${values[0] * 2}`;
        }

        // Check for Ace and move it to the front and sum other cards
        if (values.includes(1)) {
            const sum = values.reduce((a, b) => a + b, 0) - 1;
            return sum < 11 ? `A${sum}` : `${sum + 1}`;
        }

        // Otherwise, convert to hard total
        return values.reduce((a, b) => a + b, 0).toString();
    }

    // Helper to get the optimal strategy
    function getOptimalStrategy(dealerCard, playerKey) {
        // Default to "Stand" for hard totals of 17 or higher if not explicitly defined in the chart
        if (Number(playerKey) >= 17 && Number(playerKey) <= 21) {
            return "S"; // Stand
        }

        // Use the strategy chart if the move is explicitly defined
        if (strategyChart[dealerCard] && strategyChart[dealerCard][playerKey]) {
            return strategyChart[dealerCard][playerKey];
        }

        // Return "Unknown" if no valid move is found
        return "Unknown";
    }

    // Create container for optimal move and autoplay button
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.bottom = "10px";
    container.style.left = "50%";
    container.style.transform = "translateX(-50%)";
    container.style.display = "flex";
    container.style.gap = "10px";
    container.style.alignItems = "center";
    container.style.zIndex = "9999";

    // Modify optimal move display styles
    const optimalMoveDisplay = document.createElement("div");
    optimalMoveDisplay.style.position = "static";
    optimalMoveDisplay.style.transform = "none";
    optimalMoveDisplay.style.left = "auto";
    optimalMoveDisplay.style.bottom = "auto";
    optimalMoveDisplay.style.width = "200px";
    optimalMoveDisplay.style.textAlign = "center";
    optimalMoveDisplay.style.backgroundColor = "#222";
    optimalMoveDisplay.style.color = "#fff";
    optimalMoveDisplay.style.padding = "10px";
    optimalMoveDisplay.style.borderRadius = "8px";
    optimalMoveDisplay.style.fontFamily = "Arial, sans-serif";
    optimalMoveDisplay.style.zIndex = "9999";
    optimalMoveDisplay.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
    optimalMoveDisplay.textContent = "Optimal Move: -";

    // Create autoplay button
    const autoplayButton = document.createElement("button");
    autoplayButton.textContent = "Start Autoplay";
    autoplayButton.style.padding = "10px 20px";
    autoplayButton.style.borderRadius = "8px";
    autoplayButton.style.border = "none";
    autoplayButton.style.backgroundColor = "#4CAF50";
    autoplayButton.style.color = "white";
    autoplayButton.style.cursor = "pointer";
    autoplayButton.style.fontFamily = "Arial, sans-serif";
    autoplayButton.style.transition = "background-color 0.3s";

    let autoplayEnabled = false;
    let lastOptimalMove = null;

    autoplayButton.addEventListener("click", () => {
        autoplayEnabled = !autoplayEnabled;
        autoplayButton.textContent = autoplayEnabled ? "Stop Autoplay" : "Start Autoplay";
        autoplayButton.style.backgroundColor = autoplayEnabled ? "#f44336" : "#4CAF50";

        if (autoplayEnabled && lastOptimalMove) {
            executeOptimalMove(lastOptimalMove);
        }
    });

    // Add speedButton to container
    const speedButton = document.createElement("button");
    speedButton.textContent = "Normal Speed";
    speedButton.style.padding = "10px 20px";
    speedButton.style.borderRadius = "8px";
    speedButton.style.border = "none";
    speedButton.style.backgroundColor = "#4CAF50";
    speedButton.style.color = "white";
    speedButton.style.cursor = "pointer";
    speedButton.style.fontFamily = "Arial, sans-serif";
    speedButton.style.transition = "background-color 0.3s";

    let fastSpeed = false;
    speedButton.addEventListener("click", () => {
        fastSpeed = !fastSpeed;
        speedButton.textContent = fastSpeed ? "Fast Speed" : "Normal Speed";
        speedButton.style.backgroundColor = fastSpeed ? "#f44336" : "#4CAF50";

        // Send message to game iframe to change speed
        const gameFrame = document.querySelector('iframe[src*="gameserver.chumbacasino.com"]');
        if (gameFrame) {
            gameFrame.contentWindow.postMessage({
                action: 'SET_SPEED',
                speed: fastSpeed ? 0.01 : 1
            }, "*");
        }
    });

    // Create playthrough display
    const playthroughDisplay = document.createElement("div");
    playthroughDisplay.style.padding = "10px 20px";
    playthroughDisplay.style.borderRadius = "8px";
    playthroughDisplay.style.backgroundColor = "#333";
    playthroughDisplay.style.color = "white";
    playthroughDisplay.style.fontFamily = "Arial, sans-serif";
    playthroughDisplay.textContent = "Playthrough: 0%";

    // Update the container additions
    container.appendChild(optimalMoveDisplay);
    container.appendChild(autoplayButton);
    container.appendChild(speedButton);
    container.appendChild(playthroughDisplay);
    document.body.appendChild(container);

    // Function to execute moves
    function executeOptimalMove(move) {
        if (!autoplayEnabled) return;

        // Use shorter delays when in fast mode
        const delay = move === "Optimal Move: Repeat"
            ? (fastSpeed ? 2500 : 5000)  // 1 second vs 5 seconds for repeat
            : (fastSpeed ? 1000 : 2000);  // 0.5 seconds vs 2 seconds for other moves

        setTimeout(() => {
            const gameFrame = document.querySelector('iframe[src*="gameserver.chumbacasino.com"]');
            if (!gameFrame) return;

            const action = move.replace("Optimal Move: ", "").toUpperCase();
            const messageData = { action };

            // Post message to game iframe
            gameFrame.contentWindow.postMessage(messageData, "*");
        }, delay);
    }

    // Add these constants near the top of the script
    const PLAYTHROUGH_REQUIREMENT = 1; // 1x playthrough required
    let startingBalance = null;
    let totalAmountPlayed = 0;

    // Modify the XMLHttpRequest monitoring code to update the playthrough display
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
        this.addEventListener("load", function () {
            // Track balance updates
            if (url.includes("api.prod.chumbacasino.com/player-token/v1/amounts")) {
                try {
                    const response = JSON.parse(this.responseText);
                    const currentBalance = response.sweepsCoins.amount;

                    // Initialize starting balance if not set
                    if (startingBalance === null) {
                        startingBalance = currentBalance;
                    }

                    // Update playthrough display
                    if (startingBalance) {
                        const percentage = Math.min((totalAmountPlayed / (startingBalance * PLAYTHROUGH_REQUIREMENT)) * 100, 100);
                        playthroughDisplay.textContent = `Playthrough: ${percentage.toFixed(1)}%`;

                        // Change color based on progress
                        if (percentage >= 100) {
                            playthroughDisplay.style.backgroundColor = "#4CAF50";  // Green
                        } else if (percentage >= 75) {
                            playthroughDisplay.style.backgroundColor = "#FFA500";  // Orange
                        } else if (percentage >= 50) {
                            playthroughDisplay.style.backgroundColor = "#FFD700";  // Gold
                            playthroughDisplay.style.color = "black";
                        }
                    }
                } catch (e) {
                    console.error("Error parsing balance response", e);
                }
            }

            // Track played amounts and check playthrough
            if (url.includes("blackjack") &&
                (url.includes("hit") || url.includes("stand") ||
                    url.includes("double") || url.includes("split") ||
                    url.includes("deal") || url.includes("init"))) {
                try {
                    const response = JSON.parse(this.responseText);
                    if (response.playOutcome && response.playOutcome.allHandsCompleted) {
                        totalAmountPlayed += response.playOutcome.bet;

                        // Update playthrough display
                        if (startingBalance) {
                            const percentage = Math.min((totalAmountPlayed / (startingBalance * PLAYTHROUGH_REQUIREMENT)) * 100, 100);
                            playthroughDisplay.textContent = `Playthrough: ${percentage.toFixed(1)}%`;

                            // Change color based on progress
                            if (percentage >= 100) {
                                playthroughDisplay.style.backgroundColor = "#4CAF50";  // Green
                            } else if (percentage >= 75) {
                                playthroughDisplay.style.backgroundColor = "#FFA500";  // Orange
                            } else if (percentage >= 50) {
                                playthroughDisplay.style.backgroundColor = "#FFD700";  // Gold
                                playthroughDisplay.style.color = "black";
                            }
                        }

                        // Check if playthrough requirement met
                        if (startingBalance && totalAmountPlayed >= startingBalance * PLAYTHROUGH_REQUIREMENT) {
                            // Stop autoplay
                            if (autoplayEnabled) {
                                autoplayEnabled = false;
                                autoplayButton.textContent = "Start Autoplay";
                                autoplayButton.style.backgroundColor = "#4CAF50";

                                // Show alert
                                alert(`Playthrough requirement met!\nStarting balance: ${startingBalance}\nTotal played: ${totalAmountPlayed}`);
                            }
                        }
                    }

                    // Rest of the existing response handling code...
                    if (response.playOutcome) {
                        // Check if any actions are available
                        const activeHand = response.playOutcome.playerHands.find(hand =>
                            hand.actions.hit ||
                            hand.actions.stand ||
                            hand.actions.double ||
                            hand.actions.split
                        );

                        // Only calculate and display optimal move if actions are available
                        if (activeHand || response.playOutcome.allHandsCompleted) {
                            const dealerCardSymbol =
                                response.playOutcome.dealerHand.cards[0].symbol;
                            const dealerCard = {
                                TWO: 2,
                                THREE: 3,
                                FOUR: 4,
                                FIVE: 5,
                                SIX: 6,
                                SEVEN: 7,
                                EIGHT: 8,
                                NINE: 9,
                                TEN: 10,
                                JACK: 10,
                                QUEEN: 10,
                                KING: 10,
                                ACE: "A",
                            }[dealerCardSymbol];

                            const playerKey = response.playOutcome.playerHands
                                .map((hand) => getPlayerKey(hand.hand.cards))
                                .join(" | ");

                            let optimalMoveKey;
                            if (response.playOutcome.allHandsCompleted) {
                                optimalMoveKey = "REPEAT";
                            } else if (playerKey.includes("|")) {
                                optimalMoveKey = "Multiple Hands";
                            } else {
                                optimalMoveKey = getOptimalStrategy(dealerCard, playerKey);

                                // Check if doubling is actually available
                                const activeHand = response.playOutcome.playerHands.find(hand =>
                                    hand.actions.hit || hand.actions.stand ||
                                    hand.actions.double || hand.actions.split
                                );

                                // If strategy suggests double but it's not available, fall back to hit
                                if (optimalMoveKey === "D" && (!activeHand.actions.double || activeHand.hand.cards.length > 2)) {
                                    optimalMoveKey = "H";
                                }
                            }

                            let backgroundColor, textColor;
                            switch (optimalMoveKey) {
                                case "H":
                                    optimalMoveDisplay.textContent = "Optimal Move: Hit";
                                    backgroundColor = "#FFD700";
                                    textColor = "black";
                                    break;
                                case "S":
                                    optimalMoveDisplay.textContent = "Optimal Move: Stand";
                                    backgroundColor = "#e50047";
                                    textColor = "white";
                                    break;
                                case "P":
                                    optimalMoveDisplay.textContent = "Optimal Move: Split";
                                    backgroundColor = "#FF8C00";
                                    textColor = "black";
                                    break;
                                case "D":
                                    optimalMoveDisplay.textContent = "Optimal Move: Double";
                                    backgroundColor = "#008000";
                                    textColor = "white";
                                    break;
                                case "REPEAT":
                                    optimalMoveDisplay.textContent = "Optimal Move: Repeat";
                                    backgroundColor = "#008000";
                                    textColor = "white";
                                    break;
                                default:
                                    optimalMoveDisplay.textContent = "Waiting...";
                                    backgroundColor = "#222";
                                    textColor = "white";
                                    break;
                            }

                            optimalMoveDisplay.style.backgroundColor = backgroundColor;
                            optimalMoveDisplay.style.color = textColor;

                            // Only store and execute moves if actions are available or it's time to repeat
                            if ((activeHand && !response.playOutcome.allHandsCompleted) ||
                                (response.playOutcome.allHandsCompleted && optimalMoveKey === "REPEAT")) {
                                lastOptimalMove = optimalMoveDisplay.textContent;
                                if (autoplayEnabled) {
                                    executeOptimalMove(lastOptimalMove);
                                }
                            }
                        } else {
                            // No actions available
                            optimalMoveDisplay.textContent = "Waiting...";
                            optimalMoveDisplay.style.backgroundColor = "#222";
                            optimalMoveDisplay.style.color = "white";
                        }
                    }
                } catch (e) {
                    console.error("Error parsing response", e);
                }
            }
        });
        originalOpen.apply(this, arguments);
    };

    // Listen for messages from game iframe
    window.addEventListener("message", (event) => {
        if (event.data.type === "moveResult") {
            console.log("Move result:", event.data.result);
        }
    });
})();