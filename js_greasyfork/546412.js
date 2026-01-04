// ==UserScript==
// @name         Torn OC Requirement Tracker
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Track crime requirements for your slots in Torn
// @author       Tibit [2023328]
// @match        https://www.torn.com/factions.php?step=your*
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/546412/Torn%20OC%20Requirement%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/546412/Torn%20OC%20Requirement%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add CSS for pulsating effect
    const style = document.createElement('style');
    style.textContent = `
        @keyframes redPulsate {
            0% {
                box-shadow: 0 0 5px rgba(255, 0, 0, 0.3);
                border-color: rgba(255, 0, 0, 0.3);
            }
            50% {
                box-shadow: 0 0 20px rgba(255, 0, 0, 0.6), inset 0 0 10px rgba(255, 0, 0, 0.1);
                border-color: rgba(255, 0, 0, 0.6);
            }
            100% {
                box-shadow: 0 0 5px rgba(255, 0, 0, 0.3);
                border-color: rgba(255, 0, 0, 0.3);
            }
        }

        .missing-item-pulsate {
            animation: redPulsate 2s ease-in-out infinite;
            border: 2px solid rgba(255, 0, 0, 0.3);
            border-radius: 8px;
        }

        .clickable-slot-title {
            cursor: pointer !important;
            transition: color 0.2s ease;
        }

        .clickable-slot-title:hover {
            color: #ffaa00 !important;
            text-decoration: underline;
        }
    `;
    document.head.appendChild(style);

    // Store the original fetch function
    const originalFetch = window.fetch;

    // Store crime data when intercepted
    let crimeData = null;
    let playerName = null;

    // Get the current player's name
    function getPlayerName() {
        // More generalized selector for the username link
        const userLink = document.querySelector("#sidebar div > p > a");
        if (userLink) {
            return userLink.innerText.trim();
        }
        return null;
    }

    // Find the specific player card/slot in the crime
    function findPlayerCrimeWrapper() {
        if (!playerName || !crimeData) {
            return null;
        }

        // Find which crime(s) the player is in from the API data
        let playerCrimes = [];
        crimeData.forEach(crime => {
            if (crime.playerSlots && Array.isArray(crime.playerSlots)) {
                crime.playerSlots.forEach(slot => {
                    if (slot.player && slot.player.name === playerName) {
                        playerCrimes.push({
                            crimeId: crime.ID,
                            slot: slot,
                            crime: crime
                        });
                    }
                });
            }
        });

        if (playerCrimes.length === 0) {
            return null;
        }

        // Find the player's card in the DOM using the simpler approach
        const playerCards = [];

        // Find all honor-text spans with the player's name within the crime list
        const honorTextElements = document.querySelectorAll('.tt-oc2-list .honor-text');

        honorTextElements.forEach(honorText => {
            if (honorText.textContent === playerName) {
                // Find the parent wrapper element (div with class starting with wrapper___)
                let element = honorText;
                while (element && !element.className.match(/^wrapper___/)) {
                    element = element.parentElement;
                }

                if (element) {
                    // Find which crime this belongs to from our data
                    const crimeWrapper = element.closest('.wrapper___U2Ap7[data-oc-id]');
                    const crimeId = crimeWrapper ? parseInt(crimeWrapper.getAttribute('data-oc-id')) : null;

                    // Match with our crime data
                    const matchingCrime = playerCrimes.find(pc => pc.crimeId === crimeId);

                    if (matchingCrime) {






                        // Check for requirement
                        if (matchingCrime.slot.requirement) {






                        }


                        // Apply visual effects and click handler
                        applyEffectsToCard(element, matchingCrime);

                        playerCards.push({
                            slotElement: element,
                            crimeWrapper: crimeWrapper,
                            crimeData: matchingCrime
                        });
                    }
                }
            }
        });

        return playerCards;
    }

    // Apply visual effects and click handler to the card
    function applyEffectsToCard(cardElement, crimeData) {
        const requirement = crimeData.slot.requirement;

        if (!requirement) return;

        // Add pulsating red effect if item is missing
        if (!requirement.doesExist) {
            cardElement.classList.add('missing-item-pulsate');

        }

        // Find the title span and make it clickable
        const titleSpan = cardElement.querySelector('span[class^="title___"]');
        if (titleSpan) {
            // Add visual indicator that it's clickable
            titleSpan.classList.add('clickable-slot-title');

            // Add click handler
            titleSpan.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const marketUrl = `https://www.torn.com/page.php?sid=ItemMarket#/market/view=search&itemID=${requirement.id}&itemName=${encodeURIComponent(requirement.name)}`;




                // Open in same tab
                window.location.href = marketUrl;

                // Alternative: Open in new tab
                // window.open(marketUrl, '_blank');
            });


        }
    }

    // Wait for crime list to be loaded in DOM
    function waitForCrimeList() {
        return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                // Check if the crime list container exists
                const crimeList = document.querySelector('.tt-oc2-list');
                if (crimeList && crimeList.children.length > 0) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 100);

            // Timeout after 10 seconds
            setTimeout(() => {
                clearInterval(checkInterval);
                resolve();
            }, 10000);
        });
    }

    // Override the fetch function
    window.fetch = function(...args) {
        const [url, options] = args;

        // Check if this is the organized crimes data request
        if (typeof url === 'string' &&
            url.includes('page.php?sid=organizedCrimesData&step=crimeList')) {

            // Call the original fetch
            return originalFetch.apply(this, args).then(async (response) => {
                // Clone the response so we can read it without affecting the original
                const clonedResponse = response.clone();

                try {
                    const data = await clonedResponse.json();

                    // Process the crime data
                    if (data && data.success && data.data) {
                        crimeData = data.data;
                        processOrganizedCrimes(data.data);
                    }
                } catch (error) {

                }

                // Return the original response
                return response;
            });
        }

        // For all other requests, use the original fetch
        return originalFetch.apply(this, args);
    };

    async function processOrganizedCrimes(crimes) {
        // Get player name first
        playerName = getPlayerName();

        if (!playerName) {
            // Wait a bit and try again
            setTimeout(() => {
                playerName = getPlayerName();
                if (playerName) {
                    continueProcessing();
                } else {

                }
            }, 1000);
        } else {
            continueProcessing();
        }

        async function continueProcessing() {


            // Wait for the crime list to be rendered in the DOM
            await waitForCrimeList();

            // Find and return the player card(s)
            const playerCards = findPlayerCrimeWrapper();

            if (playerCards && playerCards.length > 0) {

                playerCards.forEach((card, index) => {

                });

                // Store globally for easy access if needed
                window.playerCrimeCards = playerCards;

            } else {

            }
        }
    }


})();