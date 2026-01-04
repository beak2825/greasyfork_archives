// ==UserScript==
// @name         自动抢
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  无
// @author       You
// @match        https://plus.m.jd.com/coupon/index
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jd.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478835/%E8%87%AA%E5%8A%A8%E6%8A%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/478835/%E8%87%AA%E5%8A%A8%E6%8A%A2.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function checkForElement() {
      var couponFullItem5 = document.querySelector('.couponFullItem-5');
      var btnWrap = document.querySelector('.btn-wrap-1');

      if (couponFullItem5) {
          couponFullItem5.click(); // 模拟点击 couponFullItem5
          console.log('已点击couponFullItem5')
          setTimeout(function() {
              if (btnWrap) {
                  btnWrap.click(); // 模拟点击 btnWrap
                  console.log('已点击btnWrap');
              } else {
                  console.log('未找到类名为 btn-wrap-1 的元素。');
              }
          }, 200); // 在模拟点击之前等待1秒钟
      } else {
          console.log('未找到couponFullItem-5');
          setTimeout(checkForElement, 200); // 重新检测是否有 couponFullItem5 元素
      }
  }

  checkForElement();
  
})();