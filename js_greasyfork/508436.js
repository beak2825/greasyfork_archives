// ==UserScript==
// @name         Download Background Image
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Adds a button to download the background image from a specific element
// @match        *://*/*
// @grant        GM_download
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/508436/Download%20Background%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/508436/Download%20Background%20Image.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для создания кнопки скачивания
    function createDownloadButton(url) {
        const button = document.createElement('button');
        button.innerText = 'Скачать фон';
        button.style.position = 'fixed';
        button.style.top = '60px'; // Положение кнопки ниже
        button.style.left = '20px';
        button.style.padding = '10px 20px';
        button.style.backgroundColor = '#28a745'; // Зеленый цвет
        button.style.color = '#fff'; // Белый текст
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '1000';
        button.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'; // Тень для улучшения видимости

        button.addEventListener('click', () => {
            GM_download(url, 'background_image.webp');
        });

        document.body.appendChild(button);
    }

    // Функция для поиска и извлечения URL фона
    function findBackgroundImage() {
        const element = document.querySelector('#memberBackground');
        if (element) {
            const style = window.getComputedStyle(element);
            const backgroundImage = style.getPropertyValue('--img');
            const urlMatch = backgroundImage.match(/url\((.*?)\)/);
            if (urlMatch && urlMatch[1]) {
                const imageUrl = urlMatch[1].replace(/['"]/g, '');
                createDownloadButton(imageUrl);
            }
        }
    }

    // Проверяем фоновое изображение через 1 секунду после загрузки страницы
    setTimeout(findBackgroundImage, 1000);
})();