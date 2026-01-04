// ==UserScript==
// @name         Tlačítko WNBA - API
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Přidá tlačítka pro prokliknutí do API
// @author       Michal
// @match        https://www.wnba.com/schedule*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540636/Tla%C4%8D%C3%ADtko%20WNBA%20-%20API.user.js
// @updateURL https://update.greasyfork.org/scripts/540636/Tla%C4%8D%C3%ADtko%20WNBA%20-%20API.meta.js
// ==/UserScript==

(function() {
    'use strict';


    function extractGameId(href) {
        const match = href.match(/\/game\/(\d+)\//);
        return match ? match[1] : null;
    }


    function createApiUrl(gameId) {
        return `https://cdn.wnba.com/static/json/liveData/boxscore/boxscore_${gameId}.json`;
    }


    function createApiButton(gameId) {
        const button = document.createElement('button');
        button.textContent = 'Statistiky';
        button.style.cssText = `
            background-color: #e31837;
            color: white;
            border: none;
            padding: 5px 10px;
            margin: 5px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
            z-index: 1;
            position: static;
            display: inline-block;
            max-width: 100%;
            box-sizing: border-box;
        `;


        button.addEventListener('mousedown', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        });

        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            const apiUrl = createApiUrl(gameId);
            window.open(apiUrl, '_blank');
        });

        button.addEventListener('auxclick', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            const apiUrl = createApiUrl(gameId);
            window.open(apiUrl, '_blank');
        });


        button.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#c41530';
        });

        button.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '#e31837';
        });

        return button;
    }


    function addApiButtons() {

        const gameLinks = document.querySelectorAll('a[class*="_GameTile__game"]');

        gameLinks.forEach(gameLink => {

            if (gameLink.querySelector('.api-button-added')) {
                return;
            }

            const href = gameLink.getAttribute('href');
            if (!href) return;

            const gameId = extractGameId(href);
            if (!gameId) return;


            const apiButton = createApiButton(gameId);
            apiButton.classList.add('api-button-added');


            const gameInfo = gameLink.querySelector('[class*="_GameTile__game-info"]');
            if (gameInfo) {

                const buttonContainer = document.createElement('div');
                buttonContainer.style.cssText = `
                    display: flex;
                    justify-content: center;
                    padding: 5px;
                    background-color: rgba(0,0,0,0.05);
                    border-top: 1px solid rgba(0,0,0,0.1);
                `;
                buttonContainer.appendChild(apiButton);
                gameInfo.appendChild(buttonContainer);
            }
        });
    }


    function initialize() {

        setTimeout(addApiButtons, 1500);


        const observer = new MutationObserver(function(mutations) {
            let shouldUpdate = false;
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1 &&
                            (node.querySelector && node.querySelector('a[class*="_GameTile__game"]') ||
                             node.matches && node.matches('a[class*="_GameTile__game"]'))) {
                            shouldUpdate = true;
                        }
                    });
                }
            });

            if (shouldUpdate) {
                setTimeout(addApiButtons, 500);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }


    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();