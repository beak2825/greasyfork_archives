// ==UserScript==
// @name         GDZ OT PHOTOMATH
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  ХАХХАХАХ НЕТ, ГДЗ ОТ ПУТИНА
// @author       Blinchik
// @license      MIT
// @match        https://photosolver.ru/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=photosolver.ru
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/477862/GDZ%20OT%20PHOTOMATH.user.js
// @updateURL https://update.greasyfork.org/scripts/477862/GDZ%20OT%20PHOTOMATH.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для изменения фотографии
    function changeImage() {
        var newImageURL = prompt("Введите URL новой фотографии:");
        if (newImageURL) {
            var imagePreview = document.getElementById('imagePreview'); // Замените 'imagePreview' на актуальный идентификатор

            if (imagePreview) {
                imagePreview.src = newImageURL;
                // Сохраняем URL новой фотографии в localStorage
                GM_setValue('customImageURL', newImageURL);
            } else {
                alert("Элемент с идентификатором 'imagePreview' не найден на этой странице.");
            }
        }
    }

    // Создаем кнопку для изменения фотографии
    var changeImageButton = document.createElement('button');
    changeImageButton.textContent = 'Изменить фотографию';
    changeImageButton.style.position = 'fixed';
    changeImageButton.style.top = '10px';
    changeImageButton.style.right = '10px';
    changeImageButton.style.zIndex = '9999';
    changeImageButton.addEventListener('click', changeImage);

    // Проверяем, есть ли сохраненный URL фотографии в localStorage и применяем его, если он существует
    var savedImageURL = GM_getValue('customImageURL', '');
    if (savedImageURL) {
        var imagePreview = document.getElementById('imagePreview'); // Замените 'imagePreview' на актуальный идентификатор
        if (imagePreview) {
            imagePreview.src = savedImageURL;
        }
    } else {
        document.getElementById('imagePreview').src = "https://www.meme-arsenal.com/memes/1063a9eaf9e95409801cdbf1e7fcb6ff.jpg";
    }

    // Добавляем кнопку на страницу
    document.body.appendChild(changeImageButton);
})();