// ==UserScript==
// @name         Замена фонового изображения на zelenka.guru
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Заменяет фоновое изображение на zelenka.guru
// @author       You
// @match        https://zelenka.guru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489509/%D0%97%D0%B0%D0%BC%D0%B5%D0%BD%D0%B0%20%D1%84%D0%BE%D0%BD%D0%BE%D0%B2%D0%BE%D0%B3%D0%BE%20%D0%B8%D0%B7%D0%BE%D0%B1%D1%80%D0%B0%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F%20%D0%BD%D0%B0%20zelenkaguru.user.js
// @updateURL https://update.greasyfork.org/scripts/489509/%D0%97%D0%B0%D0%BC%D0%B5%D0%BD%D0%B0%20%D1%84%D0%BE%D0%BD%D0%BE%D0%B2%D0%BE%D0%B3%D0%BE%20%D0%B8%D0%B7%D0%BE%D0%B1%D1%80%D0%B0%D0%B6%D0%B5%D0%BD%D0%B8%D1%8F%20%D0%BD%D0%B0%20zelenkaguru.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Замените ссылку по необходимости
    var newLogoUrl = 'https://nztcdn.com/avatar/l/1710061088/5084973.webp';

    // Найдем элемент по id 'lzt-logo' и заменим его фоновое изображение
    var avatarElement = document.getElementById('lzt-logo');
    if (avatarElement) {
        avatarElement.style.backgroundImage = 'url(' + newLogoUrl + ')';
        avatarElement.style.backgroundSize = 'contain';
        avatarElement.style.backgroundRepeat = 'no-repeat';
        avatarElement.style.width = '36px';
        avatarElement.style.height = '36px';
    }
})();
