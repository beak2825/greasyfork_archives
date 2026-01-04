// ==UserScript==
// @name         Удаление рекламы v2
// @namespace    http://tampermonkey.net/
// @version      2025-02-10
// @description  Удаление элементов по ID, селектору, атрибуту и N-му родителю.
// @author       ...
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534723/%D0%A3%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%80%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D1%8B%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/534723/%D0%A3%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D1%80%D0%B5%D0%BA%D0%BB%D0%B0%D0%BC%D1%8B%20v2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- НАСТРОЙКИ УДАЛЕНИЯ ---

    // 1. Селекторы элементов, которые нужно удалить целиком
    //    Можно использовать ID (#id), классы (.class), атрибуты ([data-attr="value"]) и т.д.
    const selectorsToRemoveSelf = [
        // По ID
        '#animation_container',
        '#n0cyox3',
        '#kvWKB544280753',
        '#AdvProductGalleryLeft__fiw5zyuuoh13y97lat2hs-PPDJVqc',
        '#mTBBFsUcNYzrXnfc',

        // По классам
        '.styles_adBlockWarningRoot__wgxZA',
        '.vwo__cadbbbddaa',
        '.business-card-title-view__advert-unit',
        '.business-card-title-view__call-to-action',
        '.card-special-offers-view._view_narrow',
        '.adfox_shown_yes',
        '.p6g0q6xzgwduth6unylwoifmdwm8kv5l',
        '.afisha-profit-banner',
        '.UZznxc',
        '.adv',
        '.t857fd0ab',
        '.wded4f4e0',
        '.AdvRsya-Slot',
        '.mini-suggest__item_with-button',
        '.main-home-banner',
        '.toponym-card-view__advert-unit',
        '.AdvRsyaCrossPage',
        '.AdvProductGallery',
        '.AppMoneySidebar_wrap__2qJIK',
        '.AppForecastMoney_wrap__KdMw_',
        '.mdAoPtFInYnvQhPtha1k0',
        '.mYgoauUUQQX7LjA',
        '.c__ebfeebccdefea',
        '.aptoj__ffdcdebbbaedddc',
        '.eca1c2c96',
        '.MMSidebar-Card_bottomAdv',

        // По атрибутам
        '[data-tid="37b61dba"]',
        '[data-tid="5da1a3ef"]',
        '[data-tid="90f1e109"]',
        '[data-chunk="promo-chunk"]',
        '[data-test-id="afishaProfit.wrapper"]',
        '[data-log-node="1_m4n9w002-0"]',
    ];

    // 2. Селекторы элементов, у которых нужно удалить N-го родителя
    //    `selector`: CSS-селектор для поиска дочернего элемента
    //    `level`:    Номер родителя для удаления (1 = прямой родитель, 2 = "дедушка" и т.д.)
    const selectorsToRemoveNthParent = [
        // Старые `classesToRemoveParents` (удаляем прямого родителя, level: 1)
        { selector: '.body__feed-wrapper', level: 1 },
        { selector: '.Organic_withAdvLabel', level: 1 },
        { selector: '.business-card-view__offers', level: 1 },
        { selector: '.Organic_withPromoOffer', level: 1 },

        { selector: '.banner-view', level: 3 },

        // Старый `removeAdWrapperElements` (удаляем 4-го родителя, level: 4)
        { selector: '.AdvLabel', level: 3 },
        { selector: '[data-name="adWrapper"]', level: 4 },

        // Пример: Удалить 2-го родителя элемента с классом 'some-ad-container'
        // { selector: '.some-ad-container', level: 2 },

        // Пример: Удалить 3-го родителя элемента с ID 'annoying-popup'
        // { selector: '#annoying-popup', level: 3 },
    ];

    // --- ЛОГИКА УДАЛЕНИЯ ---

    // Удаляет все элементы, соответствующие селектору
    function removeElementsBySelector(selector, context = document) {
        try {
            const elements = context.querySelectorAll(selector);
            elements.forEach(el => {
                el.remove();
                // console.log(`Removed element matching selector: "${selector}"`);
            });
            return elements.length > 0; // Возвращаем true, если что-то удалили
        } catch (error) {
            console.error(`Error removing elements with selector "${selector}":`, error);
            return false;
        }
    }

    // Находит N-го родителя элемента
    function findNthParent(element, level) {
        let parent = element;
        for (let i = 0; i < level; i++) {
            if (!parent.parentElement) {
                return null; // Не удалось подняться на нужный уровень
            }
            parent = parent.parentElement;
        }
        return parent;
    }

    // Удаляет N-го родителя для всех элементов, соответствующих селектору
    function removeNthParentBySelector(selector, level, context = document) {
        if (level < 1) {
            console.warn(`Invalid level ${level} for selector "${selector}". Level must be 1 or greater.`);
            return false;
        }
        let removed = false;
        try {
            const elements = context.querySelectorAll(selector);
            elements.forEach(el => {
                const parentToRemove = findNthParent(el, level);
                if (parentToRemove && parentToRemove !== document.body && parentToRemove !== document.documentElement) {
                    parentToRemove.remove();
                    // console.log(`Removed ${level}-th parent of element matching selector: "${selector}"`);
                    removed = true;
                }
            });
        } catch (error) {
            console.error(`Error removing ${level}-th parent for selector "${selector}":`, error);
        }
        return removed;
    }

    // Главная функция, запускающая все операции удаления
    function runRemovals(context = document) {
        let changesMade = false;

        // 1. Удаляем сами элементы
        selectorsToRemoveSelf.forEach(selector => {
            if (removeElementsBySelector(selector, context)) {
                changesMade = true;
            }
        });

        // 2. Удаляем N-ных родителей
        selectorsToRemoveNthParent.forEach(item => {
            if (removeNthParentBySelector(item.selector, item.level, context)) {
                changesMade = true;
            }
        });

        // Дополнительная очистка (опционально, можно добавить больше правил)
        // Например, удалить пустые контейнеры, оставшиеся после удаления рекламы
        // if (changesMade) {
        //     cleanupEmptyContainers();
        // }
    }

    // --- ИНИЦИАЛИЗАЦИЯ И ОТСЛЕЖИВАНИЕ ---

    // Первичный запуск при загрузке скрипта
    runRemovals();

    // Наблюдатель за изменениями в DOM (для динамически загружаемого контента)
    const observer = new MutationObserver(mutations => {
        // Оптимизация: Проверяем, были ли добавлены узлы перед повторным полным сканированием
        let nodesAdded = false;
        for (const mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                nodesAdded = true;
                break;
            }
        }

        // Если узлы были добавлены, запускаем проверки снова
        if (nodesAdded) {
            // Можно передать mutation.target или document для сканирования только измененной части,
            // но для простоты и надежности пока сканируем весь документ.
            runRemovals();
        }
    });

    // Начинаем наблюдение за всем документом
    observer.observe(document.body || document.documentElement, {
        childList: true, // Следить за добавлением/удалением дочерних узлов
        subtree: true
    });

    // Опционально: можно отключить наблюдатель через какое-то время, если страница статична
    // setTimeout(() => observer.disconnect(), 30000); // Остановить через 30 сек

})();