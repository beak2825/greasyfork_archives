// ==UserScript==
// @name         ::GOG-Games Links::
// @namespace    masterofobzene-GOG-Games
// @version      3.4
// @description  Adds YouTube and changelog search buttons per game card.
// @author       masterofobzene
// @homepage     https://github.com/masterofobzene/UserScriptRepo
// @license      GNU GPLv3
// @match        *://gog-games.to/*
// @grant        none
// @icon         https://files.mastodon.social/accounts/avatars/114/061/563/113/485/047/original/f9c6c7664af152f1.png
// @downloadURL https://update.greasyfork.org/scripts/528067/%3A%3AGOG-Games%20Links%3A%3A.user.js
// @updateURL https://update.greasyfork.org/scripts/528067/%3A%3AGOG-Games%20Links%3A%3A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const YT_BUTTON_CLASS = 'yt-search-unique';
    const CHANGELOG_BUTTON_CLASS = 'changelog-search-unique';
    const BUTTON_CONTAINER_CLASS = 'game-search-buttons-container';
    const PROCESSED_ATTR = 'data-yt-processed-v3';
    const PURPLE_COLOR = '#6a1b9a';
    const HOVER_PURPLE = '#4a148c';
    const ORANGE_COLOR = '#e65100';
    const HOVER_ORANGE = '#bf360c';
    let processing = false;

    function createSearchButton(gameName, type) {
        const isYouTube = type === 'youtube';
        const button = document.createElement('button');
        button.className = isYouTube ? YT_BUTTON_CLASS : CHANGELOG_BUTTON_CLASS;
        button.textContent = isYouTube ? 'Gameplay Video' : 'Changelog';
        button.style.cssText = `
            padding: 4px 8px !important;
            background: ${isYouTube ? PURPLE_COLOR : ORANGE_COLOR} !important;
            color: white !important;
            border: none !important;
            border-radius: 4px !important;
            cursor: pointer !important;
            margin: 4px 2px !important;
            font-family: Arial !important;
            font-size: 12px !important;
            transition: background 0.2s !important;
            display: inline-block !important;
            position: relative !important;
            z-index: 1000 !important;
            line-height: 1.2 !important;
            flex: 1 !important;
            min-width: 70px !important;
        `;

        const handleClick = (event) => {
            event.stopImmediatePropagation();
            event.preventDefault();
            const searchQuery = isYouTube
                ? `${gameName} no commentary`
                : `"${gameName} - Steam News Hub"`;

            if (isYouTube) {
                window.open(`https://youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`, '_blank');
            } else {
                // Use Firefox default search engine if available
                if (typeof browser !== 'undefined' && browser.search && browser.search.search) {
                    browser.search.search({ query: searchQuery, disposition: 'NEW_TAB' });
                } else {
                    // Fallback to DuckDuckGo
                    window.open(`https://duckduckgo.com/?q=${encodeURIComponent(searchQuery)}`, '_blank');
                }
            }
        };

        button.addEventListener('mouseover', () => {
            button.style.background = isYouTube ? HOVER_PURPLE : HOVER_ORANGE;
        });
        button.addEventListener('mouseout', () => {
            button.style.background = isYouTube ? PURPLE_COLOR : ORANGE_COLOR;
        });
        button.addEventListener('click', handleClick, true);
        button.addEventListener('auxclick', handleClick, true);

        return button;
    }

    function createButtonContainer(gameName) {
        const container = document.createElement('div');
        container.className = BUTTON_CONTAINER_CLASS;
        container.style.cssText = `
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            gap: 4px !important;
            margin: 4px 0 !important;
            width: 100% !important;
        `;

        container.appendChild(createSearchButton(gameName, 'youtube'));
        container.appendChild(createSearchButton(gameName, 'changelog'));

        return container;
    }

    function processCard(card) {
        if (processing || card.hasAttribute(PROCESSED_ATTR)) return;

        processing = true;
        try {
            const existingContainer = card.querySelector(`.${BUTTON_CONTAINER_CLASS}`);
            if (existingContainer) {
                existingContainer.remove();
            }

            const gameName = [
                () => card.querySelector('img[alt]')?.alt?.trim(),
                () => card.querySelector('[class*="title"]')?.textContent?.trim(),
                () => card.querySelector('h3, h4')?.textContent?.trim()
            ].reduce((acc, fn) => acc || fn(), '');

            if (!gameName) return;

            const container = card.querySelector('.actions, .card-footer') || card.querySelector('a')?.parentElement || card;
            if (container && !container.querySelector(`.${BUTTON_CONTAINER_CLASS}`)) {
                const buttonContainer = createButtonContainer(gameName);
                container.insertBefore(buttonContainer, container.firstChild);
                card.setAttribute(PROCESSED_ATTR, 'true');
            }
        } finally {
            processing = false;
        }
    }

    function processAllCards() {
        const cards = document.querySelectorAll('[class*="card"]:not([" + PROCESSED_ATTR + "])');
        cards.forEach(card => {
            if (!card.hasAttribute(PROCESSED_ATTR)) {
                processCard(card);
            }
        });
    }

    // Initial processing after full load
    window.addEventListener('load', () => {
        setTimeout(processAllCards, 2000);
    }, {once: true});

    // Mutation observer for dynamic content
    const mainContent = document.getElementById('main') || document.querySelector('main') || document.body;
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE && node.matches('[class*="card"]')) {
                        processCard(node);
                    }
                });
            }
        });
    });

    observer.observe(mainContent, {
        childList: true,
        subtree: true
    });
})();
