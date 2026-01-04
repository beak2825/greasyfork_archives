// ==UserScript==
// @name         Chinaz Auto Pager 站长之家自动翻页器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  站长之家自动翻页脚本
// @author       Your Name
// @match        *://*.chinaz.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/532624/Chinaz%20Auto%20Pager%20%E7%AB%99%E9%95%BF%E4%B9%8B%E5%AE%B6%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/532624/Chinaz%20Auto%20Pager%20%E7%AB%99%E9%95%BF%E4%B9%8B%E5%AE%B6%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 添加开关样式
    GM_addStyle(`
        .auto-pager-switch {
            position: fixed;
            left: 20px;
            top: 20px;
            z-index: 9999;
            padding: 8px 15px;
            background: #f0f0f0;
            border: 1px solid #ccc;
            border-radius: 4px;
            cursor: pointer;
            user-select: none;
        }
        .active {
            background: #4CAF50 !important;
            color: white;
        }
    `);

    // 创建开关元素
    const switchElement = document.createElement('div');
    switchElement.className = 'auto-pager-switch';
    switchElement.textContent = '自动翻页：关闭';
    document.body.appendChild(switchElement);

    let intervalId = null;
    const clickNextPage = () => {
        // 查找包含 > 符号的下一页按钮
        const nextButton = [...document.querySelectorAll('a, button')].find(el => 
            el.textContent.trim() === '>' || 
            el.textContent.trim() === '下一页'
        );

        if (nextButton) {
            nextButton.click();
            console.log('已点击下一页');
        }
    };

    // 从存储获取初始状态
    let isEnabled = GM_getValue('autoPagerEnabled', false);
    
    // 创建开关元素
    switchElement.textContent = isEnabled ? '自动翻页：开启' : '自动翻页：关闭';
    if (isEnabled) {
        switchElement.classList.add('active');
        intervalId = setInterval(clickNextPage, 1000);
    }

    // 切换点击事件
    switchElement.addEventListener('click', () => {
        isEnabled = !isEnabled;
        GM_setValue('autoPagerEnabled', isEnabled);
        
        if (isEnabled) {
            intervalId = setInterval(clickNextPage, 1000);
            switchElement.textContent = '自动翻页：开启';
            switchElement.classList.add('active');
        } else {
            clearInterval(intervalId);
            intervalId = null;
            switchElement.textContent = '自动翻页：关闭';
            switchElement.classList.remove('active');
        }
    });
})();