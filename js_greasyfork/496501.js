// ==UserScript==
// @name         F95Zone Developer and Game Search on Steam and RyuuGames
// @namespace    http://tampermonkey.net/
// @version      2.12.0
// @description  Adds buttons to search for the developer on F95Zone and the game title on Steam and RyuuGames, with robust F95Zone forum search.
// @author       FunkyJustin
// @license      MIT
// @match        https://f95zone.to/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=f95zone.to
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/496501/F95Zone%20Developer%20and%20Game%20Search%20on%20Steam%20and%20RyuuGames.user.js
// @updateURL https://update.greasyfork.org/scripts/496501/F95Zone%20Developer%20and%20Game%20Search%20on%20Steam%20and%20RyuuGames.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Debounce utility to prevent rapid clicks
    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Handle search if query parameter is present
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');
    if (query) {
        const tryFetchSearch = (retries = 3, delay = 1000) => {
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = 'https://f95zone.to/search/search';
            form.style.display = 'none';

            const inputs = {
                'keywords': query,
                'order': 'relevance',
                '_xfToken': document.querySelector('input[name="_xfToken"]')?.value || ''
            };

            for (const [name, value] of Object.entries(inputs)) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = name;
                input.value = value;
                form.appendChild(input);
            }

            document.body.appendChild(form);

            fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                redirect: 'follow'
            })
            .then(response => {
                const finalUrl = response.url;
                const match = finalUrl.match(/\/search\/(\d+)\//);
                if (match && match[1]) {
                    const searchId = match[1];
                    const searchUrl = `https://f95zone.to/search/${searchId}/?q=${encodeURIComponent(query)}&o=relevance`;
                    window.location.href = searchUrl;
                } else {
                    throw new Error('Could not extract search ID');
                }
            })
            .catch(error => {
                if (retries > 0) {
                    console.warn(`Retrying search for query "${query}" (${retries} retries left)...`);
                    setTimeout(() => tryFetchSearch(retries - 1, delay * 2), delay);
                } else {
                    console.error('Error performing search for query:', query, error);
                    alert(`Error fetching search ID for "${query}". Redirecting to fallback URL. Details: ${error.message}`);
                    window.location.href = `https://f95zone.to/search/?q=${encodeURIComponent(query)}&o=relevance`;
                }
            })
            .finally(() => {
                document.body.removeChild(form);
            });
        };

        // Wait for _xfToken using MutationObserver
        const waitForToken = () => {
            const tokenInput = document.querySelector('input[name="_xfToken"]');
            if (tokenInput) {
                tryFetchSearch();
            } else {
                const observer = new MutationObserver(() => {
                    if (document.querySelector('input[name="_xfToken"]')) {
                        observer.disconnect();
                        tryFetchSearch();
                    }
                });
                observer.observe(document.body, { childList: true, subtree: true });
                setTimeout(() => {
                    observer.disconnect();
                    if (!document.querySelector('input[name="_xfToken"]')) {
                        console.warn('No _xfToken found after timeout');
                        tryFetchSearch(0); // Proceed with empty token
                    }
                }, 5000); // 5-second timeout
            }
        };

        waitForToken();
        return;
    }

    // Only add buttons if on a threads page
    if (!window.location.pathname.startsWith('/threads/')) {
        return;
    }

    // Inject CSS styles
    const style = document.createElement('style');
    style.innerHTML = `
        .f95-button-container {
            margin-top: 0;
            display: flex;
            flex-wrap: nowrap;
            align-items: flex-start;
            background-color: transparent;
            padding: 0 0 10px;
            position: relative;
            overflow-x: auto;
            white-space: nowrap;
        }
        .f95-search-btn {
            margin: 5px;
            cursor: pointer;
            padding: 5px 10px;
            font-size: 14px;
            color: #FFFFFF !important;
            background: linear-gradient(45deg, #BA4545, #EC5555, #F6AAAA);
            border: none;
            border-radius: 3px;
            display: inline-flex;
            align-items: center;
            text-align: center;
            font-family: Arial, sans-serif;
            font-weight: bold;
            transition: background 0.2s, opacity 0.3s;
        }
        .f95-search-btn:hover {
            background: #A23B3B;
            opacity: 0.95;
        }
    `;
    document.head.appendChild(style);

    // Function to create a search button
    function createSearchButton(buttonText, searchUrls, ariaLabel, isForumSearch = false) {
        const button = document.createElement('button');
        button.innerText = buttonText;
        button.setAttribute('aria-label', ariaLabel);
        button.className = 'f95-search-btn';

        if (isForumSearch) {
            const debouncedClick = debounce((event) => {
                event.preventDefault();
                GM_openInTab(`https://f95zone.to/?query=${searchUrls[0].split('=')[1]}`, {
                    active: event.button === 0,
                    setParent: true
                });
            }, 300);
            button.addEventListener('mousedown', debouncedClick);
        } else {
            button.onclick = () => {
                searchUrls.forEach(url => window.open(url, '_blank'));
            };
        }
        return button;
    }

    // Find the title element
    const titleElement = document.querySelector('.p-title h1.p-title-value');
    if (titleElement) {
        // Create a container for the buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'f95-button-container';

        // Extract the full title text
        const titleText = titleElement.innerText;

        // Extract the developer's name
        const developerMatch = titleText.match(/\[([^\]]+)\]$/);
        if (developerMatch && developerMatch[1].length > 0 && developerMatch[1].length < 100) {
            const developerName = developerMatch[1];
            const encodedDeveloperName = encodeURIComponent(developerName);
            const developerSearchUrl = `https://f95zone.to/sam/latest_alpha/#/cat=games/page=1/creator=${developerName}`;
            const developerForumSearchUrl = `https://f95zone.to/search/?q=${encodedDeveloperName}`;
            const developerSteamSearchUrls = [
                `https://store.steampowered.com/search/?developer=${developerName}`,
                `https://store.steampowered.com/search/?term=${developerName}`
            ];
            const developerSearchButton = createSearchButton('Search Developer on F95Zone', [developerSearchUrl], `Search for developer ${developerName} on F95Zone`);
            const developerForumSearchButton = createSearchButton('Search Developer on F95Zone Forums', [developerForumSearchUrl], `Search for developer ${developerName} on F95Zone forums`, true);
            const developerSteamSearchButton = createSearchButton('Search Developer on Steam', developerSteamSearchUrls, `Search for developer ${developerName} on Steam`);
            buttonContainer.appendChild(developerSearchButton);
            buttonContainer.appendChild(developerForumSearchButton);
            buttonContainer.appendChild(developerSteamSearchButton);
        } else {
            const noDeveloperLabel = document.createElement('span');
            noDeveloperLabel.innerText = 'Developer name not found';
            noDeveloperLabel.style.color = '#888';
            noDeveloperLabel.style.marginLeft = '10px';
            buttonContainer.appendChild(noDeveloperLabel);
        }

        // Function to extract game title without modifying the DOM
        function extractGameTitle(element, developer) {
            let gameTitle = '';
            element.childNodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    gameTitle += node.textContent;
                }
            });
            // Remove version number like [vX.Y.Z] or [vX.Y]
            gameTitle = gameTitle.replace(/\[v\d+\.\d+(\.\d+)?\]/g, '').trim();
            // Remove developer name if present
            if (developer) {
                gameTitle = gameTitle.replace(`[${developer}]`, '').trim();
            }
            return gameTitle.trim();
        }

        // Extract and clean the game title
        const gameTitle = extractGameTitle(titleElement, developerMatch ? developerMatch[1] : null);
        const encodedGameTitle = encodeURIComponent(gameTitle);

        // Construct search URLs
        const gameSearchUrl = `https://store.steampowered.com/search/?term=${encodedGameTitle}&supportedlang=english&ndl=1`;
        const gameRyuuGamesSearchUrl = `https://www.ryuugames.com/?s=${encodedGameTitle}`;
        const gameSearchButton = createSearchButton('Search Game on Steam', [gameSearchUrl], `Search for game ${gameTitle} on Steam`);
        const gameRyuuGamesSearchButton = createSearchButton('Search Game on RyuuGames', [gameRyuuGamesSearchUrl], `Search for game ${gameTitle} on RyuuGames`);

        // Append the game search buttons
        buttonContainer.appendChild(gameSearchButton);
        buttonContainer.appendChild(gameRyuuGamesSearchButton);

        // Append the button container to the parent of the title element
        titleElement.parentElement.appendChild(buttonContainer);
    }
})();