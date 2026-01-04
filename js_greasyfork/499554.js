// ==UserScript==
// @name         O页面演示文本编辑器
// @namespace    your-namespace
// @version      5.4
// @description  方便编辑简单的文案查看排版
// @match        *://*.oppo.com/*
// @grant        GM_addStyle
// @license     GNU GPLv3
// @author        Paul
// @downloadURL https://update.greasyfork.org/scripts/499554/O%E9%A1%B5%E9%9D%A2%E6%BC%94%E7%A4%BA%E6%96%87%E6%9C%AC%E7%BC%96%E8%BE%91%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/499554/O%E9%A1%B5%E9%9D%A2%E6%BC%94%E7%A4%BA%E6%96%87%E6%9C%AC%E7%BC%96%E8%BE%91%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Enable design mode
    document.designMode = "on";

  // Disable all clicks
    document.addEventListener('click', function(event) {
        event.stopPropagation();
        event.preventDefault();
        event.returnValue = false;
        return false;
    }, true);

    // 获取页面上所有文本元素
    const textElements = document.querySelectorAll("*:not(script):not(style):not(title)");

    // 将文本层的CSS属性z-index设置为一个较大的值，使其位于其他元素之上
    textElements.forEach(element => {
        element.style.zIndex = "9999";
    });

 // 创建提示框元素
    const tooltip = document.createElement('div');
    tooltip.textContent = '演示模式-Demonstration Mode';

    // 设置提示框的样式
    tooltip.style.position = 'fixed';
    tooltip.style.bottom = '10px';
    tooltip.style.left = '10px';
    tooltip.style.zIndex = '9999';
    tooltip.style.padding = '10px';
    tooltip.style.borderRadius = '20px';
    tooltip.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';
    tooltip.style.fontFamily = 'Arial, sans-serif';
    tooltip.style.fontSize = '16px';
    tooltip.style.color = '#fff';
    tooltip.style.textAlign = 'center';
    tooltip.style.animation = 'colorChange 1s ease-in-out infinite alternate';

    // 创建颜色变化的动画
    GM_addStyle(`
        @keyframes colorChange {
            0% {
                background-color: #ff0000;
            }
            50% {
                background-color: #00ff00;
            }
            100% {
                background-color: #0000ff;
            }
        }
    `);

    // 添加提示框到页面
    document.body.appendChild(tooltip);




})();