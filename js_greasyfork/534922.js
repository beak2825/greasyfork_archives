// ==UserScript==
// @name         自动打卡并继续学习助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在学习打卡弹窗出现时自动点击“确定打卡”，然后自动点击“继续学习”按钮，免去手动操作。
// @author       forever_you
// @license      MIT
// @match        https://www.ttcdw.cn/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/534922/%E8%87%AA%E5%8A%A8%E6%89%93%E5%8D%A1%E5%B9%B6%E7%BB%A7%E7%BB%AD%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/534922/%E8%87%AA%E5%8A%A8%E6%89%93%E5%8D%A1%E5%B9%B6%E7%BB%A7%E7%BB%AD%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('[自动打卡助手] 开始监听…');
    let clickedClock = false;    // 标记是否已点击“确定打卡”
    let clickedContinue = false; // 标记是否已点击“继续学习”

    // 查找并点击按钮的函数
    function tryClick() {
        // console.log('tryClick');
        const btn = document.getElementById('comfirmClock');
        if (!btn) return;

        const state = btn.getAttribute('btnstate');
        // 第一阶段：未打卡状态
        if (state === '0' && !clickedClock) {
            console.log('[自动打卡助手] 检测到“确定打卡”按钮，正在自动点击…');
            btn.click();
            clickedClock = true;
            return;
        }
        // 第二阶段：打卡成功后，继续学习状态
        if (state === '1' && clickedClock && !clickedContinue) {
            console.log('[自动打卡助手] 检测到“继续学习”按钮，正在自动点击…');
            btn.click();
            clickedContinue = true;
        }
    }

    // 先尝试一次，防止页面已加载完成且按钮已存在
    tryClick();

    // 使用 MutationObserver 监视后续弹窗或状态更新
    const observer = new MutationObserver((mutations, obs) => {
        tryClick();
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
