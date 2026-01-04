// ==UserScript==
// @name         Script Test Message on Greasy Fork
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  顯示腳本運行成功的提示，並帶有淡出效果自動關閉或手動關閉
// @author       tunafin
// @match        *://greasyfork.org/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535984/Script%20Test%20Message%20on%20Greasy%20Fork.user.js
// @updateURL https://update.greasyfork.org/scripts/535984/Script%20Test%20Message%20on%20Greasy%20Fork.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 控制項
    const displayDuration = 5; // 設定提示框的顯示時間（秒）
    const fadeOutDuration = 500; // 淡出動畫持續時間 (毫秒)

    let secondsLeft = displayDuration;

    // 定義淡出函數
    function fadeOutAndRemove(element) {
        element.style.opacity = '0'; // 設置透明度為 0
        setTimeout(() => {
            element.remove(); // 在淡出動畫結束後移除元素
        }, fadeOutDuration); // 與 CSS transition 時間相匹配
    }

    function getCurrentMsg() {
        return `測試腳本運行成功，點擊關閉或在 ${secondsLeft} 秒後自動關閉`;
    }

    // 創建提示訊息容器
    const messageBox = document.createElement('div');
    messageBox.style.position = 'fixed';
    messageBox.style.top = '35px';
    messageBox.style.right = '10px';
    messageBox.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // 半透明背景
    messageBox.style.color = '#fff';
    messageBox.style.padding = '10px 20px';
    messageBox.style.borderRadius = '5px';
    messageBox.style.fontSize = '14px';
    messageBox.style.zIndex = '9999';
    messageBox.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
    messageBox.style.textAlign = 'center';
    messageBox.style.transition = `opacity ${fadeOutDuration/1000}s`; // 添加淡出效果
    messageBox.style.cursor = 'pointer';

    messageBox.textContent = getCurrentMsg();

    // 將訊息容器加入頁面
    document.body.appendChild(messageBox);

    // 每秒更新倒計時
    const interval = setInterval(() => {
        secondsLeft -= 1;
        if (secondsLeft > 0) {
            messageBox.textContent = getCurrentMsg();
        } else {
            // 倒計時結束後，淡出訊息
            clearInterval(interval);
            fadeOutAndRemove(messageBox);
        }
    }, 1000);

    messageBox.addEventListener('click', () => {
        fadeOutAndRemove(messageBox);
    });
})();