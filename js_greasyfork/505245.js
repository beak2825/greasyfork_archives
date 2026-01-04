// ==UserScript==
// @name         复制链接按钮
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  在右下角添加一个按钮，点击后复制当前网页链接，并显示提示信息
// @author       KaidQiao
// @match        *://*/*
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505245/%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/505245/%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮元素
    let button = document.createElement('button');
    button.innerText = '复制链接';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.zIndex = '1000';
    button.style.padding = '10px';
    button.style.backgroundColor = 'rgba(169, 169, 169, 0.6)'; // 初始背景色：透明灰色
    button.style.color = 'white'; // 文字颜色：白色
    button.style.border = 'none'; // 取消边框
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.backdropFilter = 'blur(10px)'; // 毛玻璃效果
    button.style.transition = 'background-color 0.3s'; // 背景色过渡效果

    // 添加鼠标经过事件
    button.addEventListener('mouseover', function() {
        button.style.backgroundColor = 'rgba(9, 187, 7, 0.8)'; // 鼠标经过背景色：透明绿色
    });

    // 添加鼠标离开事件
    button.addEventListener('mouseout', function() {
        button.style.backgroundColor = 'rgba(169, 169, 169, 0.6)'; // 鼠标离开背景色：透明灰色
    });

    // 添加按钮点击事件
    button.onclick = function() {
        let url = window.location.href;
        GM_setClipboard(url, 'text');
        
        // 创建并显示提示信息
        let tooltip = document.createElement('div');
        tooltip.innerText = '链接已复制';
        tooltip.style.position = 'fixed';
        tooltip.style.bottom = '60px';
        tooltip.style.right = '20px';
        tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        tooltip.style.color = 'white';
        tooltip.style.padding = '5px 10px';
        tooltip.style.borderRadius = '3px';
        tooltip.style.zIndex = '1001';
        document.body.appendChild(tooltip);

        // 3秒后移除提示信息
        setTimeout(function() {
            tooltip.remove();
        }, 3000);
    };

    // 将按钮添加到页面上
    document.body.appendChild(button);
})();
