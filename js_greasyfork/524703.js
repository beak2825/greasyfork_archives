// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2025-01-24
// @author       howardnm
// @description  英盛网刷课脚本
// @license MIT
// @match        https://qy.yingsheng.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yingsheng.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524703/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/524703/New%20Userscript.meta.js
// ==/UserScript==

const selector = 'a[data-v-8ae46a44][data-dismiss="modal"]';

let checkInterval = setInterval(() => {
    const button = document.querySelector(selector);
    if (button) {
        console.log('找到按钮:', button);
        setTimeout(() => {
            button.click();
            console.log('按钮已点击');
            // clearInterval(checkInterval); // 点击后停止轮询
        }, 2000); // 延迟 2 秒后点击
    } else {
        console.log('仍未找到按钮，继续检查...');
    }
}, 1000); // 每隔 1 秒检查一次








