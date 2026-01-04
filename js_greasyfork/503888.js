// ==UserScript==
// @name         Color Favorites for Multiple Sites
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Script for multiple sites
// @author       step
// @match        *://zelenka.guru/*
// @match        *://lolz.live/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/503888/Color%20Favorites%20for%20Multiple%20Sites.user.js
// @updateURL https://update.greasyfork.org/scripts/503888/Color%20Favorites%20for%20Multiple%20Sites.meta.js
// ==/UserScript==



(function() {
    'use strict';

    function createAddToFavoritesButton() {
        const hexInputContainer = document.querySelector('.fr-input-line');
        if (!hexInputContainer) return;

        const addButton = document.createElement('button');
        addButton.type = 'button';
        addButton.textContent = 'Сохранить цвет';
        addButton.style.margin = '10px 0';
        addButton.style.marginLeft = '0';
        addButton.className = 'fr-command fr-btn custom-save-color-btn';

        addButton.style.backgroundColor = '#007bff';
        addButton.style.color = '#fff';
        addButton.style.border = 'none';
        addButton.style.padding = '10px 20px';
        addButton.style.borderRadius = '5px';
        addButton.style.cursor = 'pointer';

        addButton.addEventListener('mousedown', function() {
            addButton.style.transform = 'scale(0.95)';
        });

        addButton.addEventListener('mouseup', function() {
            addButton.style.transform = 'scale(1)';
        });

        hexInputContainer.appendChild(addButton);

        addButton.addEventListener('click', function() {
            const color = document.querySelector('#fr-color-hex-layer-text-1').value;
            if (color) {
                addColorToFavorites(color);
                updateFavoritesSlots();
            }
        });
    }

    function createFavoritesSlots() {
        const hexInputContainer = document.querySelector('.fr-input-line');
        if (!hexInputContainer) return;

        const slotsContainer = document.createElement('div');
        slotsContainer.className = 'fr-favorites-slots';
        slotsContainer.style.display = 'grid';
        slotsContainer.style.gridTemplateColumns = 'repeat(5, 1fr)';
        slotsContainer.style.gridGap = '5px';
        slotsContainer.style.marginTop = '10px';
        slotsContainer.style.marginBottom = '10px';
        slotsContainer.style.width = '100%';

        for (let i = 0; i < 25; i++) {
            const slot = document.createElement('div');
            slot.className = 'fr-favorites-slot';
            slot.style.width = '30px';
            slot.style.height = '30px';
            slot.style.border = '1px solid #ccc';
            slot.style.backgroundColor = '#fff';
            slot.style.cursor = 'pointer';
            slot.style.boxSizing = 'border-box';
            slot.dataset.index = i;

            slot.addEventListener('mousedown', function() {
                slot.style.transform = 'scale(0.95)';
            });

            slot.addEventListener('mouseup', function() {
                slot.style.transform = 'scale(1)';
            });

            slot.addEventListener('click', function() {
                const color = slot.style.backgroundColor;
                if (color && color !== 'rgb(255, 255, 255)') {
                    document.querySelector('#fr-color-hex-layer-text-1').value = rgbToHex(color);
                }
            });

            slot.addEventListener('dblclick', function() {
                const color = slot.style.backgroundColor;
                if (color && color !== 'rgb(255, 255, 255)') {
                    removeColorFromFavorites(i);
                    updateFavoritesSlots();
                }
            });

            slotsContainer.appendChild(slot);
        }

        hexInputContainer.appendChild(slotsContainer);
    }

    function updateFavoritesSlots() {
        const favoriteColors = GM_getValue('favoriteColors', []);
        const slots = document.querySelectorAll('.fr-favorites-slot');

        slots.forEach((slot, index) => {
            if (favoriteColors[index]) {
                slot.style.backgroundColor = favoriteColors[index];
            } else {
                slot.style.backgroundColor = '#fff';
            }
        });
    }

    function addColorToFavorites(color) {
        let favoriteColors = GM_getValue('favoriteColors', []);
        if (favoriteColors.length < 25 && !favoriteColors.includes(color)) {
            favoriteColors.push(color);
            GM_setValue('favoriteColors', favoriteColors);
        }
    }

    function removeColorFromFavorites(index) {
        let favoriteColors = GM_getValue('favoriteColors', []);
        favoriteColors.splice(index, 1);
        GM_setValue('favoriteColors', favoriteColors);
    }

    function rgbToHex(rgb) {
        const rgbValues = rgb.match(/\d+/g);
        return `#${((1 << 24) + (parseInt(rgbValues[0]) << 16) + (parseInt(rgbValues[1]) << 8) + parseInt(rgbValues[2])).toString(16).slice(1).toUpperCase()}`;
    }

    document.addEventListener('DOMNodeInserted', function(event) {
        if (event.target.classList && event.target.classList.contains('fr-popup')) {
            createAddToFavoritesButton();
            createFavoritesSlots();
            updateFavoritesSlots();
        }
    });

})();
