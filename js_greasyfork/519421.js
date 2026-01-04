// ==UserScript==
// @name         Ozone Points for Reviews Filtering
// @namespace    http://tampermonkey.net/
// @version      2024.12.01
// @description  визуальное выделение товаров, где предлагаемые баллы за отзывы больше цены
// @author       k-dmitriy
// @match        https://www.ozon.ru/highlight/bally-za-otzyv-1171518/*
// @match        https://www.ozon.ru/*has_points_from_reviews=t*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ozon.ru
// @require      https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519421/Ozone%20Points%20for%20Reviews%20Filtering.user.js
// @updateURL https://update.greasyfork.org/scripts/519421/Ozone%20Points%20for%20Reviews%20Filtering.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let discountPercent = 25; // стандартная 25% скидка озон за баллы, цена с этой скидкой будет показана в скобках перед основной ценою. поставить 0, чтобы не учитывать ее. можно выставить больше 25 (25+n), чтобы выделялись и товары с ценою на n% выше баллов за отзыв.
    let delta = 0; // мин. разница между баллами за отзыв и стоимостью. к примеру 150 - под этот фильтр попадут товары за которые начисляют 200 баллов и их стоимость меньше 50р. (с учетом 25% скидки за баллы, если не стоит 0 строкою выше). можно указать отрицательное число, выделятся товары где цена выше предлагаемых баллов на это значение. 

    const queries = {
      couponContainer: 'div[class*="tile-root"]',
      priceContainer: 'span[class*="tsHeadline500Medium"]',
    };
    discountPercent /= 100;

// filtering function start
    let filtering = function (tthis) {
      const elemsContainer = tthis.innerText.split('\n');
      let points = Number(elemsContainer[0].replace(/\D/g, ''));
      let priceContainer = tthis.querySelector(queries.priceContainer);
      let price = Number(priceContainer.innerText.replace(/\D/g, ''));

      if ( points-delta < price-price*discountPercent ) {
          tthis.style.opacity = 0.20
      }

      priceContainer.textContent = '(' + (price-Math.floor(price*0.25)) + ') ' + priceContainer.textContent;

    }
// filtering function end

    let firstElemsContainer = document.querySelectorAll(queries.couponContainer);
    firstElemsContainer.forEach (elemContainer => {
        filtering(elemContainer);
    });
    document.arrive(queries.couponContainer, function () {
        filtering(this);
    });

})();