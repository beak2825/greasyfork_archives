// ==UserScript==
// @name         The Vicariuz Sheet Enhancer
// @version      03/07/2025
// @description  To be used with google sheet.
// @author       Vicarius
// @match        https://*.forgeofempires.com/game/index*
// @grant        GM_setClipboard
// @run-at       document-end
// @license      MIT
// @namespace https://greasyfork.org/users/1418467
// @downloadURL https://update.greasyfork.org/scripts/529132/The%20Vicariuz%20Sheet%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/529132/The%20Vicariuz%20Sheet%20Enhancer.meta.js
// ==/UserScript==

// =========================================================================================================================//
// =====     Copy Data FoE (Draggable & Resizable Container)    ===========================================================//
// =========================================================================================================================//

(function() {
    'use strict';

    // Functions for copying text (unchanged logic)
    function copyCityCount() {
        let cityCount = {};
        Object.values(MainParser.CityMapData)
            .filter(({ cityentity_id: cityId }) => !['F_', 'H_', 'M_', 'O_', 'S_', 'U_', 'V_', 'X_', 'Y_'].some(prefix => cityId.startsWith(prefix)))
            .forEach(({ cityentity_id: cityId }) => {
                let cityName = ((MainParser.CityEntities[cityId] || {}).name || cityId);
                cityCount[cityName] = (cityCount[cityName] || 0) + 1;
            });

        let result = Object.entries(cityCount)
            .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
            .map(([key, value]) => `${key}\t${value}`)
            .join('\n');

        copyTextToClipboard(result, 'City data copied to clipboard!');
    }

    function copyOtherPlayerCityCount() {
        let cityCount = {};
        Object.values(MainParser.OtherPlayerCityMapData)
            .filter(({ cityentity_id: cityId }) => !['F_', 'H_', 'M_', 'O_', 'S_', 'U_', 'V_', 'X_', 'Y_'].some(prefix => cityId.startsWith(prefix)))
            .forEach(({ cityentity_id: cityId }) => {
                let cityName = ((MainParser.CityEntities[cityId] || {}).name || cityId);
                cityCount[cityName] = (cityCount[cityName] || 0) + 1;
            });

        let result = Object.entries(cityCount)
            .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
            .map(([key, value]) => `${key}\t${value}`)
            .join('\n');

        copyTextToClipboard(result, 'Other player city data copied to clipboard!');
    }

    function copyInventory() {
        let result = Object.values(MainParser.Inventory)
            .filter(item => item.__class__ === "InventoryItem" && item.item.__class__ === "BuildingItemPayload" && item.item.cityEntityId && ['A_', 'D_', 'G_', 'L_', 'M_', 'P_', 'R_', 'T_', 'W_', 'Z_'].some(prefix => item.item.cityEntityId.startsWith(prefix)))
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(item => `${item.name}\t${item.inStock}`)
            .join('\n');

        copyTextToClipboard(result, 'Inventory data copied to clipboard!');
    }

    function copyAllInventory() {
        let result = Object.values(MainParser.Inventory)
            .map(item => `${item.name}\t${item.inStock}`)
            .join('\n');

        copyTextToClipboard(result, 'All inventory data copied to clipboard!');
    }

    function copyTextToClipboard(text, successMessage) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.width = "2em";
        textArea.style.height = "2em";
        textArea.style.padding = "0";
        textArea.style.border = "none";
        textArea.style.outline = "none";
        textArea.style.boxShadow = "none";
        textArea.style.background = "transparent";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
            alert(successMessage);
        } catch (err) {
            // Handle error silently
        }

        document.body.removeChild(textArea);
    }

    // Create a draggable & resizable container on the page
    function createDraggableResizableContainer() {
        const container = document.createElement('div');
        container.id = 'dinoSheetDraggableContainer';

        // Basic styling for container (resizable & draggable)
        container.style.position = 'absolute';
        container.style.top = '100px';
        container.style.left = '100px';
        container.style.width = '300px';
        container.style.height = '200px';
        container.style.border = '1px solid #aaa';
        container.style.backgroundColor = '#fff';
        container.style.resize = 'both';
        container.style.overflow = 'auto';
        container.style.zIndex = '9999';
        container.style.padding = '6px';

        // Make container draggable by holding down on it
        let offsetX = 0;
        let offsetY = 0;
        let isDragging = false;

        container.addEventListener('mousedown', function(e) {
            if (e.target === container) {
                isDragging = true;
                offsetX = e.clientX - container.offsetLeft;
                offsetY = e.clientY - container.offsetTop;
            }
        });

        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                container.style.left = (e.clientX - offsetX) + 'px';
                container.style.top = (e.clientY - offsetY) + 'px';
            }
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
        });

        document.body.appendChild(container);
        return container;
    }

    // Add buttons to the draggable container
    function createButtonsInside(container) {
        const style = document.createElement('style');
        style.textContent = `
            .dino-sheet-button {
                padding: 5px 10px;
                margin: 4px;
                background-color: #1E90FF;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 13px;
                transition: background-color 0.3s;
            }
            .dino-sheet-button:hover {
                background-color: #1C86EE;
            }
        `;
        document.head.appendChild(style);

        // Wrapper for buttons
        const buttonsWrapper = document.createElement('div');
        buttonsWrapper.style.display = 'grid';
        buttonsWrapper.style.gridTemplateColumns = '1fr';
        buttonsWrapper.style.gap = '6px';

        // Define each button
        const buttons = [
            { text: 'My City Data', onClick: copyCityCount },
            { text: 'Other City Data', onClick: copyOtherPlayerCityCount },
            { text: 'Building Inventory', onClick: copyInventory },
            { text: 'All Inventory', onClick: copyAllInventory },
        ];

        // Create and attach the buttons
        buttons.forEach(({ text, onClick }) => {
            const btn = document.createElement('button');
            btn.textContent = text;
            btn.className = 'dino-sheet-button';
            btn.addEventListener('click', onClick);
            buttonsWrapper.appendChild(btn);
        });

        container.appendChild(buttonsWrapper);
    }

    // Main init
    window.addEventListener('load', function() {
        const draggableContainer = createDraggableResizableContainer();
        createButtonsInside(draggableContainer);
    });
})();
