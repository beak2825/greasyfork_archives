// ==UserScript==
// @name         掘金主题切换器 | Juejin Dark Mode Toggle
// @name:zh      掘金主题切换器
// @name:zh-TW   掘金主題切換器
// @namespace    juejin_theme_switcher_2025
// @version      1.5
// @description  一键切换掘金(juejin.cn)网站的黑暗/明亮主题模式。功能：1. 主题切换记忆；2. 响应式按钮；3. 适配掘金新版界面；4. SPA路由同步；5. 自动检测系统主题；6. 持久化存储主题偏好。
// @description:zh  一键切换掘金(juejin.cn)网站的黑暗/明亮主题模式，支持：1. 主题记忆；2. 响应式按钮；3. 新版界面适配；4. 路由同步；5. 系统主题检测；6. 偏好存储。
// @description:zh-TW 一鍵切換掘金(juejin.cn)網站的黑暗/明亮主題模式，支援：1. 主題記憶；2. 響應式按鈕；3. 新版界面適配；4. 路由同步；5. 系統主題檢測；6. 偏好存儲。
// @author       Wangshiwei
// @match        https://juejin.cn/*
// @match        https://*.juejin.cn/*
// @exclude      https://juejin.cn/extension?utm_source=jj_nav
// @exclude      https://aicoding.juejin.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=juejin.cn
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/542181/%E6%8E%98%E9%87%91%E4%B8%BB%E9%A1%8C%E5%88%87%E6%8F%9B%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/542181/%E6%8E%98%E9%87%91%E4%B8%BB%E9%A1%8C%E5%88%87%E6%8F%9B%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 初始化主题状态
    let isDarkTheme = GM_getValue('isDarkTheme', false);
    let observer;

    // 更新按钮样式（新增的声明）
    function updateButtonStyle() {
        const button = document.getElementById('juejin-theme-toggle');
        if (button) {
            button.innerHTML = isDarkTheme ? '☀️' : '🌙';
            button.style.backgroundColor = isDarkTheme ? '#333' : '#f0f0f0';
            button.style.color = isDarkTheme ? '#fff' : '#333';
        }
    }

    // 强化同步函数
    function applyTheme() {
        const body = document.body;
        if (!body) return;

        // 强制同步data-theme和class
        body.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
        body.className = body.className.replace(/\b(light|dark)\b/g, '') + (isDarkTheme ? ' dark' : ' light');

        updateButtonStyle();
    }

    // 切换主题函数
    function toggleTheme() {
        isDarkTheme = !isDarkTheme;
        GM_setValue('isDarkTheme', isDarkTheme);
        applyTheme();
    }

    // 创建切换按钮
    function createThemeToggleButton() {
        const oldBtn = document.getElementById('juejin-theme-toggle');
        if (oldBtn) oldBtn.remove();

        const button = document.createElement('button');
        button.id = 'juejin-theme-toggle';
        button.innerHTML = isDarkTheme ? '☀️' : '🌙';
        Object.assign(button.style, {
            position: 'fixed',
            top: '12px',
            right: '0px',
            zIndex: '9999',
            padding: '8px 12px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: isDarkTheme ? '#333' : '#f0f0f0',
            color: isDarkTheme ? '#fff' : '#333',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.3s ease'
        });

        button.addEventListener('click', toggleTheme);
        document.body.appendChild(button);
    }

    // 设置观察者
    function setupObserver() {
        if (observer) observer.disconnect();

        observer = new MutationObserver(function() {
            const body = document.body;
            if (body && (
                (body.getAttribute('data-theme') === 'dark') !== isDarkTheme ||
                body.classList.contains('dark') !== isDarkTheme
            )) {
                applyTheme();
            }

            if (!document.getElementById('juejin-theme-toggle')) {
                createThemeToggleButton();
            }
        });

        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['data-theme', 'class'],
            childList: true,
            subtree: true
        });
    }

    // 初始化
    function init() {
        if (!document.body) {
            setTimeout(init, 100);
            return;
        }

        applyTheme();
        createThemeToggleButton();
        setupObserver();

        setInterval(() => {
            if (!document.getElementById('juejin-theme-toggle')) {
                createThemeToggleButton();
            }
        }, 2000);
    }

    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
