// ==UserScript==
// @name         SteamDB History Size Filter (Auto-hides empty changelists)
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Adds a menu to filter SteamDB history by size, and automatically hides empty changelist panels.
// @author       Your Name
// @match        https://steamdb.info/history/*
// @license MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/542460/SteamDB%20History%20Size%20Filter%20%28Auto-hides%20empty%20changelists%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542460/SteamDB%20History%20Size%20Filter%20%28Auto-hides%20empty%20changelists%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Стили для меню ---
    GM_addStyle(`
        #size-filter-menu {
            position: fixed;
            top: 100px;
            left: 20px;
            background-color: #1e1e1e;
            border: 1px solid #333;
            padding: 15px;
            z-index: 1000;
            border-radius: 5px;
            color: #fff;
            font-family: 'Inter', sans-serif;
            width: 200px;
        }
        #size-filter-menu h3 {
            margin-top: 0;
            border-bottom: 1px solid #333;
            padding-bottom: 5px;
        }
        #size-filter-menu label {
            display: block;
            margin-bottom: 5px;
        }
        #size-filter-menu input, #size-filter-menu select {
            width: 100%;
            padding: 8px;
            margin-bottom: 10px;
            box-sizing: border-box;
            background-color: #333;
            border: 1px solid #555;
            color: #fff;
            border-radius: 3px;
        }
        #size-filter-menu button {
            width: 100%;
            padding: 10px;
            border: none;
            color: white;
            cursor: pointer;
            border-radius: 3px;
            margin-top: 5px;
            transition: background-color 0.2s;
        }
        #size-filter-menu #filter-button {
            background-color: #007bff;
        }
        #size-filter-menu #filter-button.is-active {
            background-color: #0056b3;
        }
        #size-filter-menu #filter-button:not(.is-active):hover {
            background-color: #0069d9;
        }
        #size-filter-menu #reset-button {
             background-color: #6c757d;
        }
        #size-filter-menu #reset-button:hover {
             background-color: #5a6268;
        }
    `);

    // --- HTML Меню ---
    const menuHTML = `
        <div id="size-filter-menu">
            <h3>Фильтр по размеру</h3>
            <label for="min-size-input">Мин. изменение:</label>
            <input type="number" id="min-size-input" value="1" min="0">
            <select id="size-unit-select">
                <option value="KiB">KiB</option>
                <option value="MiB" selected>MiB</option>
                <option value="GiB">GiB</option>
            </select>
            <button id="filter-button">Фильтровать</button>
            <button id="reset-button">Сбросить</button>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', menuHTML);

    const filterButton = document.getElementById('filter-button');
    const resetButton = document.getElementById('reset-button');
    const minSizeInput = document.getElementById('min-size-input');
    const sizeUnitSelect = document.getElementById('size-unit-select');

    // --- Логика фильтрации ---

    function convertToKiB(value, unit) {
        if (!unit) return value;
        switch (unit.toUpperCase()) {
            case 'GIB': return value * 1024 * 1024;
            case 'MIB': return value * 1024;
            case 'KIB': return value;
            default: return 0;
        }
    }

    function parseSize(sizeText) {
        const match = sizeText.match(/\(?([+-]?[\d,]+\.?\d*)\s*(KiB|MiB|GiB)\)?/i);
        if (match) {
            const value = parseFloat(match[1].replace(/,/g, ''));
            return convertToKiB(Math.abs(value), match[2]);
        }
        return 0;
    }

    // Применяет фильтр к отдельной записи <li class="repo">
    function applyFilterToRepoItem(item, minSizeInKiB) {
        const historyJson = item.querySelector('.app-history-json');
        if (!historyJson) {
            item.style.display = '';
            return;
        }

        const changes = Array.from(historyJson.children).map(li => li.textContent);
        const sizeChanges = changes.filter(text => text.includes(' size:'));
        const downloadChanges = changes.filter(text => text.includes(' download:'));

        let relevantChanges = sizeChanges.length > 0 ? sizeChanges : downloadChanges;

        if (relevantChanges.length === 0) {
            item.style.display = '';
            return;
        }

        const meetsThreshold = relevantChanges.some(text => parseSize(text) >= minSizeInKiB);
        item.style.display = meetsThreshold ? '' : 'none';
    }

    // Проверяет и скрывает пустые панели Changelist
    function updatePanelVisibility() {
        document.querySelectorAll('.panel-history').forEach(panel => {
            const repoItems = panel.querySelectorAll('li.repo');
            if (repoItems.length === 0) {
                // Если изначально нет repo-элементов, не трогаем панель.
                return;
            }

            // Проверяем, есть ли ХОТЯ БЫ ОДИН видимый repo-элемент
            const hasVisibleItems = Array.from(repoItems).some(item => item.style.display !== 'none');

            panel.style.display = hasVisibleItems ? '' : 'none';
        });
    }

    // Основная функция, запускающая оба этапа фильтрации
    function runFilter() {
        const minSize = parseFloat(minSizeInput.value) || 0;
        const unit = sizeUnitSelect.value;
        const minSizeInKiB = convertToKiB(minSize, unit);

        document.querySelectorAll('li.repo').forEach(item => {
            applyFilterToRepoItem(item, minSizeInKiB);
        });

        updatePanelVisibility(); // Скрываем пустые панели после фильтрации
        filterButton.classList.add('is-active');
    }

    function resetFilter() {
        minSizeInput.value = "1";
        sizeUnitSelect.value = "MiB";
        document.querySelectorAll('.panel-history').forEach(panel => {
            panel.style.display = ''; // Показываем панель
            panel.querySelectorAll('li.repo').forEach(item => {
                item.style.display = ''; // Показываем все repo-элементы внутри
            });
        });
        filterButton.classList.remove('is-active');
    }

    // --- Обработчики событий и MutationObserver ---

    filterButton.addEventListener('click', runFilter);
    resetButton.addEventListener('click', resetFilter);

    const targetNode = document.querySelector('.history-container');
    if (targetNode) {
        const observer = new MutationObserver((mutationsList, observer) => {
            if (filterButton.classList.contains('is-active')) {
                 // Просто перезапускаем фильтр для всего документа.
                 // Это проще и надежнее, чем отслеживать только новые узлы.
                 runFilter();
            }
        });
        observer.observe(targetNode, { childList: true, subtree: true });
    }

})();