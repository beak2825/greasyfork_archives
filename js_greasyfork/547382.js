// ==UserScript==
// @name         Puzzmo Crossword Navigator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Navigate to most recent incomplete crossword
// @author       Michael Abon
// @match        https://www.puzzmo.com/*
// @grant        none
// @esversion    8
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547382/Puzzmo%20Crossword%20Navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/547382/Puzzmo%20Crossword%20Navigator.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    function createButton(id = 'crossword-nav-btn') {
        const button = document.createElement('button');
        button.id = id;
        button.textContent = 'Go to Latest Incomplete Crossword';
        button.style.cssText = `
            padding: 0.25rem 1.5rem;
            width: 100%;
            background: var(--theme-player);
            color: var(--theme-playerFG);
            border: none;
            border-radius: 0.300rem;
            font-size: 13px;
            cursor: pointer;
            transition: background 0.2s;
            font-family: "Poppins-SemiBold", "Poppins SemiBold", "Poppins";
        `;
        
        button.addEventListener('click', navigateToLatestCrossword);
        return button;
    }
    
    function injectButton() {
        const todayIntro = document.getElementById('today-intro');
        if (!todayIntro || document.getElementById('crossword-nav-btn')) return;
        
        const button = createButton();
                
        // Insert before the target element
        const container = document.createElement('div');
        container.style.cssText = `
            margin-top: 1rem;
            display: flex;
            justify-content: flex-start;
        `;
        container.appendChild(button);
        todayIntro.parentNode.insertBefore(container, todayIntro);
    }
    
    function injectButtonInSidebar() {
        // Look for the specific link in the puzzle complete sidebar with "More puzzles" text
        const targetLinks = document.querySelectorAll('a[aria-label="Go to [object Object]"][href^="/today"]');
        const targetLink = Array.from(targetLinks).find(link => link.innerText.trim() === 'More puzzles');
        
        if (!targetLink || document.getElementById('crossword-nav-btn-sidebar')) return;
        
        const button = createButton('crossword-nav-btn-sidebar');
        
        // Create container for the button - this will be a sibling of the parent with onclick
        const container = document.createElement('div');
        container.style.cssText = `
            margin-bottom: 12px;
            display: flex;
            justify-content: flex-start;
        `;
        container.appendChild(button);
        
        // Get the parent with onclick and its parent (grandparent)
        const parentWithOnClick = targetLink.parentElement;
        const grandparent = parentWithOnClick.parentElement;
        
        if (grandparent) {
            // Insert our container before the parent with onclick
            grandparent.insertBefore(container, parentWithOnClick);
        }
    }
    
    function getAuthData() {
        try {
            const puzmoAuth = localStorage.getItem('puzmoAuth');
            if (!puzmoAuth) {
                throw new Error('No puzmoAuth found in localStorage');
            }
            
            const authData = JSON.parse(puzmoAuth);
            return {
                token: authData.token,
                userID: authData.data.userID
            };
        } catch (error) {
            console.error('Failed to parse auth data:', error);
            return null;
        }
    }
    
    async function getAuthHeaders() {
        const authData = getAuthData();
        if (!authData) {
            throw new Error('Could not retrieve authentication data');
        }
        
        return {
            'Accept': '*/*',
            'Accept-Language': 'en-CA,en-US;q=0.7,en;q=0.3',
            'auth-provider': 'custom',
            'authorization': `Bearer ${authData.token}`,
            'puzzmo-gameplay-id': authData.userID,
            'runtime': 'web',
            'Content-Type': 'application/json',
            'Origin': 'https://www.puzzmo.com',
            'Referer': window.location.href
        };
    }
    
    async function fetchCalendarData(month, year) {
        const query = `
            query CalendarQuery(
              $month: Int!
              $year: Int!
              $gameFilter: String
            ) {
              dailiesForAMonth(month: $month, year: $year, gameFilter: $gameFilter) {
                day
                puzzles(cacheKey: "calendar") {
                  series {
                    id
                  }
                  lock {
                    start
                    type
                    overrideRoles
                  }
                  status
                  urlPath
                  puzzle {
                    id
                    slug
                    name
                    emoji
                    variantID
                    subvariantID
                    seriesNumber
                    game {
                      slug
                      displayName
                      flagsArr
                      id
                    }
                    gameNameOverride
                    currentAccountGamePlayed {
                      slug
                      completed
                      pointsAwarded
                      id
                    }
                  }
                  id
                }
                id
              }
            }`;
        
        const headers = await getAuthHeaders();
        
        try {
            const response = await fetch('https://www.puzzmo.com/_api/prod/graphql?CalendarQuery=', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    query,
                    operationName: 'CalendarQuery',
                    variables: {
                        month,
                        year,
                        gameFilter: null
                    }
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch calendar data:', error);
            return null;
        }
    }
    
    function findIncompleteCrosswords(calendarData) {
        if (!calendarData?.data?.dailiesForAMonth) return [];
        
        const incompleteCrosswords = [];
        
        calendarData.data.dailiesForAMonth.forEach(daily => {
            if (!daily.puzzles) return;
            
            daily.puzzles.forEach(puzzleEntry => {
                const puzzle = puzzleEntry.puzzle;
                
                // Check if it's a crossword game
                if (puzzle?.game?.slug === 'crossword') {
                    const gamePlay = puzzle.currentAccountGamePlayed;
                    
                    // Check if incomplete (null gamePlay or completed: false)
                    if (!gamePlay || !gamePlay.completed) {
                        incompleteCrosswords.push({
                            day: daily.day,
                            urlPath: puzzleEntry.urlPath,
                            name: puzzle.name || puzzle.gameNameOverride || 'Crossword',
                            emoji: puzzle.emoji || '📝',
                            seriesNumber: puzzle.seriesNumber
                        });
                    }
                }
            });
        });
        
        // Sort by seriesNumber (most recent first - higher numbers are newer)
        return incompleteCrosswords.sort((a, b) => b.seriesNumber - a.seriesNumber);
    }
    
    async function navigateToLatestCrossword() {
        const button = document.getElementById('crossword-nav-btn') || document.getElementById('crossword-nav-btn-sidebar');
        const originalText = button.textContent;
        
        button.textContent = 'Searching...';
        button.disabled = true;
        
        try {
            const now = new Date();
            let currentMonth = now.getMonth(); // 0-indexed
            let currentYear = now.getFullYear();
            
            // Search back indefinitely (with reasonable safety limit of 5 years)
            const maxMonthsBack = 60; // 5 years
            
            for (let monthsBack = 0; monthsBack < maxMonthsBack; monthsBack++) {
                console.log(`Searching ${currentYear}-${currentMonth + 1}...`);
                button.textContent = `Searching ${currentYear}-${String(currentMonth + 1).padStart(2, '0')}...`;
                
                const calendarData = await fetchCalendarData(currentMonth, currentYear);
                if (!calendarData) {
                    console.error('Failed to fetch calendar data');
                    break;
                }
                
                const incompleteCrosswords = findIncompleteCrosswords(calendarData);
                
                if (incompleteCrosswords.length > 0) {
                    const latest = incompleteCrosswords[0];
                    console.log(`Found incomplete crossword: ${latest.name} on day ${latest.day}`);
                    button.textContent = `Found ${latest.name}! Navigating...`;
                    
                    // Navigate to the puzzle
                    window.location.href = `https://www.puzzmo.com/puzzle/${latest.urlPath}`;
                    return;
                }
                
                // Go back one month
                currentMonth--;
                if (currentMonth < 0) {
                    currentMonth = 11;
                    currentYear--;
                }
                
                // Small delay to avoid hammering the API
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            alert(`No incomplete crosswords found in the last ${maxMonthsBack / 12} years!`);
            
        } catch (error) {
            console.error('Error finding crossword:', error);
            alert('Error finding incomplete crossword. Check console for details.');
        } finally {
            button.textContent = originalText;
            button.disabled = false;
        }
    }
    
    function injectAllButtons() {
        injectButton();
        injectButtonInSidebar();
    }
    
    // Wait for page to load, then inject
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', injectAllButtons);
        } else {
            injectAllButtons();
        }
        
        // Also watch for dynamic content changes
        const observer = new MutationObserver(injectAllButtons);
        observer.observe(document.body, { childList: true, subtree: true });
    }
    
    init();
})();