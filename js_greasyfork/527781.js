// ==UserScript==
// @name         "Make Your Teams" helper ⭐ClopoStars⭐
// @namespace    https://clopostars.com/
// @version      2.3
// @description  Calculates remaining team power based on the first 5 cards and provides extra card info for better strategy. Play smarter, plan ahead, and enjoy the game! Use at your own risk—I’m not responsible for any unexpected issues, data loss, or account problems.
// @author       ChatGPT-4-turbo
// @match        https://clopostars.com/competitions/*
// @match        https://clopostars.com/rivals/*?status=UpComing
// @grant        none
// @license MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/527781/%22Make%20Your%20Teams%22%20helper%20%E2%AD%90ClopoStars%E2%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/527781/%22Make%20Your%20Teams%22%20helper%20%E2%AD%90ClopoStars%E2%AD%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEBUG_MODE = false; // Set to false to disable logs when not debugging

    function observeGameChanges() {
        let cardContainer = document.querySelector(".flex.justify-center.flex-col.lg\\:flex-row, .flex.flex-row.max-w-\\[1536px\\].overflow-x-auto");

        if (!cardContainer) return;

        let cardSlots = Array.from(document.querySelectorAll("div[dnddropzone]")); // ✅ Store slots once

        let observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1 && node.matches("div[dnddropzone]")) {
                        let isFirstFive = cardSlots.indexOf(node) < 5;
                        if (DEBUG_MODE) console.log(`🃏 Card moved to ${isFirstFive ? "first 5 slots" : "deck"}.`);
                        addProfileInfoIcon(node, isFirstFive);

                        if (isFirstFive) {
                            let powerContainer = document.querySelectorAll('div.flex.items-center.mx-auto')[2];
                            if (powerContainer) {
                                if (DEBUG_MODE) console.log("⚡ Power display updated.");
                                updateCustomDisplay(powerContainer);
                            }
                        }
                    }
                });

                mutation.removedNodes.forEach((node) => {
                    if (node.nodeType === 1 && node.matches("div[dnddropzone]")) {
                        let playerIdElement = node.querySelector(".player-id");
                        let removedPlayerId = playerIdElement ? playerIdElement.innerText.trim() : null;

                        setTimeout(() => {
                            let updatedCardList = Array.from(document.querySelectorAll("div[dnddropzone]"));

                            let movedCards = updatedCardList.filter(card => {
                                let playerId = card.querySelector(".player-id")?.innerText.trim();
                                return playerId === removedPlayerId;
                            });

                            if (movedCards.length > 0) {
                                if (DEBUG_MODE) console.log(`♻️ Reapplying green icons to ${movedCards.length} cards moved back to the deck.`);
                                movedCards.forEach(card => addProfileInfoIcon(card, false));
                            }

                            let remainingFirstFive = updatedCardList.slice(0, 5).filter(card => {
                                let playerId = card.querySelector(".player-id")?.innerText.trim();
                                return playerId === removedPlayerId;
                            });

                            if (remainingFirstFive.length > 0) {
                                if (DEBUG_MODE) console.log(`🔄 Ensuring correct alignment for ${remainingFirstFive.length} duplicate(s) in first 5 slots.`);
                                remainingFirstFive.forEach(card => addProfileInfoIcon(card, true));
                            }

                            let powerContainer = document.querySelectorAll('div.flex.items-center.mx-auto')[2];
                            if (powerContainer) {
                                if (DEBUG_MODE) console.log("🔄 Updating power display after card removal...");
                                updateCustomDisplay(powerContainer);
                            }
                        }, 250);
                    }
                });
            });
        });

        observer.observe(cardContainer, { childList: true, subtree: true });
        window.cardMutationObserver = observer;
    }

    function addProfileInfoIcon(card, isFirstFive) {
        let targetContainer = card?.querySelector(".flex.items-center.mt-2.w-full.justify-center, .flex.items-center.mt-2.w-full.justify-evenly");

        if (targetContainer) {
            let existingIcon = targetContainer.querySelector(".profile-info-icon");
            if (existingIcon) {
                existingIcon.remove();
            }

            let playerId = card?.querySelector(".player-id")?.innerText.trim();

            if (playerId) {
                let infoLink = document.createElement("a");
                infoLink.setAttribute("href", `https://erepublik.tools/en/society/citizen/${playerId}`);
                infoLink.setAttribute("target", "_blank");
                infoLink.className = "card-info flex-none rounded-md font-semibold hover:text-gray-400 profile-info-icon";

                infoLink.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#32CD32" class="w-8 h-8">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z">
                    </path>
                </svg>`;

                let infoIcon = infoLink.querySelector("svg");
                infoIcon.addEventListener("mouseenter", () => {
                    infoIcon.setAttribute("stroke", "rgb(156, 163, 175)");
                });
                infoIcon.addEventListener("mouseleave", () => {
                    infoIcon.setAttribute("stroke", "#32CD32");
                });

                if (isFirstFive) {
                    infoLink.style.marginRight = "auto";
                    infoLink.style.display = "flex";
                    infoLink.style.alignItems = "center";
                    targetContainer.style.justifyContent = "flex-start";
                }

                targetContainer.insertBefore(infoLink, targetContainer.firstChild);
            }
        }
    }

    function processAllCards() {
        let cardSlots = document.querySelectorAll("div[dnddropzone]");

        if (cardSlots.length === 0) {
            if (DEBUG_MODE) console.warn("⚠️ No card slots detected. Skipping processAllCards().");
            return;
        }

        let firstFiveSlots = Array.from(cardSlots).slice(0, 5);
        let restSlots = Array.from(cardSlots).slice(5);

        if (DEBUG_MODE) console.log(`🔍 Processing ${cardSlots.length} card slots...`);

        // ✅ Only process the first 5 slots
        firstFiveSlots.forEach(slot => addProfileInfoIcon(slot, true));

        // ✅ Process rest slots but only apply icons if needed
        restSlots.forEach(slot => {
            let hasIcon = slot.querySelector(".profile-info-icon");
            if (!hasIcon) {
                addProfileInfoIcon(slot, false);
            }
        });

        if (DEBUG_MODE) console.log("✅ processAllCards() completed.");
    }


    function waitForFullGameLoad() {
        let attempts = 0;
        let maxAttempts = 10; // Prevent infinite loops

        let checkExist = setInterval(() => {
            let cardContainer = document.querySelector(".flex.justify-center.flex-col.lg\\:flex-row, .flex.flex-row.max-w-\\[1536px\\].overflow-x-auto");
            let cards = document.querySelectorAll("div[dnddropzone]");

            if (cardContainer && cards.length > 0) {
                clearInterval(checkExist);
                processAllCards();
                observeGameChanges();
            }

            attempts++;
            if (attempts >= maxAttempts) {
                clearInterval(checkExist);
                console.warn("⚠️ ClopoStars: Failed to detect game elements after multiple attempts.");
            }
        }, 500);
    }

    function updateCustomDisplay(powerContainer) {
        const currentPowerElement = powerContainer.querySelector('.font-semibold');

        if (currentPowerElement) {
            const currentPower = parseInt(currentPowerElement.textContent.trim());
            const maxPowerMatch = powerContainer.textContent.match(/\/\s*(\d+)/);

            if (maxPowerMatch) {
                const maxPower = parseInt(maxPowerMatch[1]);
                const remainingPower = maxPower - currentPower;
                const resultColor = remainingPower < 0 ? 'red' : 'inherit';

                let customDisplay = document.getElementById('suzi-display');
                if (!customDisplay) {
                    customDisplay = document.createElement('div');
                    customDisplay.id = 'suzi-display';
                    customDisplay.style.display = 'flex';
                    customDisplay.style.alignItems = 'center';
                    customDisplay.style.justifyContent = 'center';
                    customDisplay.style.fontWeight = 'bold';
                    customDisplay.style.whiteSpace = 'nowrap';
                    customDisplay.style.margin = '0';
                    customDisplay.style.padding = '0';
                    customDisplay.style.lineHeight = '1';
                    customDisplay.style.width = '100%';

                    powerContainer.parentElement.insertBefore(customDisplay, powerContainer);
                    powerContainer.style.visibility = 'hidden';
                    powerContainer.style.height = '0';
                    powerContainer.style.margin = '0';
                }

                customDisplay.innerHTML = `
                    <span class="font-semibold">${maxPower}</span>&nbsp;-&nbsp;
                    <span class="font-semibold" style="color: #FF9843;">${currentPower}</span>&nbsp;=&nbsp;
                    <span class="font-semibold" style="color: ${resultColor};">${remainingPower}</span>`;

            }
        }
    }

    function observePowerContainer(retryCount = 0) {
        if (!/^https:\/\/clopostars\.com\/competitions\/\d+$/.test(location.href) && !/^https:\/\/clopostars\.com\/rivals\/\d+\?status=UpComing$/.test(location.href)) {
            console.log("⏹️ Not a valid competition or rivals page, stopping power updates.");
            return;
        }

        const powerContainers = document.querySelectorAll('div.flex.items-center.mx-auto');

        if (powerContainers.length >= 3) {
            updateCustomDisplay(powerContainers[2]);
            console.log("✅ Power display initialized successfully.");
            return;
        }

        if (retryCount < 5) { // Reduced max retries from 15 → 5
            console.log(`🔄 Power container not found, retrying... (${retryCount + 1}/5)`);
            setTimeout(() => observePowerContainer(retryCount + 1), 1000);
        } else {
            console.error("❌ Power display failed after 5 attempts.");
        }
    }


    function startObservationWithDelay() {
        const delay = 1480; // Smart delay of 1.48s
        setTimeout(() => {
            observePowerContainer(); // ✅ Ensure power updates immediately on load
        }, delay);
    }

    function waitForGameElements(callback) {
        let attempts = 0;
        let maxAttempts = 30;

        let checkExist = setInterval(() => {
            let powerContainers = document.querySelectorAll("div.flex.items-center.mx-auto");
            let cardSlots = document.querySelectorAll("div[dnddropzone]");

            if (powerContainers.length >= 3 && cardSlots.length > 0) {
                clearInterval(checkExist);
                if (!window.elementsDetectedOnce) {
                    console.log("✅ All required elements detected. Running script...");
                    window.elementsDetectedOnce = true;
                }

                if (!window.initializationDone) {
                    console.log("✅ Running initialization...");
                    callback();

                    setTimeout(() => {
                        if (!!window.cardMutationObserver && typeof updateCustomDisplay === "function") {
                            console.log("✅ Initialization confirmed successful.");
                            window.initializationDone = true;
                        } else {
                            console.warn("⚠️ Initialization failed. Retrying...");
                            window.initializationDone = false;
                            observePowerContainer(); // Force reattempt
                            observeGameChanges(); // Ensure it starts
                        }
                    }, 2000);
                }
            }

            attempts++;
            if (attempts >= maxAttempts) {
                clearInterval(checkExist);
                console.warn("⚠️ ClopoStars: Failed to detect required elements after multiple attempts.");
            }
        }, 500);
    }

    function initializeAllFeatures() {
        console.log("🔄 Ensuring all features initialize correctly...");
        waitForGameElements(() => {
            console.log("🔄 Running initialization...");
            processAllCards(); // Ensures all cards get profile info links
            observePowerContainer(); // Ensures power updates on page load
            observeGameChanges(); // ✅ FIX: Ensures card movements are tracked immediately
        });
    }

    function observeUrlChanges() {
        let lastUrl = window.location.href;

        setInterval(() => {
            let currentUrl = window.location.href;

            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;

                if (DEBUG_MODE) console.log(`🔗 URL changed to ${currentUrl}, reloading power display...`);

                // ✅ Only restart the script when switching to a new competition page
                if (/https:\/\/clopostars\.com\/competitions\/\d+/.test(currentUrl)) {
                    if (DEBUG_MODE) console.log("✅ Detected valid competition page. Restarting features...");
                    initializeAllFeatures();
                }
            }
        }, 1000); // ✅ Check every second, preventing unnecessary re-executions
    }


    // ✅ Ensures all game features are initialized properly
    initializeAllFeatures();

    // ✅ Starts observing URL changes to detect competition navigation
    observeUrlChanges();

})();