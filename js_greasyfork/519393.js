// ==UserScript==
// @name         CAI Auto Hide left panel in chats
// @namespace    http://tampermonkey.net/
// @version      2024-11-30
// @author       LuxTallis
// @description  Hides left panel in chats
// @match        https://character.ai/chat/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=character.ai
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519393/CAI%20Auto%20Hide%20left%20panel%20in%20chats.user.js
// @updateURL https://update.greasyfork.org/scripts/519393/CAI%20Auto%20Hide%20left%20panel%20in%20chats.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для попытки найти и кликнуть по кнопке
    function tryClickButton() {
        const button = document.querySelector('button.text-sm');
        if (button) {
            button.click();
            console.log('Кнопка с селектором "button.text-sm" найдена и нажата.');
        } else {
            console.log('Кнопка с селектором "button.text-sm" пока не найдена. Пробуем ещё раз.');
            setTimeout(tryClickButton, 1000); // Повторяем попытку через 1 секунду
        }
    }

    // Запускаем первую попытку
    tryClickButton();
})();
