// ==UserScript==
// @name         Litres Download Button
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a button to download an open book for reading with an active Litres subscription
// @author       Grok
// @match        https://www.litres.ru/static/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534444/Litres%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/534444/Litres%20Download%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Функция для формирования URL скачивания
    function generateDownloadUrl() {
        const currentUrl = window.location.href;
        // Удаляем префикс /static/or4/view/or.html?baseurl=
        let downloadUrl = currentUrl.replace('/static/or4/view/or.html?baseurl=', '');
        // Удаляем параметры после &art=
        downloadUrl = downloadUrl.split('&art=')[0];
        return downloadUrl;
    }

    // Функция для добавления кнопки
    function addDownloadButton() {
        // Проверяем, что мы на странице чтения
        if (!window.location.href.includes('/static/or4/view/or.html')) {
            console.log('Не страница чтения книги');
            return;
        }

        // Формируем URL для скачивания
        const downloadUrl = generateDownloadUrl();

        // Создаем кнопку
        const downloadButton = document.createElement('a');
        downloadButton.textContent = 'Скачать книгу';
        downloadButton.href = downloadUrl;
        downloadButton.style.position = 'fixed';
        downloadButton.style.top = '1px';
        downloadButton.style.left = '50%';
        downloadButton.style.transform = 'translateX(-50%)';
        downloadButton.style.padding = '10px 15px';
        downloadButton.style.backgroundColor = '#28a745';
        downloadButton.style.color = '#fff';
        downloadButton.style.textDecoration = 'none';
        downloadButton.style.borderRadius = '5px';
        downloadButton.style.zIndex = '1000';
        downloadButton.setAttribute('download', '');

        // Добавляем кнопку на страницу
        document.body.appendChild(downloadButton);
    }

    // Ждем загрузки страницы и добавляем кнопку
    window.addEventListener('load', addDownloadButton);
})();