// ==UserScript==
// @name         Pixel Battles Compact Font
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Уменьшенный шрифт Unbounded для Pixel Battles
// @author       .hilkach.
// @match        https://pixelbattles.ru/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/543199/Pixel%20Battles%20Compact%20Font.user.js
// @updateURL https://update.greasyfork.org/scripts/543199/Pixel%20Battles%20Compact%20Font.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Загрузка шрифта
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Применение компактных стилей
    GM_addStyle(`
        * {
            font-family: 'Unbounded', sans-serif !important;
            font-weight: 600 !important;
            font-size: 13px !important;  /* уменьшенный размер */
            line-height: 1.3 !important;  /* компактный межстрочный интервал */
        }

        /* Заголовки */
        h1, h2, h3, h4, h5, h6,
        .header, .title {
            font-weight: 700 !important;
            font-size: 14px !important;  /* чуть больше для заголовков */
        }

        /* Чат и элементы интерфейса */
        .chat-message, .username,
        .button, .input, .select {
            font-size: 10px !important;  /* минимальный размер для чата */
        }
    `);
})();