// ==UserScript==
// @name         YT Loader
// @namespace    https://github.com/Spectrum2k16
// @version      1.2
// @description  Скрипт на загрузку видео с youtube
// @author       Spectrum2k16 (https://github.com/Spectrum2k16)
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407515/YT%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/407515/YT%20Loader.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function createDownloadButton() {
        // Генерация ссылки на загрузку
        function getLink() {
            return window.location.href.replace('www.', 'www.ss');
        }
        // Добавление стилей
        function addStyle(element) {
            // element.style.padding = '0 1rem';
            element.style.marginLeft = '1rem';
            element.style.color = 'white';
            element.style.textDecoration = 'none';
            element.style.border = 'none';
            element.style.borderRadius = '12px';
            element.style.cursor = 'pointer';
            element.style.background = 'crimson';
        }
        // Получение / Создание элементов
        const buttonPlace = document.getElementById('info-text');
        const loadButton = document.createElement('button');
        loadButton.innerText = 'Скачать';
        buttonPlace.appendChild(loadButton);
        addStyle(loadButton);
        // Действие по нажатию на кнопку
        loadButton.addEventListener('click', function() {
            window.open( getLink(), '_blank' );
        })
    }
    // Ожидание события полной загрузки страницы (+2 секунды перед запуском скрипта)
    window.addEventListener('load', setTimeout(createDownloadButton, 2000));
})();