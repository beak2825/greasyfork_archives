// ==UserScript==
// @name         Cartel Empire - Armed Surplus Select All Armour/Weapons with Quality & Item Filter
// @namespace    baccy.ce
// @version      0.3
// @description  Allows the user to enter a quality range for chosen weapons and armour to be automatically selected to sell to the Armed Surplus NPC
// @author       Baccy
// @match        https://cartelempire.online/Town/ArmedSurplus*
// @match        https://cartelempire.online/Town/armedsurplus*
// @icon          https://cartelempire.online/images/icon-white.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520560/Cartel%20Empire%20-%20Armed%20Surplus%20Select%20All%20ArmourWeapons%20with%20Quality%20%20Item%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/520560/Cartel%20Empire%20-%20Armed%20Surplus%20Select%20All%20ArmourWeapons%20with%20Quality%20%20Item%20Filter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const storeItems = {
        'Baseball Bat': 1100,
        'Walther P38': 1101,
        'Trench Coat': 1204,
        'Covert Stab Vest': 1200,
        'Ballistic Vest': 1201,
        'AK-47': 1000,
        'M16A2': 1001,
        'M1911': 1102,
        'Kevlar Weave Vest': 1205,
        'Carbon Fiber Vest': 1206,
        'Armoured Suit': 1207,
        'Ceramic Plate Carrier Vest': 1208,
        'S&W Magnum Revolver': 1103,
        'MG34': 1500,
        'Glock 18': 1104,
        'Riot Suit': 1209
    };

    let qualityRange = { min: 0, max: 100 };
    let validIds = [];
    let savedQualityRange = JSON.parse(localStorage.getItem('ArmedSurplusQualityRange')) || {};

    function waitForContainer() {
        const container = document.querySelector('.sellItemsContainer');
        if (!container) {
            setTimeout(waitForContainer, 500);
            return;
        }
        addControls(container);
    }

    function addControls(container) {
        const rangeDiv = document.createElement('div');
        rangeDiv.style.marginBottom = '10px';

        const minInput = document.createElement('input');
        minInput.type = 'number';
        minInput.placeholder = 'Min Quality (%)';
        minInput.style.marginRight = '5px';
        minInput.style.width = '140px';
        if (savedQualityRange.min) minInput.value = savedQualityRange.min;

        const maxInput = document.createElement('input');
        maxInput.type = 'number';
        maxInput.placeholder = 'Max Quality (%)';
        maxInput.style.marginRight = '5px';
        maxInput.style.width = '140px';
        if (savedQualityRange.max) maxInput.value = savedQualityRange.max;

        const button = document.createElement('button');
        button.textContent = 'Select Items in Range';
        button.style.marginLeft = '5px';

        const toggleButton = document.createElement('button');
        toggleButton.textContent = 'Show/Hide Item Selection';
        toggleButton.style.marginLeft = '5px';

        const itemSelectionDiv = document.createElement('div');
        itemSelectionDiv.style.display = 'none';
        itemSelectionDiv.style.marginTop = '10px';
        itemSelectionDiv.style.border = '1px solid #ccc';
        itemSelectionDiv.style.padding = '10px';

        toggleButton.addEventListener('click', () => {
            itemSelectionDiv.style.display = itemSelectionDiv.style.display === 'none' ? 'block' : 'none';
        });

        const storedSelections = JSON.parse(localStorage.getItem('ArmedSurplusSelectedItems')) || [];

        Object.entries(storeItems).forEach(([name, id]) => {
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.dataset.itemId = id;
            checkbox.checked = storedSelections.includes(id);

            checkbox.addEventListener('change', () => {
                updateSelections(id, checkbox.checked);
            });

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(` ${name}`));
            label.style.display = 'block';
            itemSelectionDiv.appendChild(label);
        });

        rangeDiv.appendChild(minInput);
        rangeDiv.appendChild(maxInput);
        rangeDiv.appendChild(button);
        rangeDiv.appendChild(toggleButton);
        rangeDiv.appendChild(itemSelectionDiv);

        container.insertBefore(rangeDiv, container.firstChild);

        button.addEventListener('click', () => {
            const min = parseFloat(minInput.value);
            const max = parseFloat(maxInput.value);

            if (isNaN(min) || isNaN(max) || min < 0 || max > 100 || min >= max) {
                alert('Please enter valid min and max quality percentages.');
                return;
            }

            qualityRange = { min, max };
            savedQualityRange = qualityRange;
            localStorage.setItem('ArmedSurplusQualityRange', JSON.stringify(savedQualityRange));
            filterItems(container);
        });

        updateSelections();
    }

    function updateSelections(id = null, isSelected = null) {
        let storedSelections = JSON.parse(localStorage.getItem('ArmedSurplusSelectedItems')) || [];

        if (id !== null && isSelected !== null) {
            if (isSelected) {
                if (!storedSelections.includes(id)) {
                    storedSelections.push(id);
                }
            } else {
                storedSelections = storedSelections.filter(storedId => storedId !== id);
            }
            localStorage.setItem('ArmedSurplusSelectedItems', JSON.stringify(storedSelections));
        }

        validIds = storedSelections;
    }

    function filterItems(container) {
        let processedItems = 0;
        let updatedItems = 0;

        validIds.forEach(id => {
            const itemElements = document.querySelectorAll(`#item-${id}`);
            if (itemElements.length === 0) return;

            itemElements.forEach(itemElement => {
                processedItems++;

                const qualityDiv = Array.from(itemElement.querySelectorAll('div')).find(div =>
                    div.textContent.trim().startsWith('Quality')
                );

                if (!qualityDiv) {
                    return;
                }

                const qualityText = qualityDiv.textContent.trim();
                const qualityMatch = qualityText.match(/Quality\s*(\d+(\.\d+)?)%/);
                const quality = qualityMatch ? parseFloat(qualityMatch[1]) : NaN;

                if (isNaN(quality)) {
                    return;
                }

                if (quality < qualityRange.min || quality > qualityRange.max) {
                    return;
                }

                const quantityInput = itemElement.querySelector('.form-control.itemQuantityInput');
                if (quantityInput) {
                    updatedItems++;
                    quantityInput.value = 1;

                    ['input', 'change', 'keyup'].forEach(eventType => {
                        const event = new Event(eventType, { bubbles: true, cancelable: true });
                        quantityInput.dispatchEvent(event);
                    });

                }
            });
        });
    }

    waitForContainer();
})();
