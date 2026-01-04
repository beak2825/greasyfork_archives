// ==UserScript==
// @name         Multi-Platform Search Buttons for DLsite
// @namespace    http://tampermonkey.net/
// @version      3.30.0
// @description  Adds a compact, open-by-default dropdown menu for search buttons on DLsite pages, with grouped buttons for gaming forums, correct favicons, and a design that matches DLsite's aesthetic. F95Zone forum and product ID buttons open f95zone.to in a focused tab on left-click and unfocused tab on middle-click, fetch search IDs, and redirect to results in the same tab. Supports simultaneous searches without interference and ensures button text is highlightable.
// @author       FunkyJustin
// @match        https://www.dlsite.com/maniax/work/=/product_id/*
// @match        https://www.dlsite.com/pro/work/=/product_id/*
// @match        https://f95zone.to/*
// @grant        GM_openInTab
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496313/Multi-Platform%20Search%20Buttons%20for%20DLsite.user.js
// @updateURL https://update.greasyfork.org/scripts/496313/Multi-Platform%20Search%20Buttons%20for%20DLsite.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if on f95zone.to to handle search
    if (window.location.href.includes('f95zone.to')) {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('query');
        if (query) {
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
                    window.location.href = searchUrl; // Redirect in same tab
                } else {
                    console.error('Could not extract search ID for query:', query, 'URL:', finalUrl);
                    alert('Failed to fetch search ID for "' + query + '". Redirecting to fallback URL.');
                    window.location.href = `https://f95zone.to/search/?q=${encodeURIComponent(query)}&o=relevance`;
                }
            })
            .catch(error => {
                console.error('Error performing search for query:', query, error);
                alert('Error fetching search ID for "' + query + '". Redirecting to fallback URL.');
                window.location.href = `https://f95zone.to/search/?q=${encodeURIComponent(query)}&o=relevance`;
            })
            .finally(() => {
                document.body.removeChild(form);
            });
        }
        return;
    }

    // Inject CSS styles for DLsite
    const style = document.createElement('style');
    style.innerHTML = `
        :root {
            --button-bg-start: #D6BCFA;
            --button-bg-end: #FBB6CE;
            --button-text: #f5f5f5;
            --button-shadow: rgba(0, 0, 0, 0.1);
            --button-border: #B794F4;
            --dropdown-bg: #f9f9f9;
        }
        .search-btn {
            display: inline-flex;
            align-items: center;
            padding: 4px 8px;
            margin: 2px;
            background: linear-gradient(45deg, var(--button-bg-start), var(--button-bg-end));
            color: #800080 !important; /* Match purple color of original non-forum buttons */
            text-decoration: none;
            border-radius: 12px;
            border: 1px solid var(--button-border);
            box-shadow: 0 2px 4px var(--button-shadow);
            font-family: Arial, sans-serif;
            font-size: 15px;
            font-weight: bold;
            transition: box-shadow 0.2s, opacity 0.3s;
            cursor: pointer;
            appearance: none; /* Reset browser-specific button styles */
            -webkit-appearance: none;
            -moz-appearance: none;
            background-clip: padding-box;
            user-select: auto !important; /* Allow text selection */
        }
        .search-btn:hover {
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
            opacity: 0.95;
        }
        .search-btn img {
            width: 18px;
            height: 18px;
            margin-right: 6px;
        }
        .circle-btn-wrapper .search-btn {
            padding: 3px 6px;
            font-size: 14px;
        }
        .dropdown-container {
            max-width: 600px;
            margin-top: 10px;
            margin-bottom: 20px;
            position: relative;
        }
        .dropdown-toggle {
            display: flex;
            align-items: center;
            padding: 5px 10px;
            background-color: #E91E63;
            color: #fff;
            border: none;
            border-radius: 12px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        .dropdown-toggle:hover {
            background-color: #C2185B;
        }
        .dropdown-toggle::after {
            content: '▼';
            margin-left: 5px;
            transition: transform 0.2s;
        }
        .dropdown-toggle.collapsed::after {
            transform: rotate(180deg);
        }
        .dropdown-content {
            display: block; /* Open by default */
            background-color: var(--dropdown-bg);
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            padding: 10px;
            margin-top: 5px;
        }
        .dropdown-content.hidden {
            display: none;
        }
        .button-group {
            margin-bottom: 8px;
        }
        .group-label {
            font-family: Arial, sans-serif;
            font-size: 14px;
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
        }
        .button-group-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(100px, auto));
            gap: 5px;
        }
        .circle-btn-wrapper {
            display: flex;
            align-items: center;
            margin-top: 5px;
            gap: 5px;
        }
        .version-label {
            position: absolute;
            top: 5px;
            right: 5px;
            font-family: Arial, sans-serif;
            font-size: 12px;
            color: #666;
        }
    `;
    document.head.appendChild(style);

    // Icon URLs for each website
    const icons = {
        f95zone: 'https://f95zone.to/favicon.ico',
        ryuugames: 'https://www.ryuugames.com/wp-content/uploads/2020/05/cropped-ryuugames_logo-1-32x32.png',
        otomi: 'https://otomi-games.com/favicon.ico'
    };

    // Function to create a styled button
    function createButton(text, queryOrUrl, iconUrl, isF95Forum = false) {
        const element = isF95Forum ? document.createElement('button') : document.createElement('a');
        element.className = 'search-btn';
        element.title = text;

        if (isF95Forum) {
            element.type = 'button'; // Ensure button behavior
            element.addEventListener('mousedown', (event) => {
                if (event.button === 0 || event.button === 1) { // Left or middle-click
                    event.preventDefault();
                    // Open tab with query in URL parameter
                    GM_openInTab(`https://f95zone.to/?query=${encodeURIComponent(queryOrUrl)}`, { active: event.button === 0, setParent: true });
                    // Add small delay to prevent browser overload
                    return new Promise(resolve => setTimeout(resolve, 100));
                }
            });
        } else {
            element.href = queryOrUrl;
            element.target = '_blank';
        }

        if (iconUrl) {
            const img = document.createElement('img');
            img.src = iconUrl;
            img.alt = '';
            element.appendChild(img);
        }
        element.appendChild(document.createTextNode(text));
        return element;
    }

    // Main function to add buttons
    function addSearchButtons() {
        const gameTitleEl = document.querySelector('h1#work_name');
        const circleNameEl = document.querySelector('span[itemprop="brand"] a');
        if (!gameTitleEl || !circleNameEl) {
            console.warn('Required elements not found.');
            return;
        }

        const gameTitle = gameTitleEl.innerText.trim();
        const circleName = circleNameEl.innerText.trim();
        const productIdMatch = window.location.href.match(/product_id\/([^\/]+)/);
        const productId = productIdMatch ? productIdMatch[1].replace(/\.html#?$/, '') : '';

        const buttons = {
            f95Game: createButton('Search on F95Zone', `https://f95zone.to/sam/latest_alpha/#/cat=games/page=1/search=${encodeURIComponent(gameTitle)}`, icons.f95zone),
            f95Forum: createButton('Search on F95Zone Forums', gameTitle, icons.f95zone, true),
            f95PID: createButton('Search Product ID on F95Zone Forums', productId, icons.f95zone, true),
            f95Circle: createButton('Search Circle on F95Zone', `https://f95zone.to/sam/latest_alpha/#/cat=games/page=1/creator=${encodeURIComponent(circleName)}`, icons.f95zone),
            f95ForumCircle: createButton('Search Circle on F95Zone Forums', circleName, icons.f95zone, true),
            otomiGame: createButton('Search on OtomiGames', `https://otomi-games.com/?s=${encodeURIComponent(gameTitle)}`, icons.otomi),
            otomiPID: createButton('Search Product ID on OtomiGames', `https://otomi-games.com/?s=${encodeURIComponent(productId)}`, icons.otomi),
            otomiCircle: createButton('Search Circle on OtomiGames', `https://otomi-games.com/?s=${encodeURIComponent(circleName)}`, icons.otomi),
            ryuuGame: createButton('Search on Ryuugames', `https://www.ryuugames.com/?s=${encodeURIComponent(gameTitle)}`, icons.ryuugames),
            ryuuPID: createButton('Search Product ID on Ryuugames', `https://www.ryuugames.com/?s=${encodeURIComponent(productId)}`, icons.ryuugames),
            ryuuCircle: createButton('Search Circle on Ryuugames', `https://www.ryuugames.com/?s=${encodeURIComponent(circleName)}`, icons.ryuugames)
        };

        const titleContainer = document.querySelector('.base_title_br');
        if (titleContainer) {
            const dropdownContainer = document.createElement('div');
            dropdownContainer.className = 'dropdown-container';

            const toggleButton = document.createElement('button');
            toggleButton.className = 'dropdown-toggle';
            toggleButton.textContent = 'Search Options';
            toggleButton.addEventListener('click', () => {
                dropdownContent.classList.toggle('hidden');
                toggleButton.classList.toggle('collapsed');
            });

            const dropdownContent = document.createElement('div');
            dropdownContent.className = 'dropdown-content';

            const versionLabel = document.createElement('div');
            versionLabel.className = 'version-label';
            versionLabel.textContent = 'v3.30.0';
            dropdownContainer.appendChild(versionLabel);

            const f95Group = document.createElement('div');
            f95Group.className = 'button-group';
            const f95Label = document.createElement('div');
            f95Label.className = 'group-label';
            f95Label.textContent = 'F95Zone';
            const f95Grid = document.createElement('div');
            f95Grid.className = 'button-group-grid';
            [buttons.f95Game, buttons.f95Forum, buttons.f95PID].forEach(btn => f95Grid.appendChild(btn));
            f95Group.appendChild(f95Label);
            f95Group.appendChild(f95Grid);

            const otomiGroup = document.createElement('div');
            otomiGroup.className = 'button-group';
            const otomiLabel = document.createElement('div');
            otomiLabel.className = 'group-label';
            otomiLabel.textContent = 'OtomiGames';
            const otomiGrid = document.createElement('div');
            otomiGrid.className = 'button-group-grid';
            [buttons.otomiGame, buttons.otomiPID].forEach(btn => otomiGrid.appendChild(btn));
            otomiGroup.appendChild(otomiLabel);
            otomiGroup.appendChild(otomiGrid);

            const ryuuGroup = document.createElement('div');
            ryuuGroup.className = 'button-group';
            const ryuuLabel = document.createElement('div');
            ryuuLabel.className = 'group-label';
            ryuuLabel.textContent = 'Ryuugames';
            const ryuuGrid = document.createElement('div');
            ryuuGrid.className = 'button-group-grid';
            [buttons.ryuuGame, buttons.ryuuPID].forEach(btn => ryuuGrid.appendChild(btn));
            ryuuGroup.appendChild(ryuuLabel);
            ryuuGroup.appendChild(ryuuGrid);

            dropdownContent.appendChild(f95Group);
            dropdownContent.appendChild(otomiGroup);
            dropdownContent.appendChild(ryuuGroup);

            dropdownContainer.appendChild(toggleButton);
            dropdownContainer.appendChild(dropdownContent);
            titleContainer.parentNode.insertBefore(dropdownContainer, titleContainer.nextSibling);
        }

        const circleWrapper = document.createElement('span');
        circleWrapper.className = 'circle-btn-wrapper';
        [buttons.f95Circle, buttons.f95ForumCircle, buttons.ryuuCircle, buttons.otomiCircle].forEach(btn => circleWrapper.appendChild(btn));
        circleNameEl.parentNode.insertBefore(circleWrapper, circleNameEl.nextSibling);
    }

    // Only run button creation on DLsite pages
    if (window.location.href.includes('dlsite.com')) {
        const observer = new MutationObserver((mutations, obs) => {
            if (document.querySelector('h1#work_name') && document.querySelector('span[itemprop="brand"] a')) {
                addSearchButtons();
                obs.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
})();