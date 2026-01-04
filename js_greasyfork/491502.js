// ==UserScript==
// @name         инфа ГЛАВНАЯ таска
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Инфо о продуктах в окне таска
// @author       You
// @match        *://*/Admin/MyCurrentTask/Active
// @icon         https://www.google.com/s2/favicons?sz=64&domain=triplenext.net
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/491502/%D0%B8%D0%BD%D1%84%D0%B0%20%D0%93%D0%9B%D0%90%D0%92%D0%9D%D0%90%D0%AF%20%D1%82%D0%B0%D1%81%D0%BA%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/491502/%D0%B8%D0%BD%D1%84%D0%B0%20%D0%93%D0%9B%D0%90%D0%92%D0%9D%D0%90%D0%AF%20%D1%82%D0%B0%D1%81%D0%BA%D0%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Находим все ссылки в ячейках td.admin-link
    var links = document.querySelectorAll('td.admin-link a');

    // Проходимся по каждой ссылке
    links.forEach(function(link) {
        // Создаем новый элемент для информации о тэге и размерах
        var infoElement = document.createElement('span');
        infoElement.style.display = "block"; // Размещаем информацию на новой строке

        // Запрашиваем страницу по ссылке
        fetch(link.href)
            .then(response => response.text())
            .then(html => {
                // Создаем временный элемент для парсинга HTML
                var tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;

                // Извлекаем информацию о тэге
                var tagElement = tempDiv.querySelector('#product-tag-list');
                if (tagElement) {
                    // Получаем текст тэга
                    var tagText = tagElement.textContent.trim();

                    // Определяем цвет в зависимости от тэга
                    switch (tagText) {
                        case "Female":
                            infoElement.style.color = "#FF69B4"; // Темно-розовый для Female
                            break;
                        case "Male":
                            infoElement.style.color = "#00008B"; // Темно-синий для Male
                            break;
                        case "Unisex":
                            infoElement.style.color = "#800080"; // Фиолетовый для Unisex
                            break;
                        case "Infant":
                            infoElement.style.color = "#008000"; // Ярко-зеленый для Infant
                            break;
                        default:
                            // Если тэг не соответствует ни одному из перечисленных, оставляем чёрный цвет
                            infoElement.style.color = "black"; // Чёрный цвет для остальных тэгов
                            break;
                    }

                    // Добавляем текст тэга в элемент
                    infoElement.textContent = tagText;
                }

                // Добавляем информацию о категории
                var categoryIdElement = tempDiv.querySelector('#CategoryId');
                if (categoryIdElement) {
                    var categoryName = categoryIdElement.options[categoryIdElement.selectedIndex].text;

                    var categoryInfoElement = document.createElement('span');
                    categoryInfoElement.textContent = " | " + categoryName;

                    // Добавляем текст категории в элемент
                    infoElement.appendChild(categoryInfoElement);
                }

                // Извлекаем размеры
                var sizeInfo = [];

                // Извлекаем размер глубины
                var depthElement = tempDiv.querySelector('#CurrentDepth');
                if (depthElement) {
                    sizeInfo.push(depthElement.value.trim());
                }

                // Извлекаем размер ширины
                var widthElement = tempDiv.querySelector('#CurrentWidth');
                if (widthElement) {
                    sizeInfo.push(widthElement.value.trim());
                }

                // Извлекаем размер высоты
                var heightElement = tempDiv.querySelector('#CurrentHeight');
                if (heightElement) {
                    sizeInfo.push(heightElement.value.trim());
                }

                // Создаем новый элемент для размеров
                var sizeElement = document.createElement('span');
                sizeElement.style.display = "block"; // Размещаем размеры на новой строке
                sizeElement.style.fontWeight = "italic"; // Устанавливаем курсив для размеров

                // Добавляем текст размеров в элемент
                sizeElement.textContent = sizeInfo.join("x");

                // Добавляем информацию под ссылкой
                infoElement.appendChild(sizeElement);
                link.parentNode.appendChild(infoElement);
            })
            .catch(error => {
                console.error('Ошибка получения данных с URL:', error);
            });
    });
})();
