// ==UserScript==
// @name         Manarion - Codex Donation Counter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a button to count Codex donations for the current month from the guild activity log.
// @author       EaZZyHK
// @match        https://manarion.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539043/Manarion%20-%20Codex%20Donation%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/539043/Manarion%20-%20Codex%20Donation%20Counter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * This is the core logic of the script. It runs when the user clicks the button.
     */
    async function runDonationCounter() {
        // --- Configuration ---
        const LOG_ENTRY_SELECTOR = 'div.space-x-1.text-sm.leading-4';
        const WAIT_TIME_MS = 1500;

        console.log("Starting Codex donation counter script...");

        // --- Helper functions ---
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        function setReactInputValue(inputElement, value) {
            const valueSetter = Object.getOwnPropertyDescriptor(inputElement, 'value')?.set;
            const prototype = Object.getPrototypeOf(inputElement);
            const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;

            if (valueSetter && valueSetter !== prototypeValueSetter) {
                prototypeValueSetter.call(inputElement, value);
            } else {
                inputElement.value = value;
            }
            inputElement.dispatchEvent(new Event('input', { bubbles: true }));
            inputElement.dispatchEvent(new Event('change', { bubbles: true }));
            inputElement.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, cancelable: true }));
        }

        function extractNicknames() {
            let players = new Map();
            try {
                manarion.guild.Roster.forEach(player => {
                    players.set(player.Name, 0);
                });
                console.log(`Successfully loaded ${players.size} players from the guild roster.`);
            } catch (error) {
                console.error("Could not extract nicknames from 'manarion.guild.Roster'.", error);
            }
            return players;
        }

        // --- 1. Pre-computation: Filter logs by searching ---
        try {
            console.log("Filtering logs for 'donated codex'...");
            const searchInput = document.querySelector('input[placeholder="Search text"]');
            const searchButton = [...document.querySelectorAll('button')].find(btn => btn.innerText.trim() === 'Search');

            if (!searchInput || !searchButton) throw new Error("Could not find the search input or search button.");

            setReactInputValue(searchInput, "donated codex");
            searchButton.click();

            console.log("Waiting for search results to load...");
            await sleep(WAIT_TIME_MS * 1.5);
        } catch (error) {
            console.warn("Could not perform automatic search. Proceeding without filtering.", error.message);
        }

        // --- 2. Initialization for Counting ---
        const donationMap = extractNicknames();
        if (donationMap.size === 0) {
            console.log("Stopping script because no players were found in the roster.");
            return;
        }

        const nameLookup = new Map();
        donationMap.forEach((value, key) => nameLookup.set(key.toLowerCase(), key));

        const processedElements = new Set();
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const DATE_REGEX = /(\d{1,2})\.(\d{1,2})\.(\d{4})/;

        // --- 3. Load and Process Logs Incrementally ---
        while (true) {
            const allCurrentLogs = document.querySelectorAll(LOG_ENTRY_SELECTOR);
            allCurrentLogs.forEach(logEntry => {
                if (!processedElements.has(logEntry)) {
                    processedElements.add(logEntry);
                    const logText = logEntry.textContent.trim();
                    const dateMatch = logText.match(DATE_REGEX);
                    if (dateMatch && parseInt(dateMatch[3], 10) === currentYear && parseInt(dateMatch[2], 10) - 1 === currentMonth) {
                        const donationMatch = logText.match(/([a-zA-Z]\w*)\s+donated\s+(\d+)\s+\[Codex\]/);
                        if (donationMatch) {
                            const rosterNickname = nameLookup.get(donationMatch[1].toLowerCase());
                            if (rosterNickname) {
                                const amount = parseInt(donationMatch[2], 10);
                                donationMap.set(rosterNickname, (donationMap.get(rosterNickname) || 0) + amount);
                            }
                        }
                    }
                }
            });

            const lastLogElement = allCurrentLogs[allCurrentLogs.length - 1];
            if (lastLogElement) {
                const lastLogText = lastLogElement.textContent;
                const lastDateMatch = lastLogText.match(DATE_REGEX);
                if (lastDateMatch) {
                    const month = parseInt(lastDateMatch[2], 10) - 1;
                    const year = parseInt(lastDateMatch[3], 10);
                    if (year < currentYear || (year === currentYear && month < currentMonth)) {
                        console.log("Reached logs from a previous month.");
                        break;
                    }
                }
            }

            const loadMoreButton = [...document.querySelectorAll('button')].find(btn => btn.innerText.trim() === 'Load More');
            if (!loadMoreButton || !loadMoreButton.offsetParent || loadMoreButton.disabled) {
                console.log("'Load More' button not found/hidden/disabled. Processing complete.");
                break;
            }

            console.log("Clicking 'Load More'...");
            loadMoreButton.click();
            await sleep(WAIT_TIME_MS);
        }

        // --- 4. Display Results ---
        console.log("\n\n========================================");
        console.log("Codex Donations This Month");
        console.log("========================================");
        const sortedDonations = [...donationMap.entries()].sort((a, b) => b[1] - a[1]);
        sortedDonations.forEach(([nickname, total]) => console.log(`- ${nickname}: ${total} Codex`));
        console.log("========================================");
        console.log("Script finished.");
    }

    /**
     * This function creates the button and adds it to the page using a safe "wrapper" method.
     */
    function createCounterButton() {
        const targetH1 = document.querySelector('h1.text-2xl');
        const originalParent = targetH1?.parentElement;

        if (!targetH1 || !originalParent) return;

        if (document.getElementById('codex-counter-button')) return;

        const headerWrapper = document.createElement('div');
        headerWrapper.style.display = 'flex';
        headerWrapper.style.justifyContent = 'space-between';
        headerWrapper.style.alignItems = 'center';
        headerWrapper.style.width = '100%';
        headerWrapper.style.marginBottom = '1rem';
        headerWrapper.style.marginTop = '1rem';

        originalParent.insertBefore(headerWrapper, targetH1);
        headerWrapper.appendChild(targetH1);

        const counterButton = document.createElement('button');
        counterButton.id = 'codex-counter-button';
        counterButton.textContent = 'Count Monthly Codex';
        counterButton.className = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 cursor-pointer h-9 px-4 py-2';

        counterButton.addEventListener('click', async () => {
            counterButton.disabled = true;
            counterButton.textContent = 'Counting...';
            try {
                await runDonationCounter();
            } catch (error) {
                console.error("An error occurred during the counting process:", error);
            } finally {
                counterButton.disabled = false;
                counterButton.textContent = 'Count Monthly Codex';
            }
        });

        headerWrapper.appendChild(counterButton);
    }

    // Use a MutationObserver to robustly handle dynamic page loads
    const observer = new MutationObserver((mutations, obs) => {
        if (document.querySelector('h1.text-2xl')) {
            createCounterButton();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();