// ==UserScript==
// @name         Aliexpress Coupon Center filtering
// @name:ru      фильтр Aliexpress Центр купонов
// @namespace    http://tampermonkey.net/
// @version      0.3.2
// @description  hide or mark low value coupons
// @description:ru скрытие купонов с низким процентом скидки
// @author       
// @license      MIT
// @match        https://campaign.aliexpress.com/wow/gcp/ae/channel/ae/accelerate/tupr*
// @match        https://promotion.aliexpress.ru/wow/gcp/aer/daily/aer/coupon/AliCoupons*
// @require      https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aliexpress.com
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/463859/Aliexpress%20Coupon%20Center%20filtering.user.js
// @updateURL https://update.greasyfork.org/scripts/463859/Aliexpress%20Coupon%20Center%20filtering.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let discountPercent = 90;
    const experimental = false;   // true/false
    const queries = {
      amountContainer: 'span.text[numberoflines="2"]',
// regular (orange) page
      couponContainer: 'div[exp_type="coupon_exposure"]',
// black friday, spring (red)
//      couponContainer: 'div[style="box-sizing: border-box; display: inline-block; position: relative; -webkit-box-orient: vertical; flex-direction: column; flex-shrink: 0; align-content: flex-start; border-width: 0px; border-style: solid; border-color: black; margin: 0px; padding: 0px; min-width: 0px;"]',
// winter (white)
//      couponContainer: 'div[style="box-sizing: border-box; display: flex; -webkit-box-orient: horizontal; flex-direction: row; align-content: flex-start; flex-shrink: 0; position: relative; width: 593px; height: 162px; padding: 14px 16px 16px; margin-top: 8px; margin-bottom: 8px; background-color: rgb(255, 244, 229); border-radius: 12px;"]',
    };
    let couponContainer;
    discountPercent /= 100;

    document.arrive(queries.couponContainer, function () {
      let amountContainer = this.querySelector(queries.amountContainer);
      let amount = amountContainer.innerText.replace(/\D/g, '');
      let discountContainer = amountContainer.previousElementSibling ?? amountContainer.parentElement.previousElementSibling;
      let discount = discountContainer.innerText.replace(/\D/g, '');
      let codeContainer = discountContainer.parentElement.children[2].querySelector('span');
      if ( discount / amount <= discountPercent) {
          this.style.opacity = 0.25;
          if (experimental) {
              couponContainer?.remove();
              couponContainer = this;
              codeContainer.innerText = document.getElementById('TabOfFalls').nextElementSibling.childElementCount + ' coupons loaded';
              this.onclick = function(e) {
                  window.dispatchEvent(new CustomEvent('onListEndReached', {detail: e}));
              };
          }
      }
    });

/* source code:
        // 页面滚动
        var pageContainer = document.querySelector('#content');
        if (pageContainer) {
            var pageContainerHeight = 0;
            var needResend = false;
            document.addEventListener('scroll', function(e) {
                var rect = pageContainer.getBoundingClientRect();
                var innerHeight = window.innerHeight;
                if (pageContainerHeight !== rect.height) {
                    // 容器高度发生了变化
                    pageContainerHeight = rect.height;
                    needResend = true;
                }
                window.dispatchEvent(new CustomEvent('onListScroll', {detail: e}));
                if (needResend && rect.bottom < innerHeight + 500) {
                    needResend = false;
                    window.dispatchEvent(new CustomEvent('onListEndReached', {detail: e}));
                }
            });
        }
*/
})();