// ==UserScript==
// @name         Курилка by RQCE (KASATO)
// @namespace    https://forum.blackrussia.online/*
// @version      1.0
// @description  Добавляет кнопку для перенаправления на страницу Курилки
// @author       Kurilka by RQCE
// @match        https://forum.blackrussia.online/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478956/%D0%9A%D1%83%D1%80%D0%B8%D0%BB%D0%BA%D0%B0%20by%20RQCE%20%28KASATO%29.user.js
// @updateURL https://update.greasyfork.org/scripts/478956/%D0%9A%D1%83%D1%80%D0%B8%D0%BB%D0%BA%D0%B0%20by%20RQCE%20%28KASATO%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.href === 'https://forum.blackrussia.online/forums/%D0%9A%D1%83%D1%80%D0%B8%D0%BB%D0%BA%D0%B0.15/') {
        return
    }

    const button = document.createElement('button');
    button.textContent = 'Перейти в Курилку';
    button.style.backgroundColor = 'gray';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.padding = '10px 20px';
    button.style.cursor = 'pointer';

    button.addEventListener('click', function() {
        window.location.href = 'https://forum.blackrussia.online/forums/%D0%9A%D1%83%D1%80%D0%B8%D0%BB%D0%BA%D0%B0.15/';
    });

    const header = document.querySelector('.p-header');
    if (header) {
        header.appendChild(button);
    }
})();
