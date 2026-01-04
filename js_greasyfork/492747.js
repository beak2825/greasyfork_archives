// ==UserScript==
// @name         嘉立创自动登录
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically click the enter system button on passport.jlc.com
// @author       You
// @match        https://passport.jlc.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/492747/%E5%98%89%E7%AB%8B%E5%88%9B%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/492747/%E5%98%89%E7%AB%8B%E5%88%9B%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 延迟函数，避免太快执行而元素未能加载
    function delay(milliseconds){
        return new Promise(resolve => {
            setTimeout(resolve, milliseconds);
        });
    }

    async function clickButtonWhenAvailable() {
        // 页面可能是动态加载的，所以我们使用一个轮询函数检查按钮是否存在
        while(document.querySelector('button.el-button--primary span') === null) {
            // 如果按钮不存在，则等待100毫秒后再次检查
            await delay(100);
        }

        // 检测到按钮后，获取按钮并执行点击事件
        let button = document.querySelector('button.el-button--primary span').parentNode;
        if (button) {
            button.click();
            console.log('Auto Enter System: Clicked the button!');
        } else {
            console.error('Auto Enter System: Button not found.');
        }
    }

    // 开始执行轮询检查按钮的函数
    clickButtonWhenAvailable();
})();