// ==UserScript==
// @name         Change Like Counter Icon
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Заменить иконку
// @author       Ваше имя
// @grant        GM_addStyle
// @license MIT
// @match        https://lolz.live/*
// @match        https://lolz.guru/*
// @match        https://zelenka.guru/*
// @downloadURL https://update.greasyfork.org/scripts/520804/Change%20Like%20Counter%20Icon.user.js
// @updateURL https://update.greasyfork.org/scripts/520804/Change%20Like%20Counter%20Icon.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Новый URL для изображения
    const newLogoUrl = 'https://lolz.live/styles/brand/download/logos/LolzTeam-Logo-Green.svg';

    // CSS для изменения логотипа с использованием !important
    const css = `
        #lzt-logo {
            background-image: url('${newLogoUrl}') !important;
        }
    `;

    // Добавляем новый стиль на страницу
    GM_addStyle(css);
})();