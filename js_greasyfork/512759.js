// ==UserScript==
// @name         Discord URL Redirector BY CHATGPT
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically replaces https://discord.com/channels/ with discord://discord.com/channels/
// @author       You
// @match        *://discord.com/channels/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512759/Discord%20URL%20Redirector%20BY%20CHATGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/512759/Discord%20URL%20Redirector%20BY%20CHATGPT.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Получаем текущий URL
    const currentUrl = window.location.href;
    // Проверяем, что он содержит нужную часть, и заменяем на новый протокол
    if (currentUrl.startsWith('https://discord.com/channels/')) {
        const newUrl = currentUrl.replace('https://discord.com/channels/', 'discord://discord.com/channels/');
        // Перенаправляем пользователя на новый URL
        window.location.replace(newUrl);
    }
})();
