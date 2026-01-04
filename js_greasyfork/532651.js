// ==UserScript==
// @name         Auto Click Cloudflare Ignore & Proceed
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Автоматически нажимает кнопку "Ignore & Proceed" в предупреждении Cloudflare
// @author       thebelg
// @match        *://*/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/532651/Auto%20Click%20Cloudflare%20Ignore%20%20Proceed.user.js
// @updateURL https://update.greasyfork.org/scripts/532651/Auto%20Click%20Cloudflare%20Ignore%20%20Proceed.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickIgnoreButton() {
        // Ищем кнопку по разным возможным селекторам
        const ignoreButtonSelectors = [
            'button:contains("Ignore & Proceed")',
            'a:contains("Ignore & Proceed")',
            'button.ignore-button',
            'a.ignore-button',
            'button[class*="ignore"]',
            'a[class*="ignore"]',
            '[onclick*="ignore"]',
            '[id*="ignore"]',
            '[class*="proceed"]'
        ];

        // Перебираем селекторы и пытаемся найти и нажать на кнопку
        for (const selector of ignoreButtonSelectors) {
            try {
                // Поиск по тексту содержимого
                const buttonsByText = Array.from(document.querySelectorAll('button, a, input[type="button"], input[type="submit"]'))
                    .filter(el => el.textContent && el.textContent.includes('Ignore') && el.textContent.includes('Proceed'));

                if (buttonsByText.length > 0) {
                    buttonsByText[0].click();
                    console.log('Clicked ignore button by text content');
                    return true;
                }

                // Поиск по селектору
                const buttons = document.querySelectorAll(selector);
                if (buttons.length > 0) {
                    buttons[0].click();
                    console.log('Clicked ignore button by selector: ' + selector);
                    return true;
                }
            } catch (e) {
                // Игнорируем ошибки селекторов
            }
        }

        return false;
    }

    // Функция, которая будет вызываться несколько раз для попытки нажатия на кнопку
    function attemptToClick() {
        if (clickIgnoreButton()) {
            console.log('Successfully clicked the ignore button');
        } else {
            console.log('Button not found yet');
        }
    }

    // Запускаем попытки клика как можно раньше и часто
    // Начинаем с минимальной задержки и увеличиваем интервал
    for (let i = 0; i < 5; i++) {
        setTimeout(attemptToClick, 50 * i); // Первые попытки - очень быстро (50, 100, 150, 200, 250 мс)
    }

    for (let i = 0; i < 10; i++) {
        setTimeout(attemptToClick, 300 + 100 * i); // Следующие попытки с интервалом в 100 мс
    }

    // Запускаем при загрузке DOM для надежности
    document.addEventListener('DOMContentLoaded', function() {
        attemptToClick();
        // Еще несколько попыток после загрузки DOM
        setTimeout(attemptToClick, 50);
        setTimeout(attemptToClick, 100);
        setTimeout(attemptToClick, 200);
    });

    // Установим MutationObserver для отслеживания появления кнопки в динамически загружаемом контенте
    function setupObserver() {
        if (!document.body) return;

        const observer = new MutationObserver(function(mutations) {
            for (const mutation of mutations) {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    // Если были добавлены новые узлы, пробуем нажать на кнопку
                    attemptToClick();
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Запускаем наблюдатель как можно раньше
    if (document.body) setupObserver();
    else document.addEventListener('DOMContentLoaded', setupObserver);
})();