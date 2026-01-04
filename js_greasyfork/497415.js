// ==UserScript==
// @name         KIllER's BULK NUTTER FOR CELLCRAFT
// @namespace    BUY ITEMS IN BULK in cellcraft (easy)
// @version      0.1
// @description  BUY ITEMS IN BULK
// @author       KIllER
// @match        https://cellcraft.io/
// @icon         https://i.scdn.co/image/ab67757000003b82d8940d46826952b06b4be689
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497415/KIllER%27s%20BULK%20NUTTER%20FOR%20CELLCRAFT.user.js
// @updateURL https://update.greasyfork.org/scripts/497415/KIllER%27s%20BULK%20NUTTER%20FOR%20CELLCRAFT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to inject a font stylesheet if necessary
    function loadFont() {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap'; // Press Start 2P font
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    }

    // Prices for each item in coins
    const prices = {
        'Anti Freeze': 40,
        'Anti Recombine': 60,
        '360 Push Shots': 15,
        'Frozen Virus': 250,
        'Freeze': 80,
        'Virus': 380
    };

    function createFloatingWindow() {
        const floatWindow = document.createElement('div');
        floatWindow.id = 'myPurchaseWindow';
        floatWindow.style.position = 'fixed';
        floatWindow.style.top = '10px';
        floatWindow.style.right = '10px';
        floatWindow.style.zIndex = '1000';
        floatWindow.style.padding = '5px';
        floatWindow.style.backgroundColor = '#333';  
        floatWindow.style.border = '2px solid #f00';  
        floatWindow.style.borderRadius = '5px';
        floatWindow.style.display = 'none'; 
        floatWindow.style.color = '#f00';  
        floatWindow.style.fontFamily = '"Press Start 2P", cursive'; 
        document.body.appendChild(floatWindow);

        const title = document.createElement('div');
        title.textContent = 'KILLER\'S BULK NUTTER';
        title.style.textAlign = 'center';
        title.style.marginBottom = '10px';
        title.style.fontWeight = 'bold';
        title.style.fontFamily = '"Press Start 2P", cursive'; 
        floatWindow.appendChild(title);

        const toggleButton = document.createElement('button');
        toggleButton.textContent = '☰'; // Compact toggle icon
        toggleButton.style.position = 'absolute';
        toggleButton.style.top = '0';
        toggleButton.style.right = '0';
        toggleButton.style.padding = '5px 10px';
        toggleButton.style.fontSize = '16px';
        toggleButton.style.color = '#f00';  
        toggleButton.style.backgroundColor = '#222';  
        toggleButton.style.border = '1px solid #f00'; 
        toggleButton.onclick = function() {
            floatWindow.style.display = floatWindow.style.display === 'none' ? 'block' : 'none';
        };
        document.body.appendChild(toggleButton);

        return floatWindow;
    }

    function addItemButton(window, itemName, itemId, itemIcon) {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.marginBottom = '5px';

        const icon = document.createElement('img');
        icon.src = itemIcon;
        icon.style.width = '30px';
        icon.style.height = '30px';
        icon.style.marginRight = '5px';

        const input = document.createElement('input');
        input.type = 'number';
        input.min = '1';
        input.value = '1';
        input.style.width = '50px';
        input.style.marginRight = '5px';
        input.style.border = '1px solid #f00';
        input.style.color = '#f00';
        input.style.backgroundColor = '#222';

        const button = document.createElement('button');
        button.textContent = `Buy ${itemName}`;
        button.style.border = '1px solid #f00';
        button.style.color = '#f00';
        button.style.backgroundColor = '#222';
        button.onclick = function() {
            const quantity = parseInt(input.value) || 1;
            const totalPrice = prices[itemName] * quantity;
            const confirmMessage = `Confirm purchase of ${quantity} x ${itemName} for ${totalPrice} coins?`;
            if (confirm(confirmMessage)) {
                makePurchase(itemId, quantity);
            }
        };

        container.appendChild(icon);
        container.appendChild(input);
        container.appendChild(button);
        window.appendChild(container);
    }

    function makePurchase(itemId, quantity) {
        console.log(`Purchasing item ID ${itemId} with quantity ${quantity}`);
        window.purchaseItem(itemId, quantity);
    }

    // Load the font as soon as possible
    loadFont();

    const bulkPurchaseWindow = createFloatingWindow();
    addItemButton(bulkPurchaseWindow, 'Anti Recombine', 34, 'https://cellcraft.io/skins/objects/21_lo.png');
    addItemButton(bulkPurchaseWindow, 'Anti Freeze', 35, 'https://cellcraft.io/skins/objects/20_lo.png');
    addItemButton(bulkPurchaseWindow, '360 Push Shots', 30, 'https://cellcraft.io/img/inv_360shot.png?v=2');
    addItemButton(bulkPurchaseWindow, 'Frozen Virus', 36, 'https://cellcraft.io/img/frozen_virus.png');
    addItemButton(bulkPurchaseWindow, 'Freeze', 5, 'https://cellcraft.io/img/freeze.png');
    addItemButton(bulkPurchaseWindow, 'Virus', 7, 'https://cellcraft.io/img/inventory/virus.png');
})();
