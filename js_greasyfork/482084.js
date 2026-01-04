// ==UserScript==
// @name         AutoHideLZT
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Автоматически добавляет хайд при отправке сообщений на сайтах зеленка и лолз.
// @author       naithy & eretly & Timka241
// @match        https://zelenka.guru/*
// @match        https://lolz.guru/*
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6P-us9TBOHABul4NCBuCWU6_W-b1DA_8YmA&s
// @match        https://lolz.live/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482084/AutoHideLZT.user.js
// @updateURL https://update.greasyfork.org/scripts/482084/AutoHideLZT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Статичные ID по умолчанию
    let exceptIds = "7202560, 7749892, 84800, 3812139";

    // Функция для добавления [exceptids=ID] и [/exceptids] к тексту
    function modifyMessageInput() {
        const inputElement = document.querySelector('.fr-element.fr-view.fr-element-scroll-visible');  // Найти нужный элемент
        if (inputElement) {
            let currentText = inputElement.innerHTML.trim();
            if (!currentText.startsWith(`[exceptids=${exceptIds}]`)) {
                inputElement.innerHTML = `[exceptids=${exceptIds}]` + currentText + `[/exceptids]`;
            }
        }
    }

    // Обработчик для кнопок отправки
    document.addEventListener('click', function(event) {
        const button = event.target;
        if (button.classList.contains('lzt-fe-se-sendMessageButton') ||
            (button.classList.contains('button') && button.classList.contains('primary') && button.classList.contains('mbottom'))) {
            modifyMessageInput();
        }
    });

})();
