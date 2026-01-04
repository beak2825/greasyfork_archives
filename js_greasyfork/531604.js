// ==UserScript==
// @name        DB搜索
// @namespace   Violentmonkey Scripts
// @match       https://kp.m-team.cc/detail/*
// @grant       none
// @license      MIT
// @version     1.0
// @author      -
// @description 2025/4/3 00:03:30
// @downloadURL https://update.greasyfork.org/scripts/531604/DB%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/531604/DB%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==
(function() {
    // 创建搜索按钮
    const searchBtn = document.createElement('button');
    searchBtn.textContent = '搜索番号';
    searchBtn.style.cssText = `
        position: fixed;
        left: 20px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 9999;
        padding: 12px 24px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 25px;
        cursor: pointer;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        font-size: 16px;
        transition: all 0.3s;
    `;

    // 按钮悬停效果
    searchBtn.addEventListener('mouseover', () => {
        searchBtn.style.backgroundColor = '#45a049';
        searchBtn.style.transform = 'translateY(-50%) scale(1.05)';
    });

    searchBtn.addEventListener('mouseout', () => {
        searchBtn.style.backgroundColor = '#4CAF50';
        searchBtn.style.transform = 'translateY(-50%) scale(1)';
    });

    // 点击事件处理
    searchBtn.addEventListener('click', () => {
        // 从标题提取番号
        const pageTitle = document.title;
        const keywordMatch = pageTitle.match(/"([A-Z]+-\d+)/);

        if (keywordMatch && keywordMatch[1]) {
            const keyword = keywordMatch[1];
            const searchUrl = `https://javdb.com/search?q=${encodeURIComponent(keyword)}`;
            window.open(searchUrl, '_blank');
        } else {
            alert('未在标题中找到有效番号！');
        }
    });

    // 添加按钮到页面
    document.body.appendChild(searchBtn);
})();