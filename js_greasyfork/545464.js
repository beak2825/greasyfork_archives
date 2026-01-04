// ==UserScript==
// @name         Steam Custom Price Filter (RU) - v2.3
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Добавляет фильтр по минимальной и максимальной цене на страницу поиска Steam. Работает с бесконечной прокруткой и без перезагрузок.
// @author       torch
// @match        https://store.steampowered.com/search/*
// @grant        GM_addStyle
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545464/Steam%20Custom%20Price%20Filter%20%28RU%29%20-%20v23.user.js
// @updateURL https://update.greasyfork.org/scripts/545464/Steam%20Custom%20Price%20Filter%20%28RU%29%20-%20v23.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let debounceTimer;
    let observer; // Объявляем наблюдателя в глобальной области видимости скрипта

    // Добавляем наш CSS-класс для скрытия элементов. !important гарантирует, что наш стиль будет приоритетнее.
    GM_addStyle('.custom-price-hidden { display: none !important; }');

    // --- Функция для создания UI фильтра ---
    function createPriceFilterUI() {
        const rightColumn = document.getElementById('additional_search_options');
        if (!rightColumn) {
            setTimeout(createPriceFilterUI, 500);
            return;
        }
        if (document.getElementById('custom_price_filter_container')) return;

        const filterContainer = document.createElement('div');
        filterContainer.className = 'block search_collapse_block';
        filterContainer.id = 'custom_price_filter_container';
        filterContainer.innerHTML = `
            <div class="block_header">
                <div>Пользовательская цена</div>
            </div>
            <div class="block_content block_content_inner" style="display: block;">
                <div id="custom_price_filter_inputs">
                    <input type="number" id="min_price_input" placeholder="От (руб.)" min="0" step="1">
                    <span>-</span>
                    <input type="number" id="max_price_input" placeholder="До (руб.)" min="0" step="1">
                </div>
            </div>
        `;
        rightColumn.prepend(filterContainer);

        GM_addStyle(`
            #custom_price_filter_inputs { display: flex; align-items: center; justify-content: space-between; gap: 5px; padding: 5px 0; }
            #custom_price_filter_inputs input[type="number"] { width: 42%; padding: 5px; border: 1px solid #3d4450; background-color: #31363f; color: #c7d5e0; border-radius: 3px; }
            #custom_price_filter_inputs input[type="number"]:focus { border-color: #5b9ed8; outline: none; }
            #custom_price_filter_inputs input::-webkit-outer-spin-button,
            #custom_price_filter_inputs input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
            #custom_price_filter_inputs input[type=number] { -moz-appearance: textfield; }
        `);

        // Назначаем обработчики событий
        const minPriceInput = document.getElementById('min_price_input');
        const maxPriceInput = document.getElementById('max_price_input');

        const handleInput = (event) => {
            event.stopPropagation();
            debounce(applyPriceFilter, 300);
        };
        const handleKeydown = (event) => event.stopPropagation();

        minPriceInput.addEventListener('input', handleInput);
        minPriceInput.addEventListener('keydown', handleKeydown);

        maxPriceInput.addEventListener('input', handleInput);
        maxPriceInput.addEventListener('keydown', handleKeydown);
    }

    function debounce(func, delay) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(func, delay);
    }

    // --- Основная функция фильтрации ---
    function applyPriceFilter() {
        const minPriceInput = document.getElementById('min_price_input');
        const maxPriceInput = document.getElementById('max_price_input');
        if (!minPriceInput || !maxPriceInput) return;

        const minPrice = minPriceInput.value ? parseFloat(minPriceInput.value) * 100 : null;
        const maxPrice = maxPriceInput.value ? parseFloat(maxPriceInput.value) * 100 : null;

        const resultsRows = document.querySelectorAll('#search_resultsRows > a.search_result_row');

        resultsRows.forEach(row => {
            const priceElement = row.querySelector('[data-price-final]');
            const priceAttr = priceElement ? priceElement.getAttribute('data-price-final') : '0';

            let itemPrice = 0;
            if (priceAttr !== null && priceAttr !== "") {
                const parsedPrice = parseInt(priceAttr, 10);
                if (!isNaN(parsedPrice)) itemPrice = parsedPrice;
            }

            const isMinOk = minPrice === null || itemPrice >= minPrice;
            const isMaxOk = maxPrice === null || itemPrice <= maxPrice;

            if (isMinOk && isMaxOk) {
                row.classList.remove('custom-price-hidden');
            } else {
                row.classList.add('custom-price-hidden');
            }
        });
    }

    // --- Функция для запуска наблюдателя ---
    function startObserver() {
        const targetNode = document.getElementById('search_results');
        if (!targetNode) {
            setTimeout(startObserver, 500);
            return;
        }

        observer = new MutationObserver((mutations) => {
            for(const mutation of mutations) {
                // Мы реагируем, если были добавлены новые элементы (игры)
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Используем debounce, чтобы примениться один раз после завершения всех добавлений
                    debounce(applyPriceFilter, 150);
                    break;
                }
            }
        });

        // Наблюдаем за контейнером, в который Steam добавляет новые результаты
        observer.observe(targetNode, { childList: true, subtree: true });
    }

    // --- Инициализация ---
    // Ждем, пока страница полностью загрузится, чтобы все элементы были на месте
    window.addEventListener('load', () => {
        createPriceFilterUI();
        startObserver();
        // Применяем фильтр один раз после загрузки страницы
        setTimeout(applyPriceFilter, 500);
    });

})();