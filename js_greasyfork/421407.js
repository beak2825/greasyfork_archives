// ==UserScript==
// @name         Weidian eur converter
// @version      1.1.1
// @description  Convert CNY to EUR in Weidian
// @author       McStecca
// @include      https://*weidian.com/item.html*
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @run-at       document-end
// @namespace    https://greasyfork.org/users/434104
// @downloadURL https://update.greasyfork.org/scripts/421407/Weidian%20eur%20converter.user.js
// @updateURL https://update.greasyfork.org/scripts/421407/Weidian%20eur%20converter.meta.js
// ==/UserScript==

function convertPrices(rate, price, tag) {
    let convertedPrice = Math.round(price * 100 * rate)/100;
    $(tag).html($(tag).html() + " €" + convertedPrice);
}

$.get('https://openexchangerates.org/api/latest.json', {app_id: '7bdd8160ae2b46a6897ef2dccf629280'}, function(data) {
    let rate = (1 / data.rates.CNY) * (data.rates.EUR);
		window.setTimeout(function () {
            let tag = "";
            if($(".cur-price").length){
                tag = ".cur-price";
            }else{
                tag = ".discount-cur";
            }
            let price = $(tag).html();
            let prices = price.split("-");
            $(tag).html($(tag).html() + " ->");
            prices.forEach(price => {
                convertPrices(rate, parseFloat(price), tag);
            });
        }, 1000);
});