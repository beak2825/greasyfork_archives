// ==UserScript==
// @name        去除b站首页右下角推广广告
// @namespace   http://tampermonkey.net/
// @license     Apache-2.0
// @version     0.1.1
// @author      byhgz
// @description 移除b站首页右下角按钮广告和对应的横幅广告
// @icon        https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @noframes    
// @match       *://www.bilibili.com/*
// @require     https://update.greasyfork.org/scripts/462234/1470493/Message.js
// @downloadURL https://update.greasyfork.org/scripts/516566/%E5%8E%BB%E9%99%A4b%E7%AB%99%E9%A6%96%E9%A1%B5%E5%8F%B3%E4%B8%8B%E8%A7%92%E6%8E%A8%E5%B9%BF%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/516566/%E5%8E%BB%E9%99%A4b%E7%AB%99%E9%A6%96%E9%A1%B5%E5%8F%B3%E4%B8%8B%E8%A7%92%E6%8E%A8%E5%B9%BF%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
"use strict";
"use strict";
const removeAds = () => {
    const i1 = setInterval(() => {
        const el = document.querySelectorAll(".ad-img");
        if (el.length === 0) return;
        clearInterval(i1);
        for (let v of el) {
            v.remove();
        }
        Qmsg.success("成功移除右下角按钮广告！");
    }, 1000);
    const i2 = setInterval(() => {
        const el = document.querySelector(".adcard");
        if (el === null) return;
        clearInterval(i2);
        el.remove();
        Qmsg.success("成功移除右下角横幅广告！");
    }, 1000);
};
if (document.title === "哔哩哔哩 (゜-゜)つロ 干杯~-bilibili") {
    debugger;
    removeAds();
} else {
    console.log("非B站首页页面，不执行移除广告操作！");
}
