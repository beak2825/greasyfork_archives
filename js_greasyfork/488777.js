// ==UserScript==
// @name         Генератор случайных ходов
// @namespace    https://greasyfork.org/en/users/1261878-twice2750
// @version      1.0
// @description  Добавляет флажок во время боя, позволяющий включить отображение случайного типа последователей
// @license      MIT
// @match        https://www.fantasyland.ru/cgi/armylist_yours.php
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/488777/%D0%93%D0%B5%D0%BD%D0%B5%D1%80%D0%B0%D1%82%D0%BE%D1%80%20%D1%81%D0%BB%D1%83%D1%87%D0%B0%D0%B9%D0%BD%D1%8B%D1%85%20%D1%85%D0%BE%D0%B4%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/488777/%D0%93%D0%B5%D0%BD%D0%B5%D1%80%D0%B0%D1%82%D0%BE%D1%80%20%D1%81%D0%BB%D1%83%D1%87%D0%B0%D0%B9%D0%BD%D1%8B%D1%85%20%D1%85%D0%BE%D0%B4%D0%BE%D0%B2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Функция добавления флажка на страницу
    function addCheckbox() {

        // Находим конец панели с опциями
        const target = document.querySelector("#SmallUnit");

        // Находим все кнопки с последователями
        const buttons = document.querySelectorAll('div.cp');

        // Находим тип последователей "Все"
        const link = document.getElementById("ud1");

        // Создаем флажок
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'randomCategoryCheckbox';
        checkbox.title = 'Случайный тип последователей';

        // Определяем значение флажка, если оно было сохранено ранее
        var storedState = GM_getValue('randomCategoryCheckbox', 'unchecked');
        if (storedState === 'checked') {
              checkbox.checked = true;
              chooseRandomCategory();
        }

        // Добавляем флажок на страницу
        target.after(checkbox);

        // Добавляем слушатель событий к флажку
        checkbox.addEventListener('change', function () {
              if (checkbox.checked) {
                    chooseRandomCategory();
                    GM_setValue('randomCategoryCheckbox', 'checked');
              } else {
                    link.click();
                    GM_setValue('randomCategoryCheckbox', 'unchecked');
              }
        });

        // Добавляем слушатель событий к кнопкам с последователями
        buttons.forEach (button => {
              button.addEventListener('click', function () {
                    if (checkbox.checked) {
                        chooseRandomCategory();
                    }
              });
        });
    }

    // Функция выбора случайного типа последователей
    function chooseRandomCategory() {
        var i = Math.floor(Math.random() * 3) + 2;
        var link = document.getElementById("ud" + i);
        link.click();
    }

    // Добавляем флажок после полной загрузки страницы
    window.addEventListener('load', addCheckbox);
})();