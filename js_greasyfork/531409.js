// ==UserScript==
// @name         新疆药学网考试跳过助手（醒目版）
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  显眼的考试跳过按钮
// @match        *://yxfw.xjyxjyw.com/*
// @match        *://*.yxfw.xjyxjyw.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531409/%E6%96%B0%E7%96%86%E8%8D%AF%E5%AD%A6%E7%BD%91%E8%80%83%E8%AF%95%E8%B7%B3%E8%BF%87%E5%8A%A9%E6%89%8B%EF%BC%88%E9%86%92%E7%9B%AE%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/531409/%E6%96%B0%E7%96%86%E8%8D%AF%E5%AD%A6%E7%BD%91%E8%80%83%E8%AF%95%E8%B7%B3%E8%BF%87%E5%8A%A9%E6%89%8B%EF%BC%88%E9%86%92%E7%9B%AE%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建高可见度按钮
    const btn = document.createElement('button');
    btn.innerHTML = '🚀 一键跳过考试';
    btn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        z-index: 2147483647;
        background: #FF4757;
        color: white !important;
        padding: 15px 25px;
        border: 2px solid #FF6B6B;
        border-radius: 15px;
        cursor: pointer;
        font-size: 18px;
        font-weight: bold;
        box-shadow: 0 4px 15px rgba(255, 71, 87, 0.4);
        text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
        animation: breath 1.5s infinite;
    `;

    // 添加呼吸动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes breath {
            0% { transform: scale(1); opacity: 0.9; }
            50% { transform: scale(1.05); opacity: 1; }
            100% { transform: scale(1); opacity: 0.9; }
        }
        button:hover {
            background: #FF6B6B !important;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(255, 71, 87, 0.6);
        }
    `;
    document.head.appendChild(style);

    // 保持原有功能代码...
    function findExamUrl() {
        const scripts = document.getElementsByTagName('script');
        for (let script of scripts) {
            const matches = script.textContent.match(/var examURL\s*=\s*["']([^"']+)["']/);
            if (matches && matches[1]) return matches[1];
        }
        return null;
    }

    btn.onclick = function() {
        const examPath = findExamUrl();
        if (examPath) {
            window.location.href = `http://yxfw.xjyxjyw.com/${examPath.replace(/^\//, '')}`;
        } else {
            btn.style.animation = 'shake 0.5s';  // 添加错误抖动效果
            setTimeout(() => btn.style.animation = '', 500);
            alert('⚠️ 考试链接未找到，请确认当前处于考试页面');
        }
    };

    // 添加抖动动画
    style.textContent += `
        @keyframes shake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            50% { transform: translateX(10px); }
            75% { transform: translateX(-10px); }
            100% { transform: translateX(0); }
        }
    `;

    document.body.appendChild(btn);
})();