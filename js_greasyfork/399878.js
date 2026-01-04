// ==UserScript==
// @name         steamprices.com half price
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://www.steamprices.com/cn/user/wishlist
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399878/steampricescom%20half%20price.user.js
// @updateURL https://update.greasyfork.org/scripts/399878/steampricescom%20half%20price.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var half = $('<button type="button" class="btn btn-impulse btn-impulse-dark btn-impulse-3d halfprice">Half price</button>')
        .click(() => {
            $('.wishlist-row').each((i, node) => {
                var price = parseInt($(node).find('span.price_old, span.price').first().text().substring(2));
                if (isNaN(price)) return;
                $(node).find('.wishlist_maxvalue').val(Math.ceil(price / 2)).change();
                $(node).find('.checkbox input').first().prop('checked', true).change();
            })
        });
    $('.send').after(half);

})();
