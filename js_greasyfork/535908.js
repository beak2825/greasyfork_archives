// ==UserScript==
// @name         Multi-Platform Search Buttons for Otomi Games
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Adds a compact, open-by-default dropdown menu for search buttons on Otomi Games pages, with grouped buttons in a modern, pink-gradient design matching the site's logo. Product ID buttons are greyed out and unclickable if no valid DLsite ID (RJ/VJ format) is available.
// @author       FunkyJustin
// @match        https://otomi-games.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535908/Multi-Platform%20Search%20Buttons%20for%20Otomi%20Games.user.js
// @updateURL https://update.greasyfork.org/scripts/535908/Multi-Platform%20Search%20Buttons%20for%20Otomi%20Games.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inject CSS styles
    const style = document.createElement('style');
    style.innerHTML = `
        :root {
            --primary-pink-start: #FF6B9A; /* Pink from logo */
            --primary-pink-end: #FF8C61; /* Orange-pink gradient */
            --accent-teal: #4FD1C5; /* Otomi Games teal */
            --bg-light: #F7FAFC; /* Light background */
            --shadow-color: rgba(0, 0, 0, 0.1);
            --glass-bg: rgba(247, 250, 252, 0.9);
            --glass-border: rgba(255, 107, 154, 0.3); /* Pink-tinted border */
        }
        .search-btn {
            display: inline-flex;
            align-items: center;
            padding: 5px 10px;
            margin: 2px;
            background: linear-gradient(135deg, var(--primary-pink-start), var(--primary-pink-end));
            color: #1A202C; /* Black text to match page */
            text-decoration: none;
            border-radius: 6px;
            border: 1px solid var(--glass-border);
            box-shadow: 0 2px 4px var(--shadow-color), inset 0 0 2px var(--primary-pink-start);
            font-family: Poppins, Roboto, Arial, sans-serif;
            font-size: 16px;
            font-weight: 600;
            backdrop-filter: blur(5px);
            background-color: var(--glass-bg);
            transition: transform 0.2s, box-shadow 0.3s, opacity 0.3s;
        }
        .search-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 8px var(--shadow-color), 0 0 10px var(--accent-teal);
            opacity: 0.95;
        }
        .search-btn.disabled {
            opacity: 0.5;
            pointer-events: none;
            cursor: not-allowed;
            background: #E0E7FF;
            color: #1A202C; /* Black text for disabled state */
        }
        .search-btn img {
            width: 16px;
            height: 16px;
            margin-right: 6px;
        }
        .dropdown-container {
            max-width: 600px;
            margin: 10px 0;
        }
        .dropdown-toggle {
            display: flex;
            align-items: center;
            padding: 6px 12px;
            background: linear-gradient(135deg, var(--primary-pink-start), var(--primary-pink-end));
            color: #1A202C; /* Black text to match page */
            border: none;
            border-radius: 6px;
            font-family: Poppins, Roboto, Arial, sans-serif;
            font-size: 16px;
            font-weight: 500; /* Slightly thinner than buttons (600) */
            cursor: pointer;
            transition: transform 0.2s, background 0.3s;
            box-shadow: 0 2px 4px var(--shadow-color);
        }
        .dropdown-toggle:hover {
            transform: scale(1.03);
            background: linear-gradient(135deg, #FF8C61, #FF6B9A);
        }
        .dropdown-toggle:active, .dropdown-toggle:focus {
            background: linear-gradient(135deg, var(--primary-pink-start), var(--primary-pink-end));
            color: #1A202C; /* Maintain black text */
            outline: none;
            box-shadow: 0 2px 4px var(--shadow-color), inset 0 0 4px var(--primary-pink-start);
        }
        .dropdown-toggle::after {
            content: '▼';
            margin-left: 6px;
            transition: transform 0.3s ease;
        }
        .dropdown-toggle.collapsed::after {
            transform: rotate(180deg);
        }
        .dropdown-content {
            display: block; /* Open by default */
            background: var(--glass-bg);
            border-radius: 6px;
            box-shadow: 0 4px 12px var(--shadow-color);
            padding: 10px;
            margin-top: 5px;
            backdrop-filter: blur(5px);
            border: 1px solid var(--glass-border);
        }
        .dropdown-content.hidden {
            display: none;
        }
        .button-group {
            margin-bottom: 8px;
        }
        .group-label {
            font-family: Poppins, Roboto, Arial, sans-serif;
            font-size: 15px;
            font-weight: 600;
            color: #2D3748;
            margin-bottom: 4px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .button-group-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(110px, auto));
            gap: 4px;
        }
        .circle-btn-wrapper {
            display: inline-flex;
            flex-wrap: nowrap;
            align-items: center;
            margin-left: 8px;
            margin-bottom: 10px;
            margin-right: 8px;
        }
        .circle-btn-wrapper .search-btn {
            color: #1A202C !important; /* Enforce black text for developer buttons */
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
    function createButton(text, url, iconUrl, isDisabled = false) {
        const a = document.createElement('a');
        a.className = `search-btn ${isDisabled ? 'disabled' : ''}`;
        a.href = url;
        a.target = '_blank';
        a.title = text;
        if (iconUrl) {
            const img = document.createElement('img');
            img.src = iconUrl;
            img.alt = '';
            a.appendChild(img);
        }
        a.appendChild(document.createTextNode(text));
        return a;
    }

    // Main function to add buttons
    function addSearchButtons() {
        // Extract game title
        const titleEl = document.querySelector('h1.post-title.entry-title a');
        if (!titleEl) {
            console.warn('Game title element not found.');
            return;
        }
        let gameTitle = titleEl.innerText.trim();
        let productId = '';

        // Extract product ID from title (e.g., [RJ01321968] or [VJ013026])
        const idMatch = gameTitle.match(/\[([RV]J\d{6,8})\]/); // Match RJ/VJ followed by 6 or 8 digits
        if (idMatch) {
            productId = idMatch[1]; // e.g., RJ01321968 or VJ013026
            gameTitle = gameTitle.replace(/\[([RV]J\d{6,8})\]/, '').replace(/\[.*?\]/g, '').trim(); // Clean title
        } else {
            // If no ID in title, check URL slug for a valid DLsite ID
            const urlMatch = window.location.href.match(/\/([^\/]+)\/$/);
            if (urlMatch) {
                const slug = urlMatch[1]; // e.g., oceanlust
                // Check if the slug is a valid DLsite ID
                if (slug.match(/^[RV]J\d{6,8}$/)) {
                    productId = slug; // e.g., RJ01321968
                }
            }
            gameTitle = gameTitle.replace(/\[.*?\]/g, '').trim(); // Remove [Final], etc.
        }

        // If no valid DLsite ID was found, ensure productId is empty
        if (!productId.match(/^[RV]J\d{6,8}$/)) {
            productId = ''; // Invalidate if not a proper DLsite ID
        }

        // Extract developer (more flexible selector)
        const developerLi = Array.from(document.querySelectorAll('ul.wp-block-list li')).find(li => 
            li.textContent.includes('Publisher:') || li.textContent.includes('Developer:')
        );
        const developerName = developerLi ? developerLi.textContent.replace(/^(Publisher|Developer):/, '').trim() : '';
        if (!developerName) {
            console.warn('Developer element not found.');
            return;
        }

        // Define search URLs
        const urls = {
            f95zoneGame: `https://f95zone.to/sam/latest_alpha/#/cat=games/page=1/search=${encodeURIComponent(gameTitle)}`,
            f95zoneForum: `https://f95zone.to/search/?q=${encodeURIComponent(gameTitle)}&t=post&c[child_nodes]=1&c[nodes][0]=2&c[title_only]=1&o=relevance`,
            f95zonePID: `https://f95zone.to/search/?q=${encodeURIComponent(productId)}`,
            otomiGame: `https://otomi-games.com/?s=${encodeURIComponent(gameTitle)}`,
            otomiPID: `https://otomi-games.com/?s=${encodeURIComponent(productId)}`, // Updated URL format
            ryuuGame: `https://www.ryuugames.com/?s=${encodeURIComponent(gameTitle)}`,
            ryuuPID: `https://www.ryuugames.com/?s=${encodeURIComponent(productId)}`,
            f95zoneDev: `https://f95zone.to/sam/latest_alpha/#/cat=games/page=1/creator=${encodeURIComponent(developerName)}`,
            ryuuDev: `https://www.ryuugames.com/?s=${encodeURIComponent(developerName)}`,
            otomiDev: `https://otomi-games.com/?s=${encodeURIComponent(developerName)}`
        };

        // Create buttons, disabling product ID buttons if no valid ID
        const hasProductId = !!productId;
        const buttons = {
            f95Game: createButton('Search F95Zone', urls.f95zoneGame, icons.f95zone),
            f95Forum: createButton('F95 Forums', urls.f95zoneForum, icons.f95zone),
            f95PID: createButton('F95 Product ID', urls.f95zonePID, icons.f95zone, !hasProductId),
            otomiGame: createButton('Search Otomi', urls.otomiGame, icons.otomi),
            otomiPID: createButton('Otomi Product ID', urls.otomiPID, icons.otomi, !hasProductId),
            ryuuGame: createButton('Search Ryuugames', urls.ryuuGame, icons.ryuugames),
            ryuuPID: createButton('Ryuu Product ID', urls.ryuuPID, icons.ryuugames, !hasProductId),
            f95Dev: createButton('Search Developer on F95Zone', urls.f95zoneDev, icons.f95zone),
            ryuuDev: createButton('Search Developer on Ryuugames', urls.ryuuDev, icons.ryuugames),
            otomiDev: createButton('Search Developer on OtomiGames', urls.otomiDev, icons.otomi)
        };

        // Append buttons in a dropdown menu
        const titleContainer = document.querySelector('header.entry-header');
        if (titleContainer) {
            const dropdownContainer = document.createElement('div');
            dropdownContainer.className = 'dropdown-container';

            // Create toggle button
            const toggleButton = document.createElement('button');
            toggleButton.className = 'dropdown-toggle';
            toggleButton.textContent = 'Search Options';
            toggleButton.addEventListener('click', () => {
                dropdownContent.classList.toggle('hidden');
                toggleButton.classList.toggle('collapsed');
            });

            // Create dropdown content
            const dropdownContent = document.createElement('div');
            dropdownContent.className = 'dropdown-content';

            // F95Zone group
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

            // OtomiGames group
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

            // Ryuugames group
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

            // Append groups to dropdown content
            dropdownContent.appendChild(f95Group);
            dropdownContent.appendChild(otomiGroup);
            dropdownContent.appendChild(ryuuGroup);

            // Append toggle button and content to container
            dropdownContainer.appendChild(toggleButton);
            dropdownContainer.appendChild(dropdownContent);
            titleContainer.appendChild(dropdownContainer);
        }

        // Append developer buttons
        if (developerLi) {
            const devWrapper = document.createElement('span');
            devWrapper.className = 'circle-btn-wrapper';
            [buttons.f95Dev, buttons.ryuuDev, buttons.otomiDev].forEach(btn => devWrapper.appendChild(btn));
            developerLi.insertAdjacentElement('afterend', devWrapper);
        }
    }

    // Use MutationObserver to detect when required elements are available
    const observer = new MutationObserver((mutations, obs) => {
        const titleEl = document.querySelector('h1.post-title.entry-title a');
        const developerLi = Array.from(document.querySelectorAll('ul.wp-block-list li')).find(li => 
            li.textContent.includes('Publisher:') || li.textContent.includes('Developer:')
        );
        if (titleEl && developerLi) {
            addSearchButtons();
            obs.disconnect();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Fallback to run after a short delay for both old and new pages
    setTimeout(() => {
        const titleEl = document.querySelector('h1.post-title.entry-title a');
        const developerLi = Array.from(document.querySelectorAll('ul.wp-block-list li')).find(li => 
            li.textContent.includes('Publisher:') || li.textContent.includes('Developer:')
        );
        if (titleEl && developerLi && !document.querySelector('.dropdown-container')) {
            addSearchButtons();
        }
    }, 3000); // 3-second delay for reliability
})();