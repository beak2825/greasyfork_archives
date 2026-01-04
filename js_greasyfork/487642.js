// ==UserScript==
// @name         FPS UNLOCKER ДЛЯ Evades.io
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Попытка разблокировать максимальный FPS до 165 для игры Evades.io
// @author       You
// @match        https://evades.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487642/FPS%20UNLOCKER%20%D0%94%D0%9B%D0%AF%20Evadesio.user.js
// @updateURL https://update.greasyfork.org/scripts/487642/FPS%20UNLOCKER%20%D0%94%D0%9B%D0%AF%20Evadesio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Определяем функцию для изменения FPS
    function changeFPS() {
        // Попытаемся найти объект игры
        var game = document.getElementById('game');

        // Если объект игры найден
        if (game) {
            // Устанавливаем новое значение максимального FPS
            game.FPSLimit = 165;
        }
    }

    // Вызываем функцию изменения FPS
    changeFPS();
})();
