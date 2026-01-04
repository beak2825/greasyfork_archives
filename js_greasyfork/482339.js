// ==UserScript==
// @name         Дополнительная кнопка для VK
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Добавляет Предпросмотр, Full preview кнопку в фотоальбомах страниц VK
// @author       You
// @match        *://vk.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482339/%D0%94%D0%BE%D0%BF%D0%BE%D0%BB%D0%BD%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D0%B0%D1%8F%20%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0%20%D0%B4%D0%BB%D1%8F%20VK.user.js
// @updateURL https://update.greasyfork.org/scripts/482339/%D0%94%D0%BE%D0%BF%D0%BE%D0%BB%D0%BD%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D0%B0%D1%8F%20%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0%20%D0%B4%D0%BB%D1%8F%20VK.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для добавления кнопки
    function addExtraButton() {
        // Находим элемент, к которому будем добавлять кнопку
        var albumIntroInfo = document.querySelector('.photos_album_intro_info');

        // Проверяем, чтобы элемент существовал
        if (albumIntroInfo) {
            // Создаем новую кнопку
            var newButton = document.createElement('span');
            newButton.className = 'photos_album_info';

            // Создаем ссылку внутри кнопки
            var newLink = document.createElement('a');

            // Генерируем ссылку динамически в зависимости от текущей страницы
            var currentUrl = window.location.href;
            var albumId = currentUrl.match(/album-\d+_\d+/); // Извлекаем ID альбома из текущей ссылки
            newLink.href = 'https://vk.com/' + albumId + '?z=' + albumId;

            newLink.textContent = 'Full preview';

            // Добавляем ссылку внутри кнопки
            newButton.appendChild(newLink);

            // Добавляем разделитель
            var divideSpan = document.createElement('span');
            divideSpan.className = 'divide';
            divideSpan.textContent = '|';

            // Вставляем новую кнопку после существующих элементов
            albumIntroInfo.appendChild(divideSpan);
            albumIntroInfo.appendChild(newButton);
        }
    }

    // Вызываем функцию при загрузке страницы
    addExtraButton();
})();
