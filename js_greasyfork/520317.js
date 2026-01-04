// ==UserScript==
// @name         Wildberries Redirect
// @namespace    https://wildberries.by/
// @version      1.1
// @description  Redirect from global.wildberries.ru to wildberries.by with format change
// @author       You
// @match        https://global.wildberries.ru/product?card=*
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520317/Wildberries%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/520317/Wildberries%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const currentUrl = window.location.href;

    // Проверяем, что URL содержит параметр card
    const cardMatch = currentUrl.match(/card=([a-zA-Z0-9]+)/);
    if (cardMatch) {
        const cardValue = cardMatch[1]; // Извлекаем значение параметра card
        const newUrl = `https://www.wildberries.by/catalog/${cardValue}/detail.aspx`;
        window.location.replace(newUrl);
    }
})();
