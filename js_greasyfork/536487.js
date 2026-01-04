// ==UserScript==
// @name         B站去除动态首页的up主推广
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  B站去广告
// @author       You
// @match        https://t.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536487/B%E7%AB%99%E5%8E%BB%E9%99%A4%E5%8A%A8%E6%80%81%E9%A6%96%E9%A1%B5%E7%9A%84up%E4%B8%BB%E6%8E%A8%E5%B9%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/536487/B%E7%AB%99%E5%8E%BB%E9%99%A4%E5%8A%A8%E6%80%81%E9%A6%96%E9%A1%B5%E7%9A%84up%E4%B8%BB%E6%8E%A8%E5%B9%BF.meta.js
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
            const keywordString = '拼多多 淘宝 京东 领红包 妙界 小破站 手淘 领取 优惠 下单 补贴 囤起来 神价 新品 抽奖 神车 补贴 啄木鸟 旗舰店 元起 元抢 元到手 私一下 9抢 羊毛 天猫 U型枕 某宝 大促 价格 领券 芒 石榴 发货 流量 运费 质保 库存 送礼 试试哦 到手';

            if (keywordString.split(' ').filter(keyword => keyword !== '').some(keyword => item.innerText.includes(keyword))) {
                item.style.display = 'none'; // 如果是 DOM 元素，可以这样隐藏
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