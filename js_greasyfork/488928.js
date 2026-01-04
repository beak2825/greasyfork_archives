// ==UserScript==
// @name            HotPot.ai Free Unlimited Create
// @namespace       Wizzergod
// @version         1.0.3
// @description     Unlimited Create Points and unlock button create whe some generate to generate more in same time.
// @icon            https://www.google.com/s2/favicons?sz=64&domain=hotpot.ai
// @license         MIT
// @author          Wizzergod
// @match           *://hotpot.ai/art-generator*
// @match           *://hotpot.ai/remove-background*
// @match           *://hotpot.ai/anime-generator*
// @match           *://hotpot.ai/logo-generator*
// @match           *://hotpot.ai/headshot/train*
// @match           *://hotpot.ai/colorize-picture*
// @match           *://hotpot.ai/restore-picture*
// @match           *://hotpot.ai/enhance-face*
// @match           *://hotpot.ai/drive*
// @match           *://hotpot.ai/s/*
// @match           *://hotpot.ai/upscale-photo*
// @match           *://hotpot.ai/sparkwriter*
// @match           *://hotpot.ai/background-generator*
// @match           *://hotpot.ai/lunar-new-year-headshot*
// @match           *://hotpot.ai/ai-avatar*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/488928/HotPotai%20Free%20Unlimited%20Create.user.js
// @updateURL https://update.greasyfork.org/scripts/488928/HotPotai%20Free%20Unlimited%20Create.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var codeFunctions = [
        // Функция для выполнения замены класса и отключения стилей
        function replaceClassAndDisableStyles() {
            var controlBox = document.getElementById("controlBox");
            if (controlBox) {
                controlBox.classList.remove("disabled");
            }

            // Создаем новый стиль, который переопределяет стили класса .disabled
            var style = document.createElement('style');
            style.innerHTML = '.disabled { pointer-events: auto !important; opacity: 1 !important; }';
            document.head.appendChild(style);
        },

        // Функция для обновления значения в локальном хранилище
        function updateLocalStorage() {
            var key = "ai.hotpot.helpers.requestCounter.8";
            var newValue = {
                "lastRequestTime": "1991-08-14T06:35:43.910Z",
                "numRequests": -999999,
            };
            localStorage.setItem(key, JSON.stringify(newValue));
        }
    ];

    // Наблюдение за изменениями в DOM
    var observer = new MutationObserver(function() {
        codeFunctions.forEach(function(func) {
            func();
        });
    });

    // Настройка параметров наблюдения
    var config = { childList: true, subtree: true };

    // Запуск наблюдения за изменениями
    observer.observe(document.body, config);

    // Выполнение замены класса, отключения стилей и обновления локального хранилища при загрузке страницы
    codeFunctions.forEach(function(func) {
        func();
    });
})();
