// ==UserScript==
// @name         itch.io Purchase Filter
// @namespace    xne
// @version      0.1.0
// @description  Filter itch.io purchases by title or author
// @author       xne
// @match        https://itch.io/my-purchases*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541647/itchio%20Purchase%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/541647/itchio%20Purchase%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let filterInput;
    let observer;

    function getFilterText() {
        return filterInput ? filterInput.value.toLowerCase().trim() : '';
    }

    function filterGameCell(cell) {
        const filterText = getFilterText();
        
        if (filterText === '') {
            cell.style.display = '';
        } else {
            const titleElement = cell.querySelector('a.title');
            const authorElement = cell.querySelector('div.game_author');
            
            const title = titleElement ? titleElement.textContent.toLowerCase() : '';
            const author = authorElement ? authorElement.textContent.toLowerCase() : '';
            
            const matches = title.includes(filterText) || author.includes(filterText);
            cell.style.display = matches ? '' : 'none';
        }
    }

    function filterAllGames() {
        const gameCells = document.querySelectorAll('div.game_cell');
        gameCells.forEach(filterGameCell);
    }

    function setupObserver() {
        if (observer) {
            observer.disconnect();
        }

        observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.classList && node.classList.contains('game_cell')) {
                            filterGameCell(node);
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function init() {
        const headerTabs = document.querySelector('div.header_tabs');
        if (!headerTabs) {
            setTimeout(init, 500);
            return;
        }

        const filterContainer = document.createElement('div');
        filterContainer.style.cssText = `
            padding: var(--itchio_gutter_width);
        `;

        filterInput = document.createElement('input');
        filterInput.type = 'text';
        filterInput.placeholder = 'Filter by title or author';
        filterInput.style.cssText = `
            color: var(--itchio_body_color);
            background-color: var(--itchio_gray_back);
            border-radius: 3px;
            border-width: 0;
            font-size: 14px;
            padding: 4px 0 4px 10px;
        `;

        filterContainer.appendChild(filterInput);

        headerTabs.insertAdjacentElement('afterend', filterContainer);

        filterInput.addEventListener('input', filterAllGames);
        filterInput.addEventListener('keyup', filterAllGames);

        filterAllGames();
      
        setupObserver();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.addEventListener('beforeunload', () => {
        if (observer) {
            observer.disconnect();
        }
    });
})();
