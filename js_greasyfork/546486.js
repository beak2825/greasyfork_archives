// ==UserScript==
// @name         чат-
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Кликает кнопку уменьшения чата дважды с интервалом 1 секунду
// @author       Ваше имя
// @match        https://asteriagame.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546486/%D1%87%D0%B0%D1%82-.user.js
// @updateURL https://update.greasyfork.org/scripts/546486/%D1%87%D0%B0%D1%82-.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Конфигурация
    const config = {
        initialDelay: 5000,    // 5 секунд перед первым кликом
        clickInterval: 1000,   // 1 секунда между кликами
        maxAttempts: 5,        // Максимальное количество попыток
        attemptDelay: 1500     // Задержка между попытками
    };

    let attempts = 0;

    function performClicks(button) {
        console.log('Выполняю двойной клик...');

        // Первый клик
        button.click();
        console.log('Первый клик выполнен');

        // Второй клик через указанный интервал
        setTimeout(() => {
            button.click();
            console.log('Второй клик выполнен');
        }, config.clickInterval);
    }

    function tryFindButton() {
        attempts++;
        console.log(`Попытка ${attempts} найти кнопку...`);

        const button = document.querySelector('#change_chat_size > tbody > tr > td:nth-child(2) > img') ||
                      document.querySelector('img[src*="cht-resize-down.png"]');

        if (button) {
            console.log('Кнопка найдена!');
            performClicks(button);
        } else if (attempts < config.maxAttempts) {
            console.log('Кнопка не найдена, повторная попытка...');
            setTimeout(tryFindButton, config.attemptDelay);
        } else {
            console.log('Кнопка не найдена после всех попыток');
        }
    }

    // Основной запуск
    setTimeout(() => {
        console.log('Начало поиска кнопки (после задержки 5 сек)');
        tryFindButton();
    }, config.initialDelay);

    // Альтернативный вариант через MutationObserver для динамического контента
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            const button = document.querySelector('#change_chat_size > tbody > tr > td:nth-child(2) > img');
            if (button && !window.autoClickPerformed) {
                window.autoClickPerformed = true;
                console.log('Кнопка найдена через MutationObserver');
                performClicks(button);
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });
})();