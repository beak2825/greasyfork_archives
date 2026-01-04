// ==UserScript==
// @name         Nitro Type Auto Invite
// @namespace    https://www.nitrotype.com/
// @version      2.8.3
// @description  Automatically invites users to your team or adds as friend after a race
// @author       Isaac Weber
// @match        https://www.nitrotype.com/race/*
// @match        https://www.nitrotype.com/race
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529248/Nitro%20Type%20Auto%20Invite.user.js
// @updateURL https://update.greasyfork.org/scripts/529248/Nitro%20Type%20Auto%20Invite.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Simple configuration
    const config = {
        minDelay: 100,
        maxDelay: 200,
        debug: true,
        checkInterval: 200,
        startupDelay: 250
    };

    // Processed players tracking
    const processed = new Set();

    // Track if processing has started to avoid duplicate detection
    let processingStarted = false;

    // Helper functions
    function log(message) {
        if (config.debug) console.log(`[Team Inviter] ${message}`);
    }

    function randomDelay() {
        return Math.floor(Math.random() * (config.maxDelay - config.minDelay + 1)) + config.minDelay;
    }

    // Find player rows using various selectors
    function findPlayerRows() {
        const selectors = [
            '.player-row',
            '[class*="player-container"]',
            '[class*="racer"]',
            '[id*="racer"]',
            '[id*="player"]',
            '[class*="player"]',
            '.race-results-player'
        ];

        for (const selector of selectors) {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                log(`Found ${elements.length} players using selector: ${selector}`);
                return Array.from(elements);
            }
        }

        log("No players found");
        return [];
    }

    // Reliable hover simulation
    function simulateHover(element) {
        try {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + (rect.width / 2);
            const centerY = rect.top + (rect.height / 2);

            // Clear existing hovers
            document.dispatchEvent(new MouseEvent('mouseout', {
                bubbles: true,
                cancelable: true
            }));

            // Hover events
            element.dispatchEvent(new MouseEvent('mouseenter', {
                bubbles: true,
                cancelable: true,
                clientX: centerX,
                clientY: centerY
            }));

            element.dispatchEvent(new MouseEvent('mouseover', {
                bubbles: true,
                cancelable: true,
                clientX: centerX,
                clientY: centerY
            }));

            return true;
        } catch (e) {
            log(`Hover error: ${e.message}`);
            return false;
        }
    }

    // Find and click relevant buttons
    function findAndClickButtons() {
        try {
            // Team invite button by text
            const inviteButtons = Array.from(document.querySelectorAll('a, button, .btn, [role="button"], div[class*="button"]'))
                .filter(el => {
                    const text = (el.textContent || '').toLowerCase();
                    const isVisible = el.offsetParent !== null;
                    return isVisible && text.includes('invite') && text.includes('team');
                });

            if (inviteButtons.length > 0) {
                log("Clicking team invite button");
                inviteButtons[0].click();
                return true;
            }

            // Team invite button by class
            const specificButton = document.querySelector('a[class*="invite-team"], a[class*="team-invite"], [class*="invite-to-team"]');
            if (specificButton && specificButton.offsetParent !== null) {
                log("Clicking invite button by class");
                specificButton.click();
                return true;
            }

            // Add friend button
            const friendButtons = Array.from(document.querySelectorAll('a, button, .btn, [role="button"], div[class*="button"]'))
                .filter(el => {
                    const text = (el.textContent || '').toLowerCase();
                    const isVisible = el.offsetParent !== null;
                    return isVisible && text.includes('add') && text.includes('friend');
                });

            if (friendButtons.length > 0) {
                log("Clicking Add Friend button");
                friendButtons[0].click();
                return true;
            }

            log("No buttons found");
            return false;
        } catch (e) {
            log(`Button error: ${e.message}`);
            return false;
        }
    }

    // Process players sequentially
    function processPlayers(players) {
        let currentIndex = 0;

        function processNext() {
            // Check if we're done
            if (currentIndex >= players.length) {
                log("Finished processing all players");
                setTimeout(() => window.location.reload(), randomDelay());
                return;
            }

            const player = players[currentIndex];

            // Skip if already processed
            if (processed.has(player)) {
                currentIndex++;
                processNext();
                return;
            }

            log(`Processing player ${currentIndex + 1} of ${players.length}`);
            processed.add(player);

            // Hover over player
            if (simulateHover(player)) {
                // Check for buttons after hover with a short delay using the existing checkInterval
                setTimeout(() => {
                    const buttonFound = findAndClickButtons();

                    // Move to next player
                    currentIndex++;

                    // If button was found, apply the full delay
                    // If no button was found, move to the next player immediately
                    if (buttonFound) {
                        setTimeout(processNext, randomDelay());
                    } else {
                        setTimeout(processNext, 20); // tiny delay when no button's found
                    }
                }, randomDelay); // Use randomDelay
            } else {
                // If hover failed, move to next without extra delay
                currentIndex++;
                setTimeout(processNext, randomDelay());
            }
        }

        // Start processing
        processNext();
    }

    // Enhanced race completion detection
    function detectRaceCompletion() {
        return (
            document.querySelector(".raceResults") ||
            document.querySelector("[class*='race-results']") ||
            document.querySelector(".race-results-container") ||
            document.querySelector("[class*='finished']") ||
            document.querySelector("[class*='complete']") ||
            document.querySelector("[class*='raceOver']") ||
            (document.querySelector("[class*='race-stats']") && document.querySelectorAll("[class*='player']").length > 1)
        );
    }

    // Early race detection with simplified approach
    function monitorRace() {
        // Variables to track race state
        let raceInProgress = false;
        let raceCheckInterval = null;

        // Function to detect race activity
        function checkRaceActivity() {
            // Indicators that a race is in progress
            const raceActive =
                document.querySelector("[class*='race-stats']") ||
                document.querySelector("[class*='racer-progress']") ||
                document.querySelector("[class*='typing-input']") ||
                document.querySelector("input[type='text'][class*='race']");

            // If race wasn't in progress before but is now, mark it as started
            if (!raceInProgress && raceActive) {
                log("Race started");
                raceInProgress = true;
            }

            // If race was in progress but is no longer active, it just ended
            else if (raceInProgress && !raceActive) {
                log("Race just ended - checking for results");
                raceInProgress = false;

                // Race just ended - immediately check for results
                if (!processingStarted) {
                    processingStarted = true;
                    clearInterval(raceCheckInterval);

                    // Allow a brief moment for UI to update
                    setTimeout(() => {
                        startTeamInviter();
                    }, 300);
                }
            }
        }

        // Start monitoring for race activity
        raceCheckInterval = setInterval(checkRaceActivity, 250);

        // Also start the normal results detection as a backup
        checkForRaceResults();
    }

    // Start the team inviter process
    function startTeamInviter() {
        log("Starting team inviter process");

        // Wait a moment for UI to stabilize
        setTimeout(() => {
            // First check if race is complete
            if (detectRaceCompletion()) {
                log("Race completion confirmed");

                // Find players to process
                const players = findPlayerRows();
                if (players.length > 0) {
                    log(`Found ${players.length} players to process`);
                    processPlayers(players);
                } else {
                    log("No players found, trying again in 500ms");

                    // Try again after a short delay
                    setTimeout(() => {
                        const playersRetry = findPlayerRows();
                        if (playersRetry.length > 0) {
                            processPlayers(playersRetry);
                        } else {
                            log("Still no players found, reloading page");
                            window.location.reload();
                        }
                    }, 500);
                }
            } else {
                log("Race not complete yet, waiting for race results");
                // If no race completion found, fall back to normal detection
                processingStarted = false;
            }
        }, config.startupDelay);
    }

    // Original check for race results - kept as fallback
    function checkForRaceResults() {
        let hasChecked = false;

        const interval = setInterval(() => {
            if (hasChecked || processingStarted) {
                clearInterval(interval);
                return;
            }

            const raceComplete = detectRaceCompletion();

            if (raceComplete) {
                log("Race results detected through fallback method");
                hasChecked = true;
                processingStarted = true;
                clearInterval(interval);

                // Wait for UI to stabilize
                setTimeout(() => {
                    const players = findPlayerRows();
                    if (players.length > 0) {
                        processPlayers(players);
                    } else {
                        log("No players found, reloading");
                        window.location.reload();
                    }
                }, 500);
            }
        }, config.checkInterval);

        // Safety timeout
        setTimeout(() => {
            if (!hasChecked && !processingStarted) {
                log("Safety reload triggered");
                window.location.reload();
            }
        }, 600000);
    }

    // Initialize
    function init() {
        log("Team Inviter initialized");
        processingStarted = false;

        // Start monitoring for race completion
        monitorRace();
    }

    // Start when page is ready
    if (document.readyState !== "loading") {
        setTimeout(init, 300);
    } else {
        document.addEventListener("DOMContentLoaded", () => setTimeout(init, 300));
    }
})();