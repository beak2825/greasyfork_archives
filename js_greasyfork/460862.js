// ==UserScript==
// @name         ::Steam Links::
// @namespace    Steam-Links
// @version      2.2
// @icon         https://cdn.freebiesupply.com/images/large/2x/steam-logo-black-transparent.png
// @description  Lets you easily search the games on clean DL sites, watch gameplays without youtuber's comments and see if the game is woke-oriented.
// @author       masterofobzene
// @homepage     https://github.com/masterofobzene/UserScriptRepo
// @match        http://store.steampowered.com/app/*
// @match        https://store.steampowered.com/app/*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/460862/%3A%3ASteam%20Links%3A%3A.user.js
// @updateURL https://update.greasyfork.org/scripts/460862/%3A%3ASteam%20Links%3A%3A.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const CONTAINER_ID = 'custom-search-buttons-v2';

    function createButtons(gameName) {
        // Create container for buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.id = CONTAINER_ID;
        buttonContainer.style.margin = '15px 0';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexDirection = 'column';
        buttonContainer.style.gap = '8px';
        buttonContainer.style.zIndex = '9999';

        // Sites configuration
        const sites = [
            { name: 'GOG Games', url: `https://gog-games.to/?search=${encodeURIComponent(gameName)}`},
            { name: 'CS.RIN.RU', url: `https://cs.rin.ru/forum/search.php?keywords=${encodeURIComponent(gameName)}` + '&terms=any&author=&sc=1&sf=titleonly&sk=t&sd=d&sr=topics&st=0&ch=300&t=0&submit=Search'},
            { name: 'Torrminatorr', url: `https://forum.torrminatorr.com/search.php?keywords=${encodeURIComponent(gameName)}` },
            { name: 'FitGirl Repacks', url: `https://fitgirl-repacks.site/?s=${encodeURIComponent(gameName)}` },
            { name: 'DElDETECTED', url: `https://deidetected.com/games/?search=${encodeURIComponent(gameName)}` },
            { name: 'YouTube (No Commentary)', url: `https://www.youtube.com/results?search_query=${encodeURIComponent(gameName + ' no commentary')}` }
        ];

        // Create buttons
        sites.forEach(site => {
            const button = document.createElement('a');
            button.textContent = site.name;
            button.href = site.url;
            button.target = '_blank';
            button.rel = 'noopener noreferrer';
            button.style.cssText = `
                background-color: #4CAF50;
                color: white;
                padding: 12px;
                border-radius: 4px;
                text-align: center;
                text-decoration: none;
                font-family: Arial, sans-serif;
                font-size: 14px;
                cursor: pointer;
                transition: background-color 0.3s;
                position: relative;
            `;

            button.addEventListener('mouseover', () => button.style.backgroundColor = '#45a049');
            button.addEventListener('mouseout', () => button.style.backgroundColor = '#4CAF50');

            buttonContainer.appendChild(button);
        });

        return buttonContainer;
    }

    function addButtons() {
        // Check for existing container first
        if (document.getElementById(CONTAINER_ID)) return;

        // Get game name
        const gameNameElement = document.querySelector('.apphub_AppName');
        if (!gameNameElement) return;
        const gameName = gameNameElement.textContent.trim();

        // Find insertion point
        const targetAreas = [
            document.querySelector('.game_purchase_action'),
            document.querySelector('.game_area_purchase_game_wrapper'),
            document.querySelector('.game_area_purchase_game')
        ].filter(Boolean);

        if (targetAreas.length > 0) {
            const buttonContainer = createButtons(gameName);
            targetAreas[0].after(buttonContainer);
        }
    }

    // MutationObserver configuration
    const observer = new MutationObserver((mutations, obs) => {
        if (document.querySelector('.apphub_AppName')) {
            addButtons();
        }
    });

    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });

    // Initial check
    addButtons();
})();
