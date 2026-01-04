// ==UserScript==
// @name         广告加速器 & 数据清理 & 搜索
// @namespace    https://github.com/你的Github账号
// @version      1.6
// @description  自动2倍速播放广告 + 一键清理登录账号数据并刷新 + 自动搜索跳转至人名
// @author       hyeri2878
// @match        *://*/*
// @icon         https://i.imgur.com/图标文件名.png
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/533804/%E5%B9%BF%E5%91%8A%E5%8A%A0%E9%80%9F%E5%99%A8%20%20%E6%95%B0%E6%8D%AE%E6%B8%85%E7%90%86%20%20%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/533804/%E5%B9%BF%E5%91%8A%E5%8A%A0%E9%80%9F%E5%99%A8%20%20%E6%95%B0%E6%8D%AE%E6%B8%85%E7%90%86%20%20%E6%90%9C%E7%B4%A2.meta.js
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
            width: 140px;
            height: 140px;
            border-radius: 50%;
            background: #444;
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            font-weight: bold;
            padding: 0;
            transition: all 0.2s;
        }
        .custom-btn:hover {
            opacity: 0.9;
            transform: scale(1.15);
            box-shadow: 0 6px 15px rgba(0,0,0,0.4);
        
        }
        #clean-btn {
            background: #ff4444;
        }
        #search-btn {
            background: #2196F3;  // 新增搜索按钮的蓝色样式
        }
    `);

    // 创建工具栏容器
    const toolBar = document.createElement('div');
    toolBar.className = 'custom-tools';
    document.body.appendChild(toolBar);

    // ====================== 新增搜索功能 ======================
    const searchBtn = document.createElement('button');
    searchBtn.id = 'search-btn';
    searchBtn.textContent = '🔍';
    toolBar.appendChild(searchBtn);

    searchBtn.addEventListener('click', () => {
        // 触发浏览器原生搜索功能
        try {
            // 方法1：使用 window.find（部分浏览器支持）
            if (!window.find("HYE RI")) {
                // 未找到时执行反向搜索确保激活搜索框
                window.getSelection().empty();
                window.find("HYE RI", false, true);
            }
        } catch (e) {
            // 方法2：模拟键盘事件（需要用户手势）
            const evt = new KeyboardEvent('keydown', {
                ctrlKey: true,
                key: 'f',
                bubbles: true
            });
            document.dispatchEvent(evt);

            // 自动填充搜索词（需延时处理）
            setTimeout(() => {
                const inputs = [...document.querySelectorAll('input,textarea')];
                const searchField = inputs.find(el => el.type === 'search' || document.activeElement === el);
                if (searchField) searchField.value = 'HYE RI';
            }, 50);
        }
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

    
})();
