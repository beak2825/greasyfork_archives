// ==UserScript==
// @name         IST шапка
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  скрытие кнопок "Admin Home", "Moderator Home" и "yRuler.Manager" в шапке
// @author       You
// @match        https://tngadmin.triplenext.net/Admin/InteractiveSegmentation*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=triplenext.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493279/IST%20%D1%88%D0%B0%D0%BF%D0%BA%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/493279/IST%20%D1%88%D0%B0%D0%BF%D0%BA%D0%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Находим кнопку "Admin Home"
    var adminHomeButton = document.querySelector('a[href="/Admin"]');

    // Находим кнопку "Moderator Home"
    var moderatorHomeButton = document.querySelector('a[href="/Moderation"]');

    // Находим кнопку "yRuler.Manager"
    var yrulerManagerButton = document.querySelector('a.brand');

    // Скрываем кнопку "Admin Home", если она найдена
    if (adminHomeButton) {
        adminHomeButton.style.display = 'none';
    }

    // Скрываем кнопку "Moderator Home", если она найдена
    if (moderatorHomeButton) {
        moderatorHomeButton.style.display = 'none';
    }

    // Скрываем кнопку "yRuler.Manager", если она найдена
    if (yrulerManagerButton) {
        yrulerManagerButton.style.display = 'none';
    }

    // Находим кнопку Reset
    var resetButton = document.getElementById('reset-button');

    // Добавляем обработчик события клика на кнопку Reset
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            // Выводим диалоговое окно с вопросом
            var confirmation = confirm('Уверен?');

            // Если пользователь нажал "Да"
            if (confirmation) {
                // Продолжаем выполнение действия
            } else {
                // Прерываем выполнение действия
                return false;
            }
        });
    }
})();