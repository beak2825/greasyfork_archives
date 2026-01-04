// ==UserScript==
// @name         ChatGPT自动点击继续按钮并模拟鼠标活动
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  在ChatGPT对话中，当达到对话上限字数时，自动点击“继续生成”按钮，并模拟鼠标在页面内活动，轨迹随机且真实，不影响用户正常使用。每次检测到新按钮只点击一次。
// @author       mellow, chatgpt
// @match        https://chatgpt.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500609/ChatGPT%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%BB%A7%E7%BB%AD%E6%8C%89%E9%92%AE%E5%B9%B6%E6%A8%A1%E6%8B%9F%E9%BC%A0%E6%A0%87%E6%B4%BB%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/500609/ChatGPT%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%BB%A7%E7%BB%AD%E6%8C%89%E9%92%AE%E5%B9%B6%E6%A8%A1%E6%8B%9F%E9%BC%A0%E6%A0%87%E6%B4%BB%E5%8A%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义循环检测的间隔时间（毫秒）
    var interval = 3000;
    var lastClickedButton = null;

    // 检查并点击按钮的函数
    function checkAndClickButton() {
        var buttons = document.querySelectorAll('button');
        for (var i = 0; i < buttons.length; i++) {
            var buttonText = buttons[i].innerText.trim();
            if (buttonText === '继续生成' && buttons[i] !== lastClickedButton) {
                buttons[i].click();
                lastClickedButton = buttons[i];
                break;
            }
        }
    }

    // 模拟鼠标移动路径的函数
    function simulateMousePath() {
        var startX = Math.random() * window.innerWidth;
        var startY = Math.random() * window.innerHeight;
        var endX = Math.random() * window.innerWidth;
        var endY = Math.random() * window.innerHeight;
        var steps = 50; // 路径的步数

        for (let i = 0; i <= steps; i++) {
            setTimeout(function() {
                var x = startX + (endX - startX) * (i / steps);
                var y = startY + (endY - startY) * (i / steps);
                var event = new MouseEvent('mousemove', {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    clientX: x,
                    clientY: y
                });
                document.dispatchEvent(event);
            }, interval * i);
        }
    }

    setInterval(checkAndClickButton, interval);
    setInterval(simulateMousePath, interval * 10); // 每10次间隔模拟一次鼠标路径
})();
