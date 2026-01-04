// ==UserScript==
// @name         Установить температуру на 2
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Надёжно устанавливает значение слайдера температуры на 2 в Google AI Studio, периодически проверяя его наличие.
// @match        https://aistudio.google.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546252/%D0%A3%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%B8%D1%82%D1%8C%20%D1%82%D0%B5%D0%BC%D0%BF%D0%B5%D1%80%D0%B0%D1%82%D1%83%D1%80%D1%83%20%D0%BD%D0%B0%202.user.js
// @updateURL https://update.greasyfork.org/scripts/546252/%D0%A3%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%B8%D1%82%D1%8C%20%D1%82%D0%B5%D0%BC%D0%BF%D0%B5%D1%80%D0%B0%D1%82%D1%83%D1%80%D1%83%20%D0%BD%D0%B0%202.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Переменная для хранения ID нашего интервала, чтобы мы могли его остановить.
    let temperatureInterval = null;

    /**
     * Основная функция, которая ищет и настраивает слайдер.
     */
    function findAndSetTemperature() {
        // Пытаемся найти сам input слайдера по более точному селектору.
        // Это ищет input с классом .mdc-slider__input внутри контейнера с data-test-id.
        const sliderInput = document.querySelector('div[data-test-id="temperatureSliderContainer"] input.mdc-slider__input');

        // Если слайдер найден на странице...
        if (sliderInput) {
            // ...и его значение ещё не установлено на 2...
            if (sliderInput.value !== '2') {
                console.log('Tampermonkey: Слайдер температуры найден. Устанавливаю значение на 2.');

                // Устанавливаем значение
                sliderInput.value = '2';

                // Создаём и отправляем события, чтобы сайт "увидел" изменения.
                // Это ключевой момент для сайтов на фреймворках.
                sliderInput.dispatchEvent(new Event('input', { bubbles: true }));
                sliderInput.dispatchEvent(new Event('change', { bubbles: true }));

                console.log('Tampermonkey: Значение успешно установлено.');
            }

            // Если слайдер найден (неважно, изменили мы его или он уже был "2"),
            // останавливаем дальнейшие проверки, чтобы не нагружать браузер.
            clearInterval(temperatureInterval);
        }
    }

    /**
     * Запускает периодическую проверку наличия слайдера.
     * Мы используем setInterval вместо MutationObserver, так как это более надежно
     * для сложных компонентов, которые могут перерисовываться несколько раз.
     */
    function startMonitoring() {
        // Если уже есть активный интервал, сначала остановим его.
        if (temperatureInterval) {
            clearInterval(temperatureInterval);
        }
        // Запускаем функцию findAndSetTemperature каждые 250 миллисекунд (4 раза в секунду).
        temperatureInterval = setInterval(findAndSetTemperature, 250);
    }

    // --- Логика перезапуска ---
    // Google AI Studio - это одностраничное приложение. URL меняется, но страница не перезагружается.
    // Нам нужно отслеживать смену URL, чтобы перезапускать наш скрипт.

    let lastUrl = location.href;
    new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            console.log(`Tampermonkey: URL изменился на ${currentUrl}. Перезапускаю поиск слайдера.`);
            // При смене URL перезапускаем мониторинг.
            startMonitoring();
        }
    }).observe(document.body, { childList: true, subtree: true });


    // Запускаем мониторинг при первой загрузке скрипта.
    console.log('Tampermonkey: Скрипт для установки температуры активирован.');
    startMonitoring();

})();