// ==UserScript==
// @name         雨夜小助手-批量打开网址
// @namespace    http://web.yuyehk.cn/
// @version      0.2
// @description  雨夜工作室实用系列!一次性在Chrome中打开多个网址
// @author       YUYE
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480657/%E9%9B%A8%E5%A4%9C%E5%B0%8F%E5%8A%A9%E6%89%8B-%E6%89%B9%E9%87%8F%E6%89%93%E5%BC%80%E7%BD%91%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/480657/%E9%9B%A8%E5%A4%9C%E5%B0%8F%E5%8A%A9%E6%89%8B-%E6%89%B9%E9%87%8F%E6%89%93%E5%BC%80%E7%BD%91%E5%9D%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮
    var openButton = document.createElement('button');
    openButton.innerHTML = '一键打开网址';
    openButton.style.position = 'fixed';
    openButton.style.bottom = '10px';  // 贴底部
    openButton.style.left = '10px';
    openButton.style.zIndex = '9999';
    document.body.appendChild(openButton);

    // 初始状态为显示
    var isButtonVisible = true;

    // 监听按钮点击事件
    openButton.addEventListener('click', function() {
        // 获取剪贴板内容
        navigator.clipboard.readText().then(function(clipboardText) {
            // 将剪贴板内容按换行符分割成数组
            var urls = clipboardText.split('\n');

            // 遍历数组，打开每个网址
            urls.forEach(function(url) {
                // 确保网址以https://开头
                if (url.startsWith('https://')) {
                    // 使用 window.open 在新标签页中打开网址
                    window.open(url);
                } else {
                    console.error('无效的网址：', url);
                }
            });
        });
    });

    // 监听鼠标移动事件，控制按钮的显示和隐藏
    document.addEventListener('mousemove', function(event) {
        var mouseX = event.clientX;
        var mouseY = event.clientY;

        // 定义按钮显示的区域范围，例如鼠标在页面左侧200px以内时显示按钮
        var showButtonArea = 200;

        // 如果鼠标在显示按钮的区域范围内，显示按钮，否则隐藏按钮
        if (mouseX < showButtonArea) {
            showButton();
        } else {
            hideButton();
        }
    });

    // 显示按钮
    function showButton() {
        if (!isButtonVisible) {
            openButton.style.display = 'block';
            isButtonVisible = true;
        }
    }

    // 隐藏按钮
    function hideButton() {
        if (isButtonVisible) {
            openButton.style.display = 'none';
            isButtonVisible = false;
        }
    }
})();
