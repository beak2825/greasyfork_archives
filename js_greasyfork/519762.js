// ==UserScript==
// @name         B站去广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try
// @author       Coderben
// @match        https://t.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519762/B%E7%AB%99%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/519762/B%E7%AB%99%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    //window.onscroll = throttle(function() {
    //    clear()
    //}, 500)

    const t = setInterval(() => {
        clear()
    }, 500)

    function clear() {
        document.querySelectorAll('.bili-dyn-list__item').forEach(item => {
            if (
               item.innerText.includes('拼多多') || item.innerText.includes('淘宝') || item.innerText.includes('京东') || item.innerText.includes('领红包') || item.innerText.includes('妙界') || item.innerText.includes('小破站') ||
               item.innerText.includes('手淘') || item.innerText.includes('领取') || item.innerText.includes('优惠') || item.innerText.includes('下单') || item.innerText.includes('抽奖') || item.innerText.includes('啄木鸟') ||
               item.innerText.includes('旗舰店') || item.innerText.includes('元起') || item.innerText.includes('元抢') || item.innerText.includes('元到手') || item.innerText.includes('私一下') || item.innerText.includes('9抢') ||
               item.innerText.includes('羊毛') || item.innerText.includes('天猫') || item.innerText.includes('U型枕') || item.innerText.includes('某宝') || item.innerText.includes('大促') || item.innerText.includes('价格') ||
               item.innerText.includes('领券') || item.innerText.includes('芒') || item.innerText.includes('石榴') || item.innerText.includes('发货') || item.innerText.includes('甄选') || item.innerText.includes('无理由') ||
               item.innerText.includes('数量有限') ||  item.innerText.includes('划算') || item.innerText.includes('价廉') ||  item.innerText.includes('冲锋衣') || item.innerText.includes('裤') || item.innerText.includes('品牌')
                 || item.innerText.includes('包天') || item.innerText.includes('券后') || item.innerText.includes('仅需') || item.innerText.includes('男女同款') || item.innerText.includes('补贴') || item.innerText.includes('款式')
            ) {
                item.style.display = 'none'
            }
        })
    }

    function throttle(func, delay) {
        let last;
        return function () {
            const _this = this;
            const _args = arguments;
            const now = +new Date();
            if (last && now < last + delay) {
                clearTimeout(func.tid);
                func.tid = setTimeout(function () {
                    last = now;
                    func.call(_this, [..._args]);
                }, delay);
            } else {
                last = now;
                func.call(_this, [..._args]);
            }
        }
    }
})();