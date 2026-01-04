// ==UserScript==
// @name         ePrice
// @include      https://www.eprice.it/black-hour*
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Show captcha automatically
// @author       You
// @match        https://www.eprice.it/black-hour
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35287/ePrice.user.js
// @updateURL https://update.greasyfork.org/scripts/35287/ePrice.meta.js
// ==/UserScript==

(function(window) {

    function manageProduct(order, product) {
        if (new Date(product['dataInizio']) >= new Date() || new Date(product['dataFine']) <= new Date()) {
            return;
        }
        if (order['type'] === 'added') {
            checkItem(product);
            if (parseInt(product['tipologiaBlackFriday']) === 2) {
                grecaptcha['render'](document['getElementById']('frmadd_SAR_' + product['sku'] + '_captcha'), {
                    sitekey: '6Le-WDgUAAAAAFu2oZYE0yONhVHVkPinTBxvYMgg',
                    callback: function(a) {
                        verifyCallback(product['sku'], a);
                    },
                    lang: 'it'
                });

                // new code
                if(product.prezzoFlash === 99){
                    openCaptcha('frmadd_SAR_' + product['sku'] + '_captcha');
                }
            }
        }
        if (order['type'] === 'modified') {
            changeItem(product);
        }
        if (order['type'] === 'removed') {
            removeItem(product['sku'].toString());
        }
    }

    window.manageProduct = manageProduct;
    console.log('FUNCTION INJECTED!');
})(window);