// ==UserScript==
// @name         Love Crafts - Price Per Yard
// @namespace    http://tampermonkey.net/
// @version      2024-11-12
// @description  Appends the price per yard to the end of products on lovecrafts.com
// @author       Guribot
// @match        https://www.lovecrafts.com/en-us/l/yarns*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lovecrafts.com
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/516941/Love%20Crafts%20-%20Price%20Per%20Yard.user.js
// @updateURL https://update.greasyfork.org/scripts/516941/Love%20Crafts%20-%20Price%20Per%20Yard.meta.js
// ==/UserScript==

const YARDS_REGEX = /.*, (\d*)yds.*/;

(function() {
    'use strict';

    const items = $('li.products__grid-item');
    items.each((i, el) => {
        const yards = Number(YARDS_REGEX.exec($(el).find('.lc-product-card__subtitle').eq(0).text())[1]);
        var priceElement = $(el).find('.lc-price__regular');
        if (priceElement.length === 0) {
            priceElement = $(el).find('.lc-price__special');
        }
        var priceValue = Number(priceElement.text().replace(/[^\d\.]/g, ''));
        var pricePerYard = (priceValue / yards).toFixed(2);
        priceElement[0].insertAdjacentHTML('beforeend', ` ($${pricePerYard}/yd)`);
    });
})();