// ==UserScript==
// @name         R2T Add-on
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description  在Google Maps上添加一个按钮，直接将当前路径发送到Route2TXT
// @author       Kai
// @match        *://*.google.com/maps*
// @match        *://*.google.*/*map*
// @match        *://*.google.*.*/*map*
// @match        *://*.google.com.hk/*map*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520891/R2T%20Add-on.user.js
// @updateURL https://update.greasyfork.org/scripts/520891/R2T%20Add-on.meta.js
// ==/UserScript==


(function() {
    'use strict';

    let childWindow = null;

    function sendMessageToChild(message) {
        if (childWindow) {
            childWindow.postMessage(message, 'https://r2t.h0.work/');
            console.log("Sent");
        }
    }

    function createButton(targetContainer) {
        // 检查是否已经插入按钮
        if (targetContainer.querySelector('.custom-arrow-button')) return;

        // 创建新的按钮元素
        const newButton = document.createElement('button');
        newButton.className = 'J45yZc custom-arrow-button'; // 添加标识类，避免重复插入
        newButton.setAttribute('aria-label', '新しいボタン');
        newButton.setAttribute('jsaction', 'click:newButtonClick');

        // 创建新的图标 (SVG)
        const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgIcon.setAttribute('t', '1734341356088');
        svgIcon.setAttribute('class', 'icon');
        svgIcon.setAttribute('viewBox', '0 0 1024 1024');
        svgIcon.setAttribute('version', '1.1');
        svgIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svgIcon.setAttribute('p-id', '2495');
        svgIcon.setAttribute('width', '21');
        svgIcon.setAttribute('height', '21');

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M832 640h-192c-35.2 0-64-28.8-64-64s28.8-64 64-64h192s192-214 192-320-86-192-192-192-192 86-192 192c0 51 44.4 126.8 90.6 192H640c-105.8 0-192 86.2-192 192s86.2 192 192 192h192c35.2 0 64 28.8 64 64s-28.8 64-64 64H371c-32 49.6-67.6 95.4-94.6 128H832c105.8 0 192-86.2 192-192s-86.2-192-192-192z m0-512c35.4 0 64 28.6 64 64s-28.6 64-64 64-64-28.6-64-64 28.6-64 64-64zM192 512c-106 0-192 86-192 192s192 320 192 320 192-214 192-320-86-192-192-192z m0 256c-35.4 0-64-28.6-64-64s28.6-64 64-64 64 28.6 64 64-28.6 64-64 64z');
        path.setAttribute('p-id', '2496');

        svgIcon.appendChild(path);
        newButton.appendChild(svgIcon);

        // 为按钮添加点击事件
        newButton.addEventListener('click', function() {
            // 检查子窗口是否已经打开
            if (!childWindow || childWindow.closed) {
                childWindow = window.open('https://r2t.h0.work/', '_blank');
            } else {
                childWindow.focus();
            }

            // 模拟 Ctrl+A 并复制当前所有文本
            const allText = document.body.innerText; // 获取当前页面的所有文本

            // 延迟 0.5 秒发送文本到子窗口
            setTimeout(() => {
                sendMessageToChild(allText);
            }, 500);
        });

        // 将按钮插入到目标容器
        const firstButton = targetContainer.firstChild;
        targetContainer.insertBefore(newButton, firstButton);
    }

    // 使用 MutationObserver 监控 DOM 变化
    function observeDOM() {
        const observer = new MutationObserver(() => {
            const targetContainer = document.querySelector('.MyVbZc.Hk4XGb');
            if (targetContainer) {
                createButton(targetContainer);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    // 启动观察器
    observeDOM();
})();
