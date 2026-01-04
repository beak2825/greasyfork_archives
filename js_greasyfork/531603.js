// ==UserScript==
// @name        M-Team搜索
// @namespace   Violentmonkey Scripts
// @match       https://javdb.com/*
// @grant       none
// @version     1.0
// @license      MIT
// @author      -
// @description 2025/4/3 00:10:03
// @downloadURL https://update.greasyfork.org/scripts/531603/M-Team%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/531603/M-Team%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==
(function() {
    // 创建增强版搜索按钮
    const searchBtn = document.createElement('button');
    searchBtn.textContent = 'M-Team搜索';
    searchBtn.style.cssText = `
        position: fixed;
        left: 20px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 9999;
        padding: 12px 24px;
        background: linear-gradient(135deg, #2196F3, #1976D2);
        color: white;
        border: none;
        border-radius: 25px;
        cursor: pointer;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        font-size: 16px;
        font-family: 'Segoe UI', sans-serif;
        transition: all 0.3s;
    `;

    // 按钮交互效果
    searchBtn.addEventListener('mouseover', () => {
        searchBtn.style.transform = 'translateY(-50%) scale(1.05)';
        searchBtn.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)';
    });

    searchBtn.addEventListener('mouseout', () => {
        searchBtn.style.transform = 'translateY(-50%) scale(1)';
        searchBtn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    });

    // 智能匹配逻辑增强版
    const extractKeyword = (title) => {
        // 支持多种番号格式：3-5字母 + 3-5数字
        const patterns = [
            /\b([A-Z]{3,5}-\d{3,5})\b/,       // 基础匹配
            /(^|[^\u4E00-\u9FFF])([A-Z]{3,5}-\d{3,5})(?=$|[^\u4E00-\u9FFF])/ // 中日文混排场景
        ];

        for (let pattern of patterns) {
            const match = title.match(pattern);
            if (match && match[1]) return match[1];
            if (match && match[2]) return match[2];
        }
        return null;
    };

    // 点击事件处理
    searchBtn.addEventListener('click', () => {
        const keyword = extractKeyword(document.title);

        if (keyword) {
            const searchUrl = `https://kp.m-team.cc/browse/adult?keyword=${encodeURIComponent(keyword)}`;
            window.open(searchUrl, '_blank', 'noopener,noreferrer');
        } else {
            alert('未检测到有效番号格式，支持以下格式：\nLUXU-1590\nJUFE-246\nJUQ-191');
        }
    });

    // 添加按钮到页面
    document.body.appendChild(searchBtn);
})();