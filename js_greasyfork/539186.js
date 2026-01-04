// ==UserScript==
// @name         AI Studio - Auto-enable Grounding (Polite)
// @name:ru      AI Studio - Авто-включение поиска Google (Вежливая версия)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Automatically enables the "Grounding with Google Search" toggle once per view, and does not re-enable it if you manually turn it off.
// @description:ru Автоматически включает переключатель "Grounding with Google Search" один раз при появлении, и не включает его повторно, если вы его отключили вручную.
// @author       Your Name
// @match        https://aistudio.google.com/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539186/AI%20Studio%20-%20Auto-enable%20Grounding%20%28Polite%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539186/AI%20Studio%20-%20Auto-enable%20Grounding%20%28Polite%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- КОНФИГУРАЦИЯ ---
    const processedAttribute = 'data-grounding-processed'; // Атрибут для пометки обработанных кнопок
    const toggleButtonSelector = `button[aria-label="Grounding with Google Search"]:not([${processedAttribute}])`; // Ищем только НЕ помеченные кнопки

    console.log('[AI Studio Toggler] Скрипт запущен и наблюдает за изменениями...');

    // --- ОСНОВНАЯ ФУНКЦИЯ ПОИСКА И ОБРАБОТКИ ПЕРЕКЛЮЧАТЕЛЯ ---
    function processNewToggle() {
        const toggleButton = document.querySelector(toggleButtonSelector);

        if (toggleButton) {
            // Кнопка найдена. СРАЗУ помечаем ее как обработанную, чтобы избежать повторных срабатываний.
            console.log('[AI Studio Toggler] Найдена новая, необработанная кнопка.');
            toggleButton.setAttribute(processedAttribute, 'true');

            // Теперь проверяем, нужно ли ее включать.
            if (toggleButton.getAttribute('aria-checked') === 'false') {
                console.log('[AI Studio Toggler] Переключатель выключен. Включаем...');
                toggleButton.click();
                console.log('[AI Studio Toggler] Переключатель включен. Больше эта кнопка не будет обрабатываться автоматически.');
            } else {
                console.log('[AI Studio Toggler] Переключатель уже был включен. Больше эта кнопка не будет обрабатываться автоматически.');
            }
        }
    }

    // --- НАБЛЮДАТЕЛЬ ЗА ИЗМЕНЕНИЯМИ DOM (MutationObserver) ---
    // Наблюдатель будет вызывать нашу функцию при появлении новых элементов на странице.
    const observer = new MutationObserver((mutationsList, observer) => {
        // Оптимизация: если мы видим, что на странице уже есть кнопка, но она не обработана,
        // то запускаем нашу логику. Это предотвращает лишние вызовы на мелкие изменения.
        if (document.querySelector(toggleButtonSelector)) {
            processNewToggle();
        }
    });

    // Начинаем наблюдение за изменениями в основном контейнере приложения.
    observer.observe(document.body, { childList: true, subtree: true });

    // --- ПЕРВЫЙ ЗАПУСК ПРИ ЗАГРУЗКЕ СКРИПТА ---
    // Это нужно, чтобы скрипт сработал сразу при загрузке страницы,
    // не дожидаясь первого изменения DOM.
    // Даем небольшую задержку, чтобы интерфейс успел прогрузиться.
    setTimeout(processNewToggle, 500);

})();