// ==UserScript==
// @name         AUTOsda4a
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  авто сдал и забыл
// @author       ZV
// @match        *://*/Admin/MyCurrentTask/Active
// @icon         https://www.google.com/s2/favicons?sz=64&domain=triplenext.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509073/AUTOsda4a.user.js
// @updateURL https://update.greasyfork.org/scripts/509073/AUTOsda4a.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для проверки таймера
    function checkTimer() {
        const timerElement = document.getElementById('countdown');
        if (timerElement) {
            const timerText = timerElement.textContent.trim();
            if (timerText === "Remaining 00:00:20") { // Замените на ваше значение
                console.log("Таймер достиг 00:00:20. Завершаем задачу...");
                const doneButton = document.getElementById('done-task');
                if (doneButton) {
                    doneButton.click();
                    console.log("Нажали на кнопку 'Done'. Ждём 2 секунды...");
                }
            }
        }
    }

    // Переопределение стандартного confirm
    window.confirm = function() {
        console.log('Окно подтверждения перехвачено!');
        return true; // Всегда нажимает "ОК"
    };


    // Запускаем проверку таймера каждую секунду
    setInterval(checkTimer, 1000);

})();