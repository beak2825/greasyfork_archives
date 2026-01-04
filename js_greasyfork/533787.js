// ==UserScript==
// @name         广告加速器 & 数据清理（大号悬浮版）
// @namespace    https://github.com/你的Github账号
// @version      1.4
// @description  【强力推荐】自动2倍速跳过广告 + 一键清理数据并刷新，永久免费无广告！
// @author       你的名字/昵称
// @match        *://*/*
// @icon         https://i.imgur.com/图标文件名.png
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/533787/%E5%B9%BF%E5%91%8A%E5%8A%A0%E9%80%9F%E5%99%A8%20%20%E6%95%B0%E6%8D%AE%E6%B8%85%E7%90%86%EF%BC%88%E5%A4%A7%E5%8F%B7%E6%82%AC%E6%B5%AE%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/533787/%E5%B9%BF%E5%91%8A%E5%8A%A0%E9%80%9F%E5%99%A8%20%20%E6%95%B0%E6%8D%AE%E6%B8%85%E7%90%86%EF%BC%88%E5%A4%A7%E5%8F%B7%E6%82%AC%E6%B5%AE%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ====================== 大号悬浮按钮样式 ======================
    GM_addStyle(`
        .custom-tools {
            position: fixed;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 15px;
            padding-right: 10px;
        }
        .custom-btn {
            width: 200px;
            height: 200px;
            border-radius: 50%;
            background: #444;
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            font-weight: bold;
            padding: 0;
            transition: all 0.2s;
        }
        .custom-btn:hover {
            opacity: 0.9;
            transform: scale(1.15);
            box-shadow: 0 6px 15px rgba(0,0,0,0.4);
        }
        #speed-btn {
            background: #4CAF50;
        }
        #clean-btn {
            background: #ff4444;
        }
    `);

    // 创建工具栏容器
    const toolBar = document.createElement('div');
    toolBar.className = 'custom-tools';
    document.body.appendChild(toolBar);

    // ====================== 广告加速功能 ======================
    let isDoubleSpeed = true;

    function speedUpVideos() {
        document.querySelectorAll('video').forEach(video => {
            try {
                video.playbackRate = isDoubleSpeed ? 2.0 : 1.0;
                video.defaultPlaybackRate = 2.0;
            } catch (e) {}
        });
    }

    const observer = new MutationObserver(() => speedUpVideos());
    observer.observe(document, { childList: true, subtree: true });

    // 创建加速按钮
    const speedBtn = document.createElement('button');
    speedBtn.id = 'speed-btn';
    speedBtn.textContent = '2×';
    toolBar.appendChild(speedBtn);

    speedBtn.addEventListener('click', () => {
        isDoubleSpeed = !isDoubleSpeed;
        speedBtn.textContent = isDoubleSpeed ? '2×' : '1×';
        speedUpVideos();
    });

    // ====================== 数据清理功能 ======================
    const cleanBtn = document.createElement('button');
    cleanBtn.id = 'clean-btn';
    cleanBtn.textContent = '♻';
    toolBar.appendChild(cleanBtn);

    cleanBtn.addEventListener('click', () => {
        localStorage.clear();
        sessionStorage.clear();
        if (window.indexedDB) {
            indexedDB.databases().then(dbs => {
                dbs.forEach(db => indexedDB.deleteDatabase(db.name));
            });
        }
        document.cookie.split(";").forEach(cookie => {
            const name = cookie.split("=")[0].trim();
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${location.hostname}`;
        });
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(registrations => {
                registrations.forEach(registration => registration.unregister());
            });
        }

        cleanBtn.textContent = '✔';
        setTimeout(() => location.reload(true), 800);
    });

    // 初始化加速
    speedUpVideos();
})();