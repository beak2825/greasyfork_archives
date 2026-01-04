// ==UserScript==
// @name         虫娘新脚本
// @namespace    http://tampermonkey.net/
// @version      2024-12-02
// @description  代抢
// @author       3432276416
// @match        https://*.youzan.com/*
// @icon         https://img01.yzcdn.cn/v2/image/yz_fc.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520045/%E8%99%AB%E5%A8%98%E6%96%B0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/520045/%E8%99%AB%E5%A8%98%E6%96%B0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

 (async function () {
      await new Promise(resolve => setTimeout(resolve, 2000));
     document.querySelector('.goods-btns__button.button--last .goods-btns__authorize .user-authorize__btn-empty').click();
        await new Promise(resolve => setTimeout(resolve, 1000));
      document.querySelectorAll('.sku-messages>.tee-view').forEach((el) => {
            el.querySelector('.t-cell__value input').focus()
            if (el.querySelector('.t-cell__title').innerText.includes('身份证')) {
                el.querySelector('.t-cell__value input').value = "440181200507100337"
            }
            if (el.querySelector('.t-cell__title').innerText.includes('姓名')) {
                el.querySelector('.t-cell__value input').value = "黎家俊"
            }
            if (el.querySelector('.t-cell__title').innerText.includes('电话') || el.querySelector('.t-cell__title').innerText.includes('手机')) {
                el.querySelector('.t-cell__value input').value = "13660346820"
            }
            el.querySelector('.t-cell__value input').dispatchEvent(new Event('input'))
            el.querySelector('.t-cell__value input').dispatchEvent(new Event('blur'))
        })


         document.querySelectorAll('.sku-row__item-main')[0].click();
        await new Promise(resolve => setTimeout(resolve, 1000));
         document.querySelector('.pay-btn-order').click()
       await new Promise(resolve => setTimeout(resolve, 4000))
      location.reload();

})();