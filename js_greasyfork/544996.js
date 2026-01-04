// ==UserScript==
// @name         Neopets Premium Bar + New
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  New page premium bar
// @author       Bryan W
// @match        *://*.neopets.com/*
// @exclude      https://www.neopets.com/dome/arena*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544996/Neopets%20Premium%20Bar%20%2B%20New.user.js
// @updateURL https://update.greasyfork.org/scripts/544996/Neopets%20Premium%20Bar%20%2B%20New.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if the nav-top-grid__2020 element exists on the page
    const navGrid = document.querySelector('.nav-top-grid__2020');
    if (!navGrid) return;

    // Find the Featured Game link dynamically
    const featuredGameLink = document.querySelector('a[href*="/games/game.phtml?game_id="]');
    const featuredGameUrl = featuredGameLink ? featuredGameLink.href : 'https://www.neopets.com/games/game.phtml?game_id=820';

    // Create a container for the buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'fixed';
    buttonContainer.style.bottom = '10px';
    buttonContainer.style.left = '50%';
    buttonContainer.style.transform = 'translateX(-50%)';
    buttonContainer.style.zIndex = '9999';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '10px';
    buttonContainer.style.alignItems = 'center';

    // Function to create a toggle button
    function createToggleButton(label, action, imageUrl, width, height) {
        const button = document.createElement('button');
        button.style.width = `${width}px`;
        button.style.height = `${height}px`;
        button.style.backgroundImage = `url("${imageUrl}")`;
        button.style.backgroundSize = 'contain';
        button.style.backgroundRepeat = 'no-repeat';
        button.style.backgroundPosition = 'center';
        button.style.border = '0';
        button.style.borderRadius = '3px';
        button.style.cursor = 'pointer';
        button.style.backgroundColor = 'transparent';
        button.setAttribute('title', label); // Tooltip for accessibility

        button.addEventListener('click', () => {
            try {
                action();
            } catch (e) {
                console.error(`Error triggering ${label}: ${e.message}`);
            }
        });

        return button;
    }

    // Create buttons for each toggle/link in the specified order
    const sswButton = createToggleButton('Toggle Super Shop Wizard', () => toggleSSW__2020(), 'https://images.neopets.com/premium/shopwizard/ssw-icon.svg', 60, 60);
    const featuredGameButton = createToggleButton('Featured Game', () => window.location.href = featuredGameUrl, 'https://images.neopets.com/games/pages/icons/badges/premium-featured-game.png', 60, 60);
    const dailiesButton = createToggleButton('Toggle Dailies', () => toggleWidget__2020('dailies'), 'https://images.neopets.com/themes/h5/basic/images/quests-icon.svg', 60, 60);
    const bankrollButton = createToggleButton('Toggle Bankroll', () => toggleWidget__2020('bankroll'), 'https://images.neopets.com/randomevents/images/skeith_bank.png', 90, 90);
    const petchangeButton = createToggleButton('Petchange', () => window.location.href = 'https://www.neopets.com/premium/change_pet.phtml', 'https://images.neopets.com/themes/h5/basic/images/specieschange-icon.png', 60, 60);
    const scratchcardButton = createToggleButton('Premium Scratchcard', () => window.location.href = 'https://www.neopets.com/premium/sc/', 'https://images.neopets.com/games/betterthanyou/contestant926.gif', 60, 60);
    const neodeckButton = createToggleButton('Neodeck', () => window.location.href = 'https://www.neopets.com/games/neodeck/index.phtml?show=prem', 'https://images.neopets.com/premium/portal/images/neodeck-icon.png', 60, 60);
    const stampAlbumButton = createToggleButton('Stamp Album', () => window.location.href = 'https://www.neopets.com/stamps.phtml?type=album&page_id=1', 'https://images.neopets.com/neoboards/avatars/stampsfaerieland87393.gif', 60, 60);

    // Append buttons to the container in order: SSW, Featured Game, Dailies, Bankroll, Petchange, Scratchcard, Neodeck, Stamp Album
    buttonContainer.appendChild(sswButton);
    buttonContainer.appendChild(featuredGameButton);
    buttonContainer.appendChild(dailiesButton);
    buttonContainer.appendChild(bankrollButton);
    buttonContainer.appendChild(petchangeButton);
    buttonContainer.appendChild(scratchcardButton);
    buttonContainer.appendChild(neodeckButton);
    buttonContainer.appendChild(stampAlbumButton);

    // Append the container to the body
    document.body.appendChild(buttonContainer);
})();