// ==UserScript==
// @name         neustudydl自动点击“下一题”按钮
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在 neustudydl.neumooc.com 上，若存在 is-checked 则自动点击“下一题”按钮，并防止重复触发
// @match        *://neustudydl.neumooc.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535208/neustudydl%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E2%80%9C%E4%B8%8B%E4%B8%80%E9%A2%98%E2%80%9D%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/535208/neustudydl%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E2%80%9C%E4%B8%8B%E4%B8%80%E9%A2%98%E2%80%9D%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let isProcessing = false; // 防止重复触发的标志

    document.addEventListener('click', function(e) {
        if (isProcessing) return; // 如果正在处理中，则忽略此次点击

        const checked = document.querySelector('.is-checked');
        if (checked) {
            // 查找所有按钮
            const buttons = document.querySelectorAll('button');
            for (const btn of buttons) {
                if (btn.innerText.trim() === '下一题') {
                    isProcessing = true; // 标记正在处理
                    btn.click();
                    console.log('✅ 已自动点击“下一题”按钮');
                    // 延时1秒后重置标志，防止多次点击
                    setTimeout(() => { isProcessing = false; }, 1000);
                    break;
                }
            }
        } else {
            console.log('⚠️ 未检测到 is-checked，未执行点击');
        }
    }, true); // 捕获阶段监听事件
})();
