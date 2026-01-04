// ==UserScript==
// @name         KaguraGames to F95Zone and Steam Search Buttons
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Add buttons to search game title from KaguraGames on F95Zone and Steam
// @author       FunkyJustin
// @license      MIT
// @match        https://www.kaguragames.com/product/*
// @icon         https://www.google.com/s2/favicons?domain=kaguragames.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497139/KaguraGames%20to%20F95Zone%20and%20Steam%20Search%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/497139/KaguraGames%20to%20F95Zone%20and%20Steam%20Search%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract the game title
    function getGameTitle() {
        let titleElement = document.querySelector('h1.product-title.product_title.entry-title');
        return titleElement ? titleElement.textContent.trim() : null;
    }

    // Function to create and display the search buttons
    function createSearchButtons(title) {
        // F95Zone search button
        let f95zoneButton = document.createElement('button');
        f95zoneButton.textContent = `Search "${title}" on F95Zone`;
        f95zoneButton.style.display = 'block';
        f95zoneButton.style.marginTop = '10px';
        f95zoneButton.style.fontSize = '16px';
        f95zoneButton.style.padding = '10px';
        f95zoneButton.style.backgroundColor = '#007bff';
        f95zoneButton.style.color = '#fff';
        f95zoneButton.style.border = 'none';
        f95zoneButton.style.cursor = 'pointer';
        f95zoneButton.style.borderRadius = '5px';
        f95zoneButton.style.marginBottom = '10px';

        f95zoneButton.addEventListener('click', function() {
            let searchUrl = `https://f95zone.to/sam/latest_alpha/#/cat=games/page=1/search=${encodeURIComponent(title)}`;
            window.open(searchUrl, '_blank');
        });

        // Steam search button
        let steamButton = document.createElement('button');
        steamButton.textContent = `Search "${title}" on Steam`;
        steamButton.style.display = 'block';
        steamButton.style.marginTop = '10px';
        steamButton.style.fontSize = '16px';
        steamButton.style.padding = '10px';
        steamButton.style.backgroundColor = '#1b2838';
        steamButton.style.color = '#fff';
        steamButton.style.border = 'none';
        steamButton.style.cursor = 'pointer';
        steamButton.style.borderRadius = '5px';

        steamButton.addEventListener('click', function() {
            let searchUrl = `https://store.steampowered.com/search/?term=${encodeURIComponent(title)}`;
            window.open(searchUrl, '_blank');
        });

        // Append the buttons to a suitable place on the page
        let container = document.querySelector('.summary.entry-summary');
        if (container) {
            container.appendChild(f95zoneButton);
            container.appendChild(steamButton);
        }
    }

    // Main script logic
    let gameTitle = getGameTitle();
    if (gameTitle) {
        createSearchButtons(gameTitle);
    }
})();
