// ==UserScript==
// @name         Замена иконки лайка на НГ варежку
// @version      1.2
// @description  Заменяет иконку кнопки лайка на кастомную моментально.
// @namespace    awaw
// @match        https://lolz.live/*
// @match        https://zelenka.guru/*
// @icon         https://www.google.com/s2/favicons?domain=lolz.live
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520809/%D0%97%D0%B0%D0%BC%D0%B5%D0%BD%D0%B0%20%D0%B8%D0%BA%D0%BE%D0%BD%D0%BA%D0%B8%20%D0%BB%D0%B0%D0%B9%D0%BA%D0%B0%20%D0%BD%D0%B0%20%D0%9D%D0%93%20%D0%B2%D0%B0%D1%80%D0%B5%D0%B6%D0%BA%D1%83.user.js
// @updateURL https://update.greasyfork.org/scripts/520809/%D0%97%D0%B0%D0%BC%D0%B5%D0%BD%D0%B0%20%D0%B8%D0%BA%D0%BE%D0%BD%D0%BA%D0%B8%20%D0%BB%D0%B0%D0%B9%D0%BA%D0%B0%20%D0%BD%D0%B0%20%D0%9D%D0%93%20%D0%B2%D0%B0%D1%80%D0%B5%D0%B6%D0%BA%D1%83.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const customIconURL = 'https://i.imgur.com/KzN4zHK.png'; // Ссылка на вашу иконку через Imgur

    const style = `
        .icon.like2Icon {
            background-image: url("${customIconURL}") !important;
            background-size: 16px 16px !important;
            width: 16px !important;
            height: 16px !important;
            display: inline-block !important;
        }
    `;

    const styleElement = document.createElement('style');
    styleElement.textContent = style;
    document.head.appendChild(styleElement);
})();
