// ==UserScript==
// @name         红色爱心飘落特效
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  为任意网页添加红色爱心飘落效果
// @author       Your name
// @match        *://*/*
// @exclude      *://cuntou0906.github.io/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/522444/%E7%BA%A2%E8%89%B2%E7%88%B1%E5%BF%83%E9%A3%98%E8%90%BD%E7%89%B9%E6%95%88.user.js
// @updateURL https://update.greasyfork.org/scripts/522444/%E7%BA%A2%E8%89%B2%E7%88%B1%E5%BF%83%E9%A3%98%E8%90%BD%E7%89%B9%E6%95%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    GM_addStyle(`
        .heart {
            color: #ff0000;
            position: fixed;
            top: -20px;
            font-size: 20px;
            text-shadow: 0 0 3px rgba(255, 0, 0, 0.3);
            pointer-events: none;
            z-index: 999999;
            animation: heartFall linear infinite;
        }
        @keyframes heartFall {
            0% {
                transform: translateY(-20px) rotate(0deg);
            }
            100% {
                transform: translateY(100vh) rotate(360deg);
            }
        }
    `);

    // 创建爱心元素
    function createHeart() {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = '❤';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = (Math.random() * 3 + 2) + 's'; // 2-5秒

        // 添加到页面
        document.body.appendChild(heart);

        // 动画结束后移除元素
        heart.addEventListener('animationend', () => heart.remove());
    }

    // 控制爱心创建
    function startHeartFall() {
        // 初始创建一批爱心
        for(let i = 0; i < 8; i++) {  // 减少初始爱心数量从15到8
            setTimeout(() => createHeart(), i * 300);  // 增加间隔时间从200ms到300ms
        }

        // 持续创建新的爱心
        setInterval(() => {
            const hearts = document.getElementsByClassName('heart');
            if(hearts.length < 15) {  // 减少最大数量限制从30到15
                createHeart();
            }
        }, 500);  // 增加创建间隔从200ms到500ms
    }

    // 确保在页面加载完成后运行
    if(document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startHeartFall);
    } else {
        startHeartFall();
    }
})();