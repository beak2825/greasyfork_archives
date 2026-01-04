// ==UserScript==
// @name         d2-dim-equip
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  A Tampermonkey script to automatically click items in Destiny 2 DIM and equip them to your character.
// @author       leah_ana
// @match        https://app.destinyitemmanager.com/*
// @grant        none
// @license
// @downloadURL https://update.greasyfork.org/scripts/497008/d2-dim-equip.user.js
// @updateURL https://update.greasyfork.org/scripts/497008/d2-dim-equip.meta.js
// ==/UserScript==

(function() {

// 选择器，点击的元素
const selector = '.dim-button';
// 操作间隔 60s
const interval = 1000*60
// 定时循环运行点击操作
setInterval(() => {
    const element = document.querySelector(selector);
    var now =new Date().toLocaleString();
    if (element) {
        element.click();
        console.info(now+'【d2-dim-equip】: element.click();')
    } else {
        console.warn(now+'【d2-dim-equip】: element not found:', selector);
    }

}, interval);

// 停止定时器
// clearInterval(timerId);

})();