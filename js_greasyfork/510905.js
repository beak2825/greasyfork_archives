// ==UserScript==
// @name         Steam Rub to Tenge Converter
// @namespace    http://tampermonkey.net/
// @version      2024-09-30-2
// @description  Заменяет цены в Steam с Тенге на Рубли. Внимание, конвертация происходит посредством деления на 5.
// @author       MrSedan
// @match        https://store.steampowered.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steampowered.com
// @grant        none
// @license      MIT
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/510905/Steam%20Rub%20to%20Tenge%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/510905/Steam%20Rub%20to%20Tenge%20Converter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('div').each(function() {
        if ($(this).text().match(/^[\d\s\n,]+₸\s*$/)) {
            const orig_price = +$(this).text().replaceAll(' ', '').replace('₸', '').replace(",",".");
            $(this).text(Math.floor(orig_price/5)+'₽');
        }
    });
})();