// ==UserScript==
// @name         Ап раздел by Calvin Venoris
// @namespace    https://forum.blackrussia.online/*
// @version      1.0
// @description  Добавляет кнопку для перенаправления на страницу ап раздела
// @author       Aprazdel by Calvin
// @match        https://forum.blackrussia.online/*
// @grant  
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522593/%D0%90%D0%BF%20%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB%20by%20Calvin%20Venoris.user.js
// @updateURL https://update.greasyfork.org/scripts/522593/%D0%90%D0%BF%20%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB%20by%20Calvin%20Venoris.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.href === 'https://forum.blackrussia.online/forums/%D0%9A%D1%83%D1%80%D0%B8%D0%BB%D0%BA%D0%B0.15/') {
        return
    }

    const button = document.createElement('button');
    button.textContent = ' Перейти в АП РАЗДЕЛ';
    button.style.backgroundColor = '#000000';
    button.style.color = '#FF00FF';
    button.style.border = 'none';
    button.style.padding = '15px 15px';
    button.style.cursor = ' FONT=book antiqua ';

    button.addEventListener('click', function() {
        window.location.href = 'https://forum.blackrussia.online/forums/Раздел-для-агентов-поддержки.2482/'
    });

    const header = document.querySelector('.p-header');
    if (header) {
        header.appendChild(button);
    }
})();
