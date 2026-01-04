// ==UserScript==
// @name         Aliexpress Coupon Center filtering RUS
// @name:ru      фильтр Aliexpress Центр купонов
// @namespace    http://tampermonkey.net/
// @version      0.1.6
// @description  mark high value coupons
// @description:ru выделение купонов с большим процентом скидки
// @author
// @license      MIT
// @match        https://ru.aliexpress.com/ssr/300001527/CouponCenter*
// @match        https://ru.aliexpress.com/ssr/300001900/CouponCenter*
// @require      https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aliexpress.com
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/511352/Aliexpress%20Coupon%20Center%20filtering%20RUS.user.js
// @updateURL https://update.greasyfork.org/scripts/511352/Aliexpress%20Coupon%20Center%20filtering%20RUS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.warn("script working...");

    let discountPercent = 25;
    const queries = {
        couponContainer: 'DIV[class="swiper-slide swiper-slide-active"]>DIV>DIV>DIV[class="aec-view"]>DIV[class="aec-view"]>DIV[class="aec-view"]>DIV[class="aec-view"]',
    };
    let couponContainer;
    discountPercent /= 100;

    document.arrive(queries.couponContainer, function () {
        if(this && this.innerText){

            const elemsContainer = this.innerText.split('\n');
            let discount = elemsContainer[0].replace(/\D/g, '');
            let amount = elemsContainer[2].replace(/\D/g, '');

            if ( discount / amount <= discountPercent) {
                this.style.opacity = 0.25;
            }
        }
    });
})();

