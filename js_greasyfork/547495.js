// ==UserScript==
// @name         Fake Daily Wordle from the Wordle Archive
// @namespace    https://github.com/amitmadnawat
// @version      1.0.0
// @description  Makes Wordle archive puzzles look like today's official daily puzzle (with correct styling, puzzle number, and your current stats)
// @author       Amit Madnawat
// @license      MIT
// @match        https://www.nytimes.com/games/wordle/*
// @exclude      https://www.nytimes.com/games/wordle/index.html
// @icon         https://www.nytimes.com/games-assets/v2/assets/wordle/page-icons/Wordle-Icon-np.svg
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547495/Fake%20Daily%20Wordle%20from%20the%20Wordle%20Archive.user.js
// @updateURL https://update.greasyfork.org/scripts/547495/Fake%20Daily%20Wordle%20from%20the%20Wordle%20Archive.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Remove archive-specific elements
    const removeSelectors = [
        "header", // top nav
        ".pz-header", // archive header
        ".pz-nav", // archive navigation bar
        ".pz-day-selector", // date dropdown
        "footer" // footer
    ];
    removeSelectors.forEach(sel => {
       document.querySelectorAll(sel).forEach(el => el.remove());
    });

    // Tweak page background to match daily
    document.body.style.backgroundColor = "#121213";
    document.body.style.overflow = "hidden"; // hides weird scrollbars

    // Flags
    let statsModalOpened = false;
    let streakIncremented = false;

    // Force grid area to center like daily
    const game = document.querySelector("#wordle-app-game");
    if (game) {
        game.style.margin = "0 auto";
        game.style.maxWidth = "500px";
    }

   // ---------------- DYNAMIC PUZZLE NUMBER ----------------
    const epoch = new Date("2021-06-19T00:00:00Z"); // Wordle #0
    const today = new Date();
    const diffDays = Math.floor((today - epoch) / (1000 * 60 * 60 * 24));
    const fakePuzzleNumber = diffDays + 1;
    const fakeDate = today.toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric"
    });

    // ---------------- HELPERS ----------------
    function updateHeader() {
        const header = document.querySelector('h1[data-testid="title"]');
        if (header) header.textContent = `Wordle`;
    }

    function updateTitle() {
        document.title = `Wordle ${fakePuzzleNumber} - The New York Times`;
    }

    function updateWelcomeMetaNumber() {
    const meta = document.querySelector('[class^="Welcome-module_wordleMeta"]');
    if (meta) meta.textContent = `No. ${fakePuzzleNumber}`;
}

    function updateSettingsFooter() {
        const footer = document.querySelector('p[aria-label="game number"]');
        if (footer) footer.textContent = `#${fakePuzzleNumber}`;
    }

    function cleanUpArchiveUI() {
        const archiveHeader = document.querySelector('[data-testid="game-date"]');
        if (archiveHeader) archiveHeader.remove();
    }

    function updateBotLinkContent() {
        const botDiv = document.querySelector('[class^="BotLinkCTA-module_botLinkContent"]');
        if (botDiv) {
            botDiv.innerHTML = `
            <p>
                Wordle Bot gives an analysis of your guesses.<br>
                <span class="BotLinkCTA-module_botLinkHref__hUzmT">
                    Did you beat the bot? ›
                </span>
            </p>
        `;
        }
    }

    function removeArchiveElements() {
        const nextCTA = document.querySelector('[data-testid="nextGameCta"]');
        const playArchiveCTA = document.querySelector('[class^="ArchiveAdmireButtons-module_archiveAdmireButton"][href^="/games/wordle/archive/"]');
        const playArchiveCTAContainer = document.querySelector('[class^="Welcome-module_buttonContainer"]');
        const resultsContainer = document.querySelector('[class^="ArchiveCongrats-module_mainContent"]');
        if (nextCTA) nextCTA.remove();
        if (playArchiveCTA) {
            playArchiveCTA.remove();
        }
        if (playArchiveCTAContainer) {
            const link = playArchiveCTAContainer.querySelector('a');
            if (link) link.remove();
        }
        if (resultsContainer) {
            const solvedInText = resultsContainer.querySelector('h3');
            if (solvedInText) solvedInText.remove();
        }
    }

    // ---------------- Open/Close Stats Modal Once ----------------
    function openAndCloseStatsOnce() {
        if (statsModalOpened) return; // only run once

        setTimeout(() => {
            statsModalOpened = true;
            // Do not run if modal was already opened manually
            const closeButtonContainer = document.querySelector('[class^="Close-module_closeButton"]');
            if (closeButtonContainer) {
                injectStatsDistribution();
                return;
            }

            const statsButton = document.querySelector('[data-testid="stats-button"]');
            const portalContent = document.querySelector('.portal-content');
            if (!statsButton || !portalContent) return;

            // Open stats modal
            statsButton.click();
            setTimeout(() => {
                // Click the close button
                const closeButtonContainer = document.querySelector('[class^="Close-module_closeButton"]');
                if (closeButtonContainer) {
                    const closeButton = closeButtonContainer.querySelector('button');
                    injectStatsDistribution();
                    if (closeButton) closeButton.click();
                }
            }, 10); // slight delay to ensure modal renders before closing
        }, 15000); // delay before opening to ensure page load
    }

    // ---------------- Inject the Guess distribution stats on the results page ----------------
    function injectStatsDistribution() {
        const interval = setInterval(() => {
            // Get the target container in the results page
            const targetWrapper = document.querySelector('[class^="ArchiveCongrats-module_archiveStatsWrapper"]');
            if (!targetWrapper) return;

            // Get the source stats distribution from archive
            const sourceStatsContainer = document.querySelector('[class^="Stats-module_statsContainer"]');
            if (!sourceStatsContainer) return;

            const sourceGraphTitle = sourceStatsContainer.querySelector('div[class^="Stats-module_statsBtnLeft"]');
            if (!sourceGraphTitle) return;

            const sourceGraph = sourceStatsContainer.querySelector('div[class^="Stats-module_guessDistribution"]');
            if (!sourceGraph) return;

            // Check if already injected
            if (targetWrapper.querySelector('div[class^="Stats-module_guessDistribution"]')) {
                clearInterval(interval);
                return;
            }

            // Clone the stats div
            const clonedGraphTitle = sourceGraphTitle.cloneNode(true);
            const clonedGraph = sourceGraph.cloneNode(true);

            // Insert after the wrapper
            targetWrapper.insertAdjacentElement('afterend', clonedGraph);
            targetWrapper.insertAdjacentElement('afterend', clonedGraphTitle);

            // Add a margin to the title
            const statsTitle = document.querySelector('p[class^="ArchiveCongrats-module_statisticsHeading"]');
            if (statsTitle) {
                statsTitle.style.marginLeft = "20px";
            }

            // Bump up the streak count
            incrementStreak();

            // Stop polling after injection
            clearInterval(interval);
        }, 100); // poll every 100ms until the target exists
    }

    function incrementStreak() {
        if (streakIncremented) return;

        const statsList = document.querySelector('ul[class^="Stats-module_statistics"]');
        if (!statsList) return;

        const streakItem = statsList.querySelectorAll('li')[2];
        if (!streakItem) return;

        const streakCountElement = streakItem.querySelector('[class^="Stats-module_statistic"]');
        if (!streakCountElement) return;

        const currentValue = parseInt(streakCountElement.textContent.trim(), 10);
        if (!isNaN(currentValue)) {
            streakIncremented = true;
            streakCountElement.textContent = currentValue + 1;

            // Disconnecting the mutation observer
            observer.disconnect();
        }
    }

    function updateAll() {
        updateHeader();
        updateTitle();
        updateWelcomeMetaNumber();
        updateSettingsFooter();
        cleanUpArchiveUI();
        updateBotLinkContent();
        removeArchiveElements();
    }

    // ---------------- DEBOUNCED MUTATION OBSERVER ----------------
    // Wordle dynamically injects elements after page load. Debounced updates prevent frequent callbacks from crashing the page.
    let rafScheduled = false;
    const observer = new MutationObserver(() => {
        if (!rafScheduled) {
            rafScheduled = true;
            window.requestAnimationFrame(() => {
                rafScheduled = false;
                updateAll(); // call all updates in one
            });
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // ---------------- FALLBACK POLLING ----------------
    // Some elements may appear very late. Polling ensures they are patched reliably.
    const interval = setInterval(() => {
        const header = document.querySelector('h1[data-testid="title"]');
        if (header) {
            updateAll(); // call all updates in one
            clearInterval(interval);
        }
    }, 400);

    // ---------------- INITIAL RUN ----------------
    updateAll();
    openAndCloseStatsOnce();

    console.log("Archive Wordle page now looks like the Daily Wordle");
})();
