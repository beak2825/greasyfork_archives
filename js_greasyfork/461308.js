// ==UserScript==
// @name         自动刷网课
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  登陆进入雨课堂ppt界面，自动即可向下翻页
// @author       zj
// @match        https://changjiang.yuketang.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yuketang.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461308/%E8%87%AA%E5%8A%A8%E5%88%B7%E7%BD%91%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/461308/%E8%87%AA%E5%8A%A8%E5%88%B7%E7%BD%91%E8%AF%BE.meta.js
// ==/UserScript==





(function() {
    'use strict';

    // 显示用户输入界面
    //let count = parseInt(prompt("输入切换次数：", "100"));
    let interval = parseInt(prompt("输入间隔的秒数：", "5"));

    // 循环执行模拟向下按键事件
    for (let i = 0; i < 10000; i++) {
        setTimeout(function() {
            let e = new Event("keydown"); // 创建一个键盘按下事件
            e.keyCode = 40; // 设置键码为向下箭头键
            document.dispatchEvent(e); // 触发事件
        }, i * interval * 1000); // 每次间隔interval秒
    }
})();
