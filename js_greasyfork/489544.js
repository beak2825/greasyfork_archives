// ==UserScript==
// @name         麻雀自动续费下单
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically click and navigate through the steps
// @author       You
// @match        https://m2.spwvpn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489544/%E9%BA%BB%E9%9B%80%E8%87%AA%E5%8A%A8%E7%BB%AD%E8%B4%B9%E4%B8%8B%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/489544/%E9%BA%BB%E9%9B%80%E8%87%AA%E5%8A%A8%E7%BB%AD%E8%B4%B9%E4%B8%8B%E5%8D%95.meta.js
// ==/UserScript==
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
(async function() {
    'use strict';

    async function clickLikes() {
        document.getElementsByClassName("nav-main-link-icon si si-bag")[0].click();//订阅
        await delay(1500);
        document.getElementsByClassName("btn btn-sm btn-alt-primary")[0].click();//点套餐
        await delay(1500);
        document.getElementsByClassName('btn btn-block btn-primary')[0].click();//点下单
        await delay(1500);
        document.getElementsByClassName('btn btn-block btn-primary')[0].click();//点结账

    }

    // 设置间隔时间进行点击，此处间隔为5000毫秒
    setInterval(clickLikes, 5000);


})();