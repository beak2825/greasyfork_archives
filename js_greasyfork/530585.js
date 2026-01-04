// ==UserScript==
// @name         URL 收集器 (搜索引擎专用)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动收集页面链接并复制规范化域名到剪贴板（仅限搜索引擎）
// @author       Aethersailor
// @match        *://www.baidu.com/*
// @match        *://www.bing.com/*
// @match        *://*.google.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/530585/URL%20%E6%94%B6%E9%9B%86%E5%99%A8%20%28%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E4%B8%93%E7%94%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/530585/URL%20%E6%94%B6%E9%9B%86%E5%99%A8%20%28%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E4%B8%93%E7%94%A8%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 保持原有样式不变
    GM_addStyle(`
        .tm-url-collector {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 2147483647;
            background: #fff;
            padding: 12px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            font-family: Arial, sans-serif;
        }
        .switch-container {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .switch-label {
            font-size: 14px;
            color: #333;
        }
        .switch {
            position: relative;
            display: inline-block;
            width: 48px;
            height: 24px;
        }
        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 34px;
        }
        .slider:before {
            position: absolute;
            content: "";
            height: 20px;
            width: 20px;
            left: 2px;
            bottom: 2px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }
        input:checked + .slider {
            background-color: #2196F3;
        }
        input:checked + .slider:before {
            transform: translateX(24px);
        }
    `);

    // 保持原有面板代码
    const panel = document.createElement('div');
    panel.className = 'tm-url-collector';
    panel.innerHTML = `
        <div class="switch-container">
            <label class="switch">
                <input type="checkbox" id="tm-toggle">
                <span class="slider"></span>
            </label>
            <span class="switch-label">链接收集器</span>
        </div>
    `;
    document.body.appendChild(panel);

    // 保持原有状态管理
    const toggle = panel.querySelector('#tm-toggle');
    let isEnabled = GM_getValue('enabled', false);
    toggle.checked = isEnabled;

    toggle.addEventListener('change', () => {
        isEnabled = !isEnabled;
        GM_setValue('enabled', isEnabled);
        if (isEnabled) processLinks();
    });

    // 保持原有核心逻辑
    function processLinks() {
        if (!isEnabled) return;

        const currentUrl = new URL(window.location.href);
        const linkSet = new Set();

        document.querySelectorAll('a[href]').forEach(a => {
            try {
                const url = new URL(a.href, currentUrl);
                if (!['http:', 'https:'].includes(url.protocol)) return;

                const cleanURL = `${url.protocol}//${url.hostname}/`;
                linkSet.add(cleanURL.toLowerCase());
            } catch(e) {}
        });

        if (linkSet.size > 0) {
            const result = Array.from(linkSet)
                .sort()
                .join('\n');

            GM_setClipboard(result, 'text');
        }
    }

    // 保持原有事件监听
    if (isEnabled) {
        window.addEventListener('load', processLinks);
        processLinks();
    }

    new MutationObserver(() => {
        if (isEnabled) processLinks();
    }).observe(document.body, {
        childList: true,
        subtree: true
    });
})();