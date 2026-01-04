// ==UserScript==
// @name         DayOne Autohider for left panel
// @namespace    http://tampermonkey.net/
// @version      2024-11-30
// @description  Autoclicker Panel hider
// @author       LuxTallis
// @match        https://dayone.me/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dayone.me
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519491/DayOne%20Autohider%20for%20left%20panel.user.js
// @updateURL https://update.greasyfork.org/scripts/519491/DayOne%20Autohider%20for%20left%20panel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для попытки найти и кликнуть по кнопке
    function tryClickButton() {
        const button = document.querySelector('.left-side > button:nth-child(1)');
        if (button) {
            button.click();
            console.log('Кнопка найдена и нажата.');
        } else {
            console.log('Кнопка пока не найдена. Пробуем ещё раз.');
            setTimeout(tryClickButton, 1000); // Повторяем попытку через 1 секунду
        }
    }

    // Запускаем первую попытку
    tryClickButton();
})();