// ==UserScript==
// @name         Fortnite Image Replacer and Add Button best-survey-skins
// @version      0.3
// @description  Replace images on Fortnite.gg and add FULL button
// @match        https://fortnite.gg/best-survey-skins
// @namespace https://greasyfork.org/users/789838
// @downloadURL https://update.greasyfork.org/scripts/483908/Fortnite%20Image%20Replacer%20and%20Add%20Button%20best-survey-skins.user.js
// @updateURL https://update.greasyfork.org/scripts/483908/Fortnite%20Image%20Replacer%20and%20Add%20Button%20best-survey-skins.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для замены изображений
    function replaceImages() {
        // Находим все элементы с классом fn-item
        var items = document.querySelectorAll('.fn-item');

        // Проходимся по каждому элементу
        items.forEach(function(item) {
            // Находим изображение внутри элемента
            var image = item.querySelector('.img');

            // Получаем текущий URL изображения
            var currentUrl = image.src;

            // Используем регулярное выражение для извлечения числа из URL
            var match = currentUrl.match(/https:\/\/fortnite\.gg\/img\/items-survey\/(\d+)\.jpg\?y/);

            // Проверяем, найдено ли число в URL
            if (match) {
                // Извлекаем значение изображения
                var value = match[1];

                // Формируем новый URL с использованием извлеченного значения
                var newUrl = 'https://fortnite.gg/img/items-survey/big/' + value + '.jpg?y';

                // Заменяем текущий URL на новый
                image.src = newUrl;
            }
        });
    }

    // Функция для добавления кнопки FULL и обработчика события
    function addFullButton() {
        // Создаем новую кнопку
        var fullButton = document.createElement('a');
        fullButton.href = "#"; // Замените этот атрибут href на ваше желание
        fullButton.className = "button";
        fullButton.textContent = "FULL";
        fullButton.style.display = 'inline-block';
        fullButton.style.margin = '0 10px';

        // Добавляем обработчик события для замены изображений при клике на кнопку FULL
        fullButton.addEventListener('click', function(event) {
            event.preventDefault();
            replaceImages();
        });

        // Находим элемент-контейнер для кнопок My Ranking и My Tier List
        var container = document.querySelector('div[style="margin:4px 0 26px"]');

        // Вставляем кнопку FULL после элемента My Tier List
        container.insertBefore(fullButton, container.querySelector('a[href="?my-tierlist&amp;unreleased"]'));
    }

    // Вызываем функцию добавления кнопки FULL при загрузке страницы
    addFullButton();

})();
