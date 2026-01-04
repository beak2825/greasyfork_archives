// ==UserScript==
// @name         Сортировка инвентаря ГВД
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Скрипт для сортировки инвентаря по прочности
// @author       Мальфесто
// @match        https://www.heroeswm.ru/inventory.php*
// @match        https://www.lordswm.com/inventory.php*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512741/%D0%A1%D0%BE%D1%80%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%BA%D0%B0%20%D0%B8%D0%BD%D0%B2%D0%B5%D0%BD%D1%82%D0%B0%D1%80%D1%8F%20%D0%93%D0%92%D0%94.user.js
// @updateURL https://update.greasyfork.org/scripts/512741/%D0%A1%D0%BE%D1%80%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%BA%D0%B0%20%D0%B8%D0%BD%D0%B2%D0%B5%D0%BD%D1%82%D0%B0%D1%80%D1%8F%20%D0%93%D0%92%D0%94.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function sortInventoryByDurability() {
        const inventoryBlock = document.getElementById('inventory_block');
        if (!inventoryBlock) return;

        let items = Array.from(inventoryBlock.getElementsByClassName('inventory_item_div'));

        let itemsWithDurability = items.filter(item => {
            let durabilityDiv = item.querySelector('.art_durability_hidden');
            return durabilityDiv && durabilityDiv.textContent.includes('/');
        });

        let fullDurabilityItems = itemsWithDurability.filter(item => getCurrentValue(item) > 0 && getDurabilityValue(item) === 1);
        let partialDurabilityItems = itemsWithDurability.filter(item => getCurrentValue(item) > 0 && getDurabilityValue(item) < 1);
        let brokenItems = itemsWithDurability.filter(item => getCurrentValue(item) === 0);

        fullDurabilityItems.sort((a, b) => getTotalDurability(b) - getTotalDurability(a));

        partialDurabilityItems.sort((a, b) => getCurrentValue(b) - getCurrentValue(a));

        brokenItems.sort((a, b) => getTotalDurability(b) - getTotalDurability(a));

        inventoryBlock.innerHTML = '';

        // Целые предметы
        fullDurabilityItems.forEach(item => {
            item.style.border = '3px solid green';
            item.style.backgroundColor = '#e6ffe6';
            inventoryBlock.appendChild(item);
        });

        // Разделитель между группами
        const separator1 = document.createElement('div');
        separator1.style.height = '20px';
        separator1.style.width = '100%';
        inventoryBlock.appendChild(separator1);

        // Частично поврежденные предметы
        partialDurabilityItems.forEach(item => {
            item.style.border = '3px solid Goldenrod';
            item.style.backgroundColor = '#B8860B';
            inventoryBlock.appendChild(item);
        });

        const separator2 = document.createElement('div');
        separator2.style.height = '20px';
        separator2.style.width = '100%';
        inventoryBlock.appendChild(separator2);

        // Сломанные предметы
        brokenItems.forEach(item => {
            item.style.border = '3px solid red';
            item.style.backgroundColor = '#ffe6e6';
            inventoryBlock.appendChild(item);
        });
    }

    function getDurabilityValue(item) {
        let durabilityText = item.querySelector('.art_durability_hidden').textContent;
        let [current, total] = durabilityText.split('/').map(Number);
        return current / total;
    }

    function getCurrentValue(item) {
        let durabilityText = item.querySelector('.art_durability_hidden').textContent;
        let [current] = durabilityText.split('/').map(Number);
        return current;
    }

    function getTotalDurability(item) {
        let durabilityText = item.querySelector('.art_durability_hidden').textContent;
        let [, total] = durabilityText.split('/').map(Number);
        return total;
    }

    function addControls() {
        const container = document.getElementById('container_inventory_outside');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'sortByDefaultCheckbox';
        checkbox.style.marginRight = '10px';
        checkbox.style.marginTop = '15px';

        const label = document.createElement('label');
        label.innerHTML = 'Сортировать по умолчанию';
        label.setAttribute('for', 'sortByDefaultCheckbox');

        const button = document.createElement('button');
        button.id = 'sortButton';
        button.innerHTML = 'Сортировать по прочности';
        button.style.marginTop = '10px';
        button.style.padding = '10px';
        button.style.backgroundColor = '#ffcc00';
        button.style.border = '2px solid #333';
        button.style.cursor = 'pointer';

        button.addEventListener('click', sortInventoryByDurability);

        if (container) {
            container.appendChild(checkbox);
            container.appendChild(label);
            container.appendChild(button);
        }

        checkbox.addEventListener('change', function() {
            if (checkbox.checked) {
                localStorage.setItem('sortByDefault', 'true');
                button.style.display = 'none';
                sortInventoryByDurability();
            } else {
                localStorage.setItem('sortByDefault', 'false');
                button.style.display = 'block';
            }
        });

        if (localStorage.getItem('sortByDefault') === 'true') {
            checkbox.checked = true;
            button.style.display = 'none';
            sortInventoryByDurability();
        }
    }

    function observeFilterClicks() {
        const filterTabs = document.querySelectorAll('.filter_tab, .slot_size');
        filterTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                if (document.getElementById('sortByDefaultCheckbox').checked) {
                    sortInventoryByDurability();
                }
            });
        });
    }

    function interceptRequests() {
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            return originalFetch.apply(this, args).then(response => {
                if (response.url.includes('inventory.php')) {
                    response.clone().text().then(() => {
                        sortInventoryByDurability();
                    });
                }
                return response;
            });
        };

        const originalXHROpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            if (url.includes('inventory.php') && method === 'GET') {
                this.addEventListener('load', function() {
                    sortInventoryByDurability();
                });
            }
            originalXHROpen.apply(this, arguments);
        };
    }

    window.onload = function() {
        addControls();
        observeFilterClicks();
        interceptRequests();
    };
})();
