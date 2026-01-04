// ==UserScript==
// @name         GOG Owned Games Highlighter for GameSieve
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Highlights games on GameSieve that are owned on GOG
// @author       shakeyourbunny
// @license      MIT
// @match        https://gamesieve.com/*
// @grant        GM.xmlHttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @connect      gog.com
// @downloadURL https://update.greasyfork.org/scripts/538693/GOG%20Owned%20Games%20Highlighter%20for%20GameSieve.user.js
// @updateURL https://update.greasyfork.org/scripts/538693/GOG%20Owned%20Games%20Highlighter%20for%20GameSieve.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const DEBUG = false; // Set to true to enable detailed console logging
    const OWNED_GAMES_TTL = 60 * 60 * 1000; // 1 hour in milliseconds
    const HIGHLIGHT_COLOR = '#bc9aca'; // GOG color

    // Logging function
    const log = (message, forceLog = false) => {
        if (DEBUG || forceLog) {
            console.log(`[GOG Highlighter] ${message}`);
        }
    };

    // Error logging function (always shown)
    const error = (message) => {
        console.error(`[GOG Highlighter ERROR] ${message}`);
    };

    // Function to fetch owned games from GOG
    const fetchOwnedGames = async () => {
        log('Fetching owned games from GOG');

        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: 'GET',
                url: 'https://www.gog.com/user/data/games',
                onload: function(response) {
                    // Check if we got a redirect (not logged in)
                    if (response.finalUrl !== 'https://www.gog.com/user/data/games') {
                        error('You are not logged into GOG. Please log in to see owned games.');
                        reject('Not logged in');
                        return;
                    }

                    try {
                        const data = JSON.parse(response.responseText);
                        if (data && data.owned && data.owned.length > 0) {
                            log(`Found ${data.owned.length} owned games`, true);
                            resolve(data.owned);
                        } else {
                            error('No owned games found or invalid response format');
                            reject('No owned games');
                        }
                    } catch (e) {
                        error(`Failed to parse GOG response: ${e.message}`);
                        reject(e);
                    }
                },
                onerror: function(response) {
                    error(`Failed to fetch owned games: ${response.statusText}`);
                    reject(response.statusText);
                }
            });
        });
    };

    // Cache management functions
    const saveOwnedGames = async (games) => {
        await GM.setValue('ownedGames', games);
        await GM.setValue('ownedGamesTimestamp', Date.now());
        log(`Saved ${games.length} owned games to cache`);
    };

    const getOwnedGames = async () => {
        const games = await GM.getValue('ownedGames', null);
        const timestamp = await GM.getValue('ownedGamesTimestamp', 0);
        const isExpired = Date.now() - timestamp > OWNED_GAMES_TTL;

        if (!games || isExpired) {
            log('Owned games cache expired or not found, fetching fresh data');
            try {
                const freshGames = await fetchOwnedGames();
                await saveOwnedGames(freshGames);
                return freshGames;
            } catch (e) {
                log(`Error fetching fresh owned games: ${e}`, true);
                if (games) {
                    log('Using expired cache as fallback', true);
                    return games;
                }
                return [];
            }
        }

        log(`Using cached owned games (${games.length} games)`);
        return games;
    };

    // Function to highlight owned games on GameSieve
    const highlightOwnedGames = async () => {
        log('Starting highlighting process', true);

        try {
            const ownedIds = await getOwnedGames();
            if (ownedIds.length === 0) {
                log('No owned games found to highlight', true);
                return;
            }

            // Convert owned IDs to a Set for fast lookup
            const ownedIdsSet = new Set(ownedIds.map(id => id.toString()));

            // Select game list on gamesieve.com
            const gameList = document.querySelector('body > main > article.main > ol');
            if (!gameList) {
                log('Game list not found on page', true);
                return;
            }

            // Process each game in the list
            const gameItems = gameList.querySelectorAll('li[id]');
            let highlightedCount = 0;

            gameItems.forEach(item => {
                const gogId = item.getAttribute('id');
                if (!gogId) return;

                // If the game is owned, highlight it
                if (ownedIdsSet.has(gogId)) {
                    item.style.backgroundColor = HIGHLIGHT_COLOR;
                    highlightedCount++;
                    
                    // Add a visual indicator to the game title for accessibility
                    const titleElement = item.querySelector('h3 .title');
                    if (titleElement && !titleElement.textContent.includes(' ✓')) {
                        titleElement.textContent += ' ✓';
                    }
                }
            });

            log(`Highlighted ${highlightedCount} owned games out of ${gameItems.length} games on page`, true);
        } catch (e) {
            error(`Failed to highlight games: ${e.message}`);
        }
    };

    // Function to observe DOM changes for dynamic content loading
    const observePageChanges = () => {
        const observer = new MutationObserver((mutations) => {
            let shouldRecheck = false;
            
            mutations.forEach((mutation) => {
                // Check if new game items were added
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Check if it's a game item or contains game items
                            if (node.tagName === 'LI' && node.hasAttribute('id')) {
                                shouldRecheck = true;
                            } else if (node.querySelector && node.querySelector('li[id]')) {
                                shouldRecheck = true;
                            }
                        }
                    });
                }
            });
            
            if (shouldRecheck) {
                log('New content detected, re-highlighting games');
                setTimeout(highlightOwnedGames, 100); // Small delay to ensure DOM is settled
            }
        });

        // Observe the main content area for changes
        const mainContent = document.querySelector('body > main');
        if (mainContent) {
            observer.observe(mainContent, {
                childList: true,
                subtree: true
            });
            log('Started observing page changes');
        }

        return observer;
    };

    // Initialize the script
    const initialize = () => {
        log('Script started', true);
        highlightOwnedGames();
        observePageChanges();
    };

    // Run when the page is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        // Page is already loaded
        initialize();
    }
})();
