// ==UserScript==
// @name     Клуб Foto.ru width:100%
// @version  1.4
// @description Растягивает страницы форума на всю ширину экрана, удаляет баннеры.
// @author   Maranchuk Sergey <slav0nic0@gmail.com>
// @include http*://foto.ru/forums/*
// @namespace https://greasyfork.org/users/3786
// @downloadURL https://update.greasyfork.org/scripts/39063/%D0%9A%D0%BB%D1%83%D0%B1%20Fotoru%20width%3A100%25.user.js
// @updateURL https://update.greasyfork.org/scripts/39063/%D0%9A%D0%BB%D1%83%D0%B1%20Fotoru%20width%3A100%25.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Удаление элементов с классом 'banner-home'
    document.querySelectorAll('.banner-home').forEach(element => {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    });

    document.querySelectorAll('div.container').forEach(container => {
        container.style.maxWidth = 'none';
    });
})();