// ==UserScript==
// @name         湖南青马在线网课
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  自动点击弹窗按钮
// @author       sjj
// @match        https://qmbbs.17el.cn/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520775/%E6%B9%96%E5%8D%97%E9%9D%92%E9%A9%AC%E5%9C%A8%E7%BA%BF%E7%BD%91%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/520775/%E6%B9%96%E5%8D%97%E9%9D%92%E9%A9%AC%E5%9C%A8%E7%BA%BF%E7%BD%91%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 每隔 1 秒检查弹窗并自动点击“是”按钮
    setInterval(() => {
        // 查找弹窗容器
        const alertDialog = document.querySelector('.layui-layer'); // 根据实际页面调整选择器
        if (alertDialog) {
            // 查找“是”按钮
            const yesButton = alertDialog.querySelector('.layui-layer-btn0'); // 按钮的类名
            if (yesButton) {
                console.log("自动点击了‘是’按钮");
                yesButton.click(); // 模拟点击操作
            }
        }
    }, 1000); // 每秒检查一次是否有弹窗
})();
