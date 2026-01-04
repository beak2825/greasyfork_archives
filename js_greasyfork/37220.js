// ==UserScript==
// @name         Banggood.com currency changer
// @description  Change currency from USD showed to another currency that does not supported in Banggood.com website
// @namespace    https://github.com/NabiKAZ/banggood-currency
// @version      0.2
// @license      GPL-3.0+; http://www.gnu.org/licenses/gpl-3.0.txt
// @date         2017-02-20
// @update       2018
// @author       Nabi KaramAlizadeh <nabikaz@gmail.com>
// @homepage     http://www.nabi.ir/
// @match        *://www.banggood.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37220/Banggoodcom%20currency%20changer.user.js
// @updateURL https://update.greasyfork.org/scripts/37220/Banggoodcom%20currency%20changer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var unit = 4600; //THIS IS THE CURRENT PRICE OF THE DOLLAR IN TODAY. REPLACE WITH ARBITRARY VALUE.
    var currency = 'تومان'; //THIS IS THE CURRENCY NAME. REPLACE WITH ARBITRARY VALUE.

    var selectors = 'div>.now, li>.price, .selected_total>strong';

    $('body').on('DOMSubtreeModified', selectors, function(){
        var price = $(this).text();
        price = price.replace('US$', '');
        price = price * unit;
        price = Math.round(price);
        price = isNaN(price)?'':price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        var priceUnit = price + ' ' + currency;
        var priceTomanEl = $(this).parent().find('.priceToman').first();
        if (priceTomanEl.length === 0) {
            priceTomanEl = $('<div/>');
            priceTomanEl.addClass('priceToman');
            priceTomanEl.css({
                'color': '#f60', 'font-size': '33px', 'font-weight': 'bold', 'direction': 'rtl',
                'text-align': 'left', 'font-family': 'nazanin, bnazanin, "b nazanin"', 'display': 'inline-block',
            });
            priceTomanEl.text(priceUnit);
            $(this).after(priceTomanEl);
            $(this).css({'color': '#c7c7c7', 'font-size': '16px'});
        } else {
            priceTomanEl.text(priceUnit);
        }

    });

    var tId = setInterval(function() {
        if (document.readyState == 'complete') onComplete();
    }, 11);
    function onComplete(){
        clearInterval(tId);
        $(selectors).trigger('DOMSubtreeModified');
        $('.goods_together_all .scroll_box').css('height', '285px');
    }

})();
