// ==UserScript==
// @name         站长之家增强-页面域名收集器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动收集站长之家页面中出现的域名，并复制规范化域名到剪贴板
// @author       Aethersailor
// @match        *://*.chinaz.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/532625/%E7%AB%99%E9%95%BF%E4%B9%8B%E5%AE%B6%E5%A2%9E%E5%BC%BA-%E9%A1%B5%E9%9D%A2%E5%9F%9F%E5%90%8D%E6%94%B6%E9%9B%86%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/532625/%E7%AB%99%E9%95%BF%E4%B9%8B%E5%AE%B6%E5%A2%9E%E5%BC%BA-%E9%A1%B5%E9%9D%A2%E5%9F%9F%E5%90%8D%E6%94%B6%E9%9B%86%E5%99%A8.meta.js
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

    // 保持原有核心逻辑（修改部分）
    function processLinks() {
        if (!isEnabled) return;

        const linkSet = new Set();
        const domainRegex = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,})(?:\/|:|\)|]|,|$)/g;

        // 使用 TreeWalker 遍历所有文本节点
        const treeWalker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            { acceptNode: node => node.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT }
        );

        while (treeWalker.nextNode()) {
            const text = treeWalker.currentNode.textContent;
            let match;
            
            while ((match = domainRegex.exec(text)) !== null) {
                try {
                    // 自动补全协议头
                    const domain = match[0].startsWith('http') ? match[0] : `http://${match[0]}`;
                    const url = new URL(domain);
                    if (!['http:', 'https:'].includes(url.protocol)) continue;

                    // 规范化输出格式
                    const cleanURL = `${url.protocol}//${url.hostname}/`.toLowerCase();
                    linkSet.add(cleanURL);
                } catch(e) { /* 忽略无效URL */ }
            }
        }

        // 保持原有的剪贴板输出逻辑不变
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