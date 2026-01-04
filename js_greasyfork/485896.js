// ==UserScript==
// @name         Steam Price Converter
// @namespace    http://tampermonkey.net/
// @version      2024-01-28
// @description  Переводит тенге в рубли деля их на 5
// @author       DikUln
// @match        https://store.steampowered.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steampowered.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485896/Steam%20Price%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/485896/Steam%20Price%20Converter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(".discount_final_price, .discount_original_price, .game_purchase_price").each(function() {
        var orig_price = $(this).text().replaceAll(' ', '').replace('₸', '');
        console.log(orig_price);
        if (orig_price.indexOf("Бесплатно") < 0) {
            $(this).text(Math.floor(orig_price / 5) + ' ₽');
        }
    });
})();