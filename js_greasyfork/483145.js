// ==UserScript==
// @name         B站自动点击稍后再看
// @version      1.0
// @description  在页面加载完成后，自动点击“稍后再看”按钮
// @author       判官喵
// @namespace    https://space.bilibili.com/6693935
// @match        https://www.bilibili.com/video/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483145/B%E7%AB%99%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/483145/B%E7%AB%99%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 监听 window.onload 事件
    window.onload = function() {
        // 等待页面加载完成
        console.log('页面加载完成');
        // 等待5秒
        setTimeout(function() {
            // 获取“稍后再看”按钮
            var btn = document.getElementById('gm395456-video-btn');
            // 如果按钮存在
            if (btn) {
                // 如果按钮未被选中
                if (!btn.querySelector('input').checked) {
                    // 触发点击事件
                    btn.click();
                    // 在控制台打印“点击成功”
                    console.log('点击成功');
                } else {
                    // 如果按钮已经被选中
                    // 在控制台打印“无需点击”
                    console.log('无需点击');
                }
                // 等待3秒
                setTimeout(function() {
                    // 关闭当前页面
                    window.open("about:blank","_self");
                    window.close();
                }, 3000);
            } else {
                // 如果按钮不存在
                // 在控制台打印“找不到按钮”
                console.log('找不到按钮');
            }
        }, 5000);
    };
})();