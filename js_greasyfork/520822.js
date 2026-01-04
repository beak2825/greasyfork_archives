// ==UserScript==
// @name         Замена иконки лайка и симпы на НГ варежку
// @version      1.3
// @description  Заменяет иконку симпы и лайка
// @namespace    awaw
// @match        https://lolz.live/*
// @match        https://zelenka.guru/*
// @icon         https://www.google.com/s2/favicons?domain=lolz.live
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520822/%D0%97%D0%B0%D0%BC%D0%B5%D0%BD%D0%B0%20%D0%B8%D0%BA%D0%BE%D0%BD%D0%BA%D0%B8%20%D0%BB%D0%B0%D0%B9%D0%BA%D0%B0%20%D0%B8%20%D1%81%D0%B8%D0%BC%D0%BF%D1%8B%20%D0%BD%D0%B0%20%D0%9D%D0%93%20%D0%B2%D0%B0%D1%80%D0%B5%D0%B6%D0%BA%D1%83.user.js
// @updateURL https://update.greasyfork.org/scripts/520822/%D0%97%D0%B0%D0%BC%D0%B5%D0%BD%D0%B0%20%D0%B8%D0%BA%D0%BE%D0%BD%D0%BA%D0%B8%20%D0%BB%D0%B0%D0%B9%D0%BA%D0%B0%20%D0%B8%20%D1%81%D0%B8%D0%BC%D0%BF%D1%8B%20%D0%BD%D0%B0%20%D0%9D%D0%93%20%D0%B2%D0%B0%D1%80%D0%B5%D0%B6%D0%BA%D1%83.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Ссылки на кастомные иконки
    const likeIconURL = 'https://i.imgur.com/KzN4zHK.png'; // иконка лайка, загрузка другой через имгур
    const counterIconURL = 'https://i.imgur.com/SqcTlFy.png'; // иконка симпы

    // Добавляем глобальные CSS-правила для замены иконок
    const style = `
        /* Замена иконки кнопки лайка */
        .icon.like2Icon {
            background-image: url("${likeIconURL}") !important;
            background-size: 16px 16px !important;
            width: 16px !important;
            height: 16px !important;
            display: inline-block !important;
        }

        /* Замена иконки счетчика симп */
        .icon.likeCounterIcon {
            background-image: url("${counterIconURL}") !important;
            background-size: 20px 20px !important;
            width: 20px !important;
            height: 20px !important;
            display: inline-block !important;
        }
    `;

    // Создаем элемент <style> и добавляем его в <head>
    const styleElement = document.createElement('style');
    styleElement.textContent = style;
    document.head.appendChild(styleElement);
})();