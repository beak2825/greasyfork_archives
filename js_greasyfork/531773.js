// ==UserScript==
// @name         Torn High-Low Helper (Advanced)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Hides incorrect button for high-low based on remaining cards.
// @author       Lollipop :)
// @match        https://www.torn.com/page.php?sid=highlow
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531773/Torn%20High-Low%20Helper%20%28Advanced%29.user.js
// @updateURL https://update.greasyfork.org/scripts/531773/Torn%20High-Low%20Helper%20%28Advanced%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CHECK_INTERVAL = 300; // Check slightly more often
    const MAX_WAIT_TIME = 15000; // Wait a maximum of 15 seconds

    let checkTimer = null;
    let waitTime = 0;

    // --- Game State ---
    let remainingDeck = {}; // Stores count of each card value (2-14)
    let lastDealerCardValue = null;
    let lastPlayerCardValue = null; // To avoid double-counting on rapid mutations
    let isGameActive = false; // Track if we are in an active game round

    // --- Card Value Mapping (Ace High) ---
    const CARD_VALUES = {
        '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
        'J': 11, 'Q': 12, 'K': 13, 'A': 14
    };
    const ALL_RANKS = Object.keys(CARD_VALUES); // ['2', '3', ..., 'A']

    // --- Helper Function to Parse Card Value ---
    function getCardValue(ratingText) {
        if (!ratingText) return null;
        const text = ratingText.trim().toUpperCase();
        return CARD_VALUES[text] || null; // Return numeric value or null
    }

    // --- Reset Deck for New Game ---
    function resetDeck() {
        console.log("Resetting deck for new game.");
        remainingDeck = {};
        for (const rank in CARD_VALUES) {
            remainingDeck[CARD_VALUES[rank]] = 4; // 4 suits per rank
        }
        lastDealerCardValue = null;
        lastPlayerCardValue = null;
        isGameActive = true; // Mark game as active after reset (usually follows start)
        console.log("Initial Deck:", JSON.stringify(remainingDeck));
    }

    // --- Update Deck Count When Card is Revealed ---
    function removeCardFromDeck(cardValue) {
        if (cardValue !== null && remainingDeck[cardValue] > 0) {
            remainingDeck[cardValue]--;
             console.log(`Removed card ${Object.keys(CARD_VALUES).find(key => CARD_VALUES[key] === cardValue)} (${cardValue}). Remaining: ${remainingDeck[cardValue]}`);
             // console.log("Current Deck State:", JSON.stringify(remainingDeck));
             return true; // Card was successfully removed
        } else if (cardValue !== null) {
            console.warn(`Attempted to remove card ${Object.keys(CARD_VALUES).find(key => CARD_VALUES[key] === cardValue)} (${cardValue}), but count is already ${remainingDeck[cardValue] ?? 'undefined'}. Deck might be out of sync.`);
        }
        return false; // Card not removed (either invalid or count was 0)
    }

     // --- Calculate Higher/Lower Counts ---
    function calculateProbabilities(dealerValue) {
        if (dealerValue === null || !isGameActive) {
            return { lower: 0, higher: 0, totalRemaining: 0 }; // Not enough info or game not active
        }

        let lowerCount = 0;
        let higherCount = 0;
        let totalRemaining = 0;

        for (const value in remainingDeck) {
            const numericValue = parseInt(value, 10);
            const count = remainingDeck[value];
            totalRemaining += count;
            if (numericValue < dealerValue) {
                lowerCount += count;
            } else if (numericValue > dealerValue) {
                higherCount += count;
            }
            // Cards with equal value don't count for higher/lower
        }
         console.log(`Dealer: ${dealerValue}. Remaining: Lower=${lowerCount}, Higher=${higherCount}, Total=${totalRemaining}`);
        return { lower: lowerCount, higher: higherCount, totalRemaining: totalRemaining };
    }


    // --- Function to perform the check and update logic ---
    function checkAndUpdateGame() {
        // Select elements every time to ensure they are current
        const dealerCardElement = document.querySelector('.dealer-card');
        const playerCardElement = document.querySelector('.you-card');
        const lowerButton = document.querySelector('.actions-wrap .action-btn-wrap.low');
        const higherButton = document.querySelector('.actions-wrap .action-btn-wrap.high');
        const startButton = document.querySelector('.action-btn-wrap.startGame'); // For reset detection
        const resultWrap = document.querySelector('.game-result-wrap'); // For reset detection
        const highlowWrap = document.querySelector('.highlow-main-wrap'); // To check if game interface is visible

        if (!dealerCardElement || !playerCardElement || !lowerButton || !higherButton || !highlowWrap) {
            console.warn("Core game elements not found during update check.");
            return; // Should not happen if waitForElements worked, but safety first
        }

        // --- Check for Game End/Reset Conditions ---
        // If start button is visible OR result wrap is visible, the active game has ended.
        // We also check if the main highlow wrap is hidden (often happens briefly between rounds)
        const gameEnded = (startButton && startButton.offsetParent !== null) ||
                          (resultWrap && resultWrap.offsetParent !== null) ||
                          (highlowWrap.offsetParent === null);

        if (gameEnded && isGameActive) {
            console.log("Game appears to have ended or reset. Setting isGameActive to false.");
            isGameActive = false;
            // Reset button visibility to default (hidden until next dealer card)
            lowerButton.style.display = 'none';
            higherButton.style.display = 'none';
            lastDealerCardValue = null; // Clear last known cards
            lastPlayerCardValue = null;
        }

        // --- If game is not active, do nothing further ---
        if (!isGameActive) {
            // Make sure buttons remain hidden if game isn't active
             if (lowerButton.style.display !== 'none') lowerButton.style.display = 'none';
             if (higherButton.style.display !== 'none') higherButton.style.display = 'none';
            // console.log("Game not active. Waiting for Start Game.");
            return;
        }

        // --- Process Current Cards ---
        const currentDealerRatingElement = dealerCardElement?.querySelector('span.rating');
        const currentPlayerRatingElement = playerCardElement?.querySelector('span.rating');

        const dealerRatingText = currentDealerRatingElement?.textContent;
        const playerRatingText = currentPlayerRatingElement?.textContent?.trim() ?? '';

        const currentDealerValue = getCardValue(dealerRatingText);
        const currentPlayerValue = getCardValue(playerRatingText);

        // --- Track Revealed Cards ---
        // Only remove if the value changed and is valid
        if (currentDealerValue !== null && currentDealerValue !== lastDealerCardValue) {
            console.log(`New Dealer Card: ${dealerRatingText} (${currentDealerValue})`);
            removeCardFromDeck(currentDealerValue);
            lastDealerCardValue = currentDealerValue;
            lastPlayerCardValue = null; // Reset player card tracking when dealer changes
        }

        // Player card is revealed (end of a round, before next dealer card)
        if (currentPlayerValue !== null && currentPlayerValue !== lastPlayerCardValue) {
             console.log(`Player Card Revealed: ${playerRatingText} (${currentPlayerValue})`);
             removeCardFromDeck(currentPlayerValue);
             lastPlayerCardValue = currentPlayerValue;
             // Hide buttons as choice is made
             lowerButton.style.display = 'none';
             higherButton.style.display = 'none';
             return; // Don't make prediction when player card is shown
        }

         // --- Player Card is hidden, Dealer Card is shown: Make Prediction ---
        if (playerRatingText === '' && currentDealerValue !== null) {
             const { lower, higher, totalRemaining } = calculateProbabilities(currentDealerValue);

             if (totalRemaining === 0 && isGameActive) {
                 console.warn("No cards left in tracked deck, but game is active? Deck might be out of sync.");
                  // Fallback to simple strategy if deck is empty? Or hide both? Hide based on simple for now.
                  if (currentDealerValue <= 7) { // Simple fallback
                    lowerButton.style.display = 'none';
                    higherButton.style.display = 'inline-block';
                 } else {
                     higherButton.style.display = 'none';
                     lowerButton.style.display = 'inline-block';
                 }
                 return;
             }

             // Decision Logic: Hide the less likely button
             if (higher > lower) {
                 // More higher cards remaining -> Suggest 'Higher'
                 lowerButton.style.display = 'none';
                 higherButton.style.display = 'inline-block';
                 console.log(`Prediction: HIGHER (H: ${higher} > L: ${lower})`);
             } else if (lower > higher) {
                 // More lower cards remaining -> Suggest 'Lower'
                 higherButton.style.display = 'none';
                 lowerButton.style.display = 'inline-block';
                 console.log(`Prediction: LOWER (L: ${lower} > H: ${higher})`);
             } else {
                 // Equal probability - Use simple strategy as tie-breaker (7 is middle)
                 // Or maybe show both? Hiding one is the request.
                 console.log(`Prediction: EQUAL (L: ${lower}, H: ${higher}). Using simple tie-breaker.`);
                 if (currentDealerValue <= 7) { // Favor higher for <= 7
                    lowerButton.style.display = 'none';
                    higherButton.style.display = 'inline-block';
                 } else { // Favor lower for > 7
                     higherButton.style.display = 'none';
                     lowerButton.style.display = 'inline-block';
                 }
             }
        } else if (playerRatingText === '' && currentDealerValue === null) {
            // No dealer card yet (very start of game after clicking start)
            lowerButton.style.display = 'none';
            higherButton.style.display = 'none';
        }
        // (Case where player card is revealed is handled earlier)
    }

    // --- Function to apply styles and setup observer ---
    function initializeGameLogic() {
        console.log("Torn High-Low Helper (Advanced): Core game elements found. Initializing...");

        const startButton = document.querySelector('.action-btn-wrap.startGame');

        // --- Apply one-time styles (Start button position) ---
        if (startButton) {
            try {
                startButton.style.position = 'relative';
                startButton.style.top = '257px'; // Adjust as needed
                startButton.style.left = '-50px'; // Adjust as needed
                console.log("Start button repositioned.");

                // --- Add listener to Start button for deck reset ---
                startButton.addEventListener('click', () => {
                    console.log("Start Game button clicked - Resetting deck.");
                    resetDeck();
                    // No need to call checkAndUpdateGame here, mutation observer will catch card changes
                });
                 console.log("Added click listener to Start button.");

            } catch (e) {
                console.error("Error styling or adding listener to Start button:", e);
            }
        } else {
            console.log('Start Game button not found on initial load (likely game in progress or already finished).');
             // Attempt to determine initial state if possible (might be unreliable)
             const dealerCardElement = document.querySelector('.dealer-card span.rating');
             if(dealerCardElement && dealerCardElement.textContent.trim() !== '') {
                 console.log("Game seems to be in progress. Initial deck state might be inaccurate until next game.");
                 isGameActive = true; // Assume active, but deck is unknown
                 // We won't have past cards, so prediction will be off until reset.
             } else {
                 isGameActive = false;
             }
        }

        // Initial deck reset if we are definitely on the start screen
        if (startButton && startButton.offsetParent !== null) {
             resetDeck(); // Reset deck state
             isGameActive = false; // Not active until *after* start is clicked
        }


        // --- Setup MutationObserver ---
        // Observe a parent container that includes cards and buttons for state changes
        const gameContainer = document.querySelector('.highlow-main-wrap'); // Or a more specific wrapper if available
        if (!gameContainer) {
             console.error("Cannot find main game container for MutationObserver!");
             return;
        }

        const observer = new MutationObserver(mutationsList => {
            // Use a debounce/throttle mechanism if performance becomes an issue
            // For now, just call the update function on any observed change
            try {
                // Check if the start button appeared (indicates game ended)
                const currentStartButton = document.querySelector('.action-btn-wrap.startGame');
                if (currentStartButton && currentStartButton.offsetParent !== null && isGameActive) {
                    console.log("Mutation detected Start Button visibility - flagging game end.");
                    isGameActive = false; // Game ended
                    // No need to reset deck here, start button click handler does that.
                }
                 // Check if result screen appeared
                 const currentResultWrap = document.querySelector('.game-result-wrap');
                 if (currentResultWrap && currentResultWrap.offsetParent !== null && isGameActive) {
                     console.log("Mutation detected Result Wrap visibility - flagging game end.");
                     isGameActive = false; // Game ended
                 }


                // Re-run the check on any relevant mutation inside the container
                checkAndUpdateGame();
            } catch(e) {
                 console.error("Error during MutationObserver callback:", e);
            }
        });

        // Configuration: watch for changes in children (cards appearing/changing)
        // and subtree (text changes within spans)
        const config = {
            childList: true,
            subtree: true,
            characterData: true // Needed for card rank text changes
        };

        try {
            observer.observe(gameContainer, config);
            console.log("MutationObserver started, watching game container.");
        } catch(e) {
            console.error("Error starting MutationObserver:", e);
        }

        // --- Initial Check ---
        // Run once after setup to set initial state based on current DOM
        // Reset deck if start button is visible initially
         if (startButton && startButton.offsetParent !== null) {
             resetDeck();
             isGameActive = false;
         } else {
             // If not on start screen, try to determine if game is active
             const dealerCardElement = document.querySelector('.dealer-card span.rating');
             const playerCardElement = document.querySelector('.you-card span.rating');
             if(dealerCardElement && dealerCardElement.textContent.trim() !== '') {
                 console.log("Initial check: Game seems in progress.");
                 // We *don't* know the deck state accurately here if loaded mid-game.
                 // Initialize an empty deck or full deck? Let's assume full deck but mark as potentially inaccurate.
                 resetDeck(); // Reset to full deck
                 console.warn("Deck reset, but history is unknown as script loaded mid-game.");
                 // Manually remove current dealer/player cards if visible?
                 const initialDealerVal = getCardValue(dealerCardElement.textContent);
                 const initialPlayerVal = getCardValue(playerCardElement?.textContent);
                 if (initialDealerVal) removeCardFromDeck(initialDealerVal);
                 if (initialPlayerVal) removeCardFromDeck(initialPlayerVal);

                 isGameActive = true;
                 checkAndUpdateGame(); // Run prediction logic
             } else {
                 console.log("Initial check: Game not started or finished.");
                 isGameActive = false;
                 resetDeck(); // Ensure deck is ready for when start is clicked
                 checkAndUpdateGame(); // Hide buttons etc.
             }
         }


    }


    // --- Wait for core elements to exist before initializing ---
    function waitForElements() {
        // Check for essential elements needed for the script's core logic
         if (document.querySelector('.highlow-main-wrap') && // Main container is crucial
            document.querySelector('.dealer-card') &&
            document.querySelector('.you-card') &&
            document.querySelector('.actions-wrap .action-btn-wrap.low') &&
            document.querySelector('.actions-wrap .action-btn-wrap.high')
           )
        {
            clearInterval(checkTimer); // Stop checking
            initializeGameLogic(); // Run the main setup
        } else {
            waitTime += CHECK_INTERVAL;
            if (waitTime >= MAX_WAIT_TIME) {
                clearInterval(checkTimer);
                console.error("Torn High-Low Helper (Advanced): Timed out waiting for game elements to load.");
            } else {
                 console.log("Waiting for game elements...");
            }
        }
    }

    // Start the check
    checkTimer = setInterval(waitForElements, CHECK_INTERVAL);

})(); // End of IIFE wrapper