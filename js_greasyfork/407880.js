// ==UserScript==
// @name         Youtube downloader
// @namespace    jk
// @version      0.2
// @description  Download video from YouTube.
// @author       JK
// @match        https://www.youtube.com/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/407880/Youtube%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/407880/Youtube%20downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Подписываемся на событие загрузки страницы (как только это произойдет, createDownloadBtn() выполнится)
    window.addEventListener('load', createDownloadBtn);

    function createDownloadBtn() {
        // Формируем ссылку (например, вот такую - "https://www.ssyoutube.com/watch?v=pVCoZG0-hfE")
        const link = 'https://www.ssyoutube.com/watch' + window.location.search;
        // Находим, куда положить кнопку
        const place = document.querySelector('#info-text');
        // Создадим элемент: <a></a> для ссылки
        const new_link = document.createElement('a');
        // <a>Скачать видео!</a>
        new_link.innerText = 'Скачать видео!';
        // <a href="...">Скачать видео!</a>
        new_link.setAttribute('href', link);
        // <a href="..." target="_blank">Скачать видео!</a>
        new_link.setAttribute('target', '_blank');
        // Кладем <a ...>...</a> в конец элемента place на странице.
        // appendChild - добавление дочернего элемента внутрю родительского элемента
        place.appendChild(new_link);
       //Добавляем стили
       new_link.style.background = "AliceBlue";
       new_link.style.border = "none";
       new_link.style.borderRadius = "10px";
    }
}); 
