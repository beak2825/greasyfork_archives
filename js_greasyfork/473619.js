// ==UserScript==
// @name         Aliexpress.COM Coupon Center filtering
// @name:ru      фильтр Aliexpress Центр купонов
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  mark high value coupons
// @description:ru выделение купонов с большим процентом скидки
// @author       
// @license      MIT
// @match        https://campaign.aliexpress.com/wow/gcp-plus/ae/tupr*
// @Match        https://*.aliexpress.com/gcp/300001062/Coupon-Center*
// @match        https://*.aliexpress.com/gcp/300001418/H2rSpKrzT5*
// @Match        https://www.aliexpress.com/ssr/300001527/CouponCenter
// @require      https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aliexpress.com
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/473619/AliexpressCOM%20Coupon%20Center%20filtering.user.js
// @updateURL https://update.greasyfork.org/scripts/473619/AliexpressCOM%20Coupon%20Center%20filtering.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.warn("script working...");

    let discountPercent = 90;
    const queries = {
      couponContainer: 'div[style="margin: 8px;"]',
    };
    let couponContainer;
    discountPercent /= 100;

    document.arrive(queries.couponContainer, function () {

      const elemsContainer = this.innerText.split('\n');
      let discount = elemsContainer[0].replace(/\D/g, '');
      let amount = elemsContainer[2].replace(/\D/g, '');

      if ( discount / amount <= discountPercent) {
          this.style.opacity = 0.25;
      }
    });
})();