// ==UserScript==
// @name         HeroesWM Inventory Stars Hider
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Удаляет артефакты инвентаря, отмеченные звёздами, только для вкладки "Все артефакты".
// @author       o3-mini-ChatGPT
// @match        https://www.heroeswm.ru/inventory.php*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526969/HeroesWM%20Inventory%20Stars%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/526969/HeroesWM%20Inventory%20Stars%20Hider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Массив подстрок для поиска нужных звездочек
    const starIndicators = [
        'src="https://dcdn.heroeswm.ru/i/inv_im/small_star2.png"',
        'src="https://dcdn.heroeswm.ru/i/inv_im/small_star1.png"'
    ];

    /**
     * Функция проверяет, содержит ли элемент одну из указанных подстрок.
     * @param {HTMLElement} element - Элемент для проверки.
     * @returns {boolean} - Возвращает true, если элемент содержит хотя бы одну из строк.
     */
    function containsStarIndicator(element) {
        return starIndicators.some(indicator => element.innerHTML.indexOf(indicator) !== -1);
    }

    /**
     * Функция проверяет, активна ли вкладка "Все артефакты" (filter_tab1).
     * @returns {boolean} - Возвращает true, если filter_tab1 имеет класс 'filter_tab_active'.
     */
    function isFilterTab1Active() {
        const filterTab1 = document.getElementById('filter_tab1');
        return filterTab1 && filterTab1.classList.contains('filter_tab_active');
    }

    /**
     * Функция удаляет все элементы инвентаря (id начинается с "id_inv_item"),
     * если они содержат указанные изображения звезд, а также только если активна вкладка filter_tab1.
     */
    function removeStarElements() {
        if (!isFilterTab1Active()) {
            console.log('Filter Tab 1 не активна – удаление не производится.');
            return;
        }
        const inventoryItems = document.querySelectorAll("div[id^='id_inv_item']");
        inventoryItems.forEach(item => {
            if (containsStarIndicator(item)) {
                item.remove();
                console.log("Удален элемент инвентаря, содержащий звезду:", item);
            }
        });
    }

    // Первый проход при загрузке страницы
    removeStarElements();

    // Наблюдатель за динамическим добавлением элементов в DOM
    const observer = new MutationObserver(mutations => {
        // Если вкладка filter_tab1 не активна – никаких изменений не обрабатываем
        if (!isFilterTab1Active()) return;

        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                // Обрабатываем только элементы
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // Если добавлен элемент инвентаря с нужным id и он содержит звездный индикатор
                    if (node.id && node.id.indexOf("id_inv_item") === 0 && containsStarIndicator(node)) {
                        node.remove();
                        console.log("Удален динамически добавленный элемент инвентаря:", node);
                    }
                    // Проверяем всех потомков добавленного элемента, если вдруг они содержат inventory items
                    const descendants = node.querySelectorAll("div[id^='id_inv_item']");
                    descendants.forEach(descendant => {
                        if (containsStarIndicator(descendant)) {
                            descendant.remove();
                            console.log("Удален динамически добавленный потомок инвентаря:", descendant);
                        }
                    });
                }
            });
        });
    });

    // Наблюдаем за изменениями во всем теле документа
    observer.observe(document.body, { childList: true, subtree: true });

    // Если вкладки меняются, можем контролировать повторное выполнение удаления.
    // Подписываемся на клик по элементам фильтра, затем через небольшой интервал запускаем проверку.
    document.querySelectorAll('.filter_tab').forEach(tab => {
        tab.addEventListener('click', () => {
            // Задержка для того, чтобы изменения классов отработали
            setTimeout(removeStarElements, 200);
        });
    });
})();
