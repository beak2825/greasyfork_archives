// ==UserScript==
// @name         B站广告动态屏蔽 (二开版)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  基于关键词实现的广告动态屏蔽，支持用户自定义关键词 (原作者: QingMu_, Assistant; 二开: lsw)
// @author       QingMu_, Assistant, lsw
// @match        https://t.bilibili.com/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546720/B%E7%AB%99%E5%B9%BF%E5%91%8A%E5%8A%A8%E6%80%81%E5%B1%8F%E8%94%BD%20%28%E4%BA%8C%E5%BC%80%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546720/B%E7%AB%99%E5%B9%BF%E5%91%8A%E5%8A%A8%E6%80%81%E5%B1%8F%E8%94%BD%20%28%E4%BA%8C%E5%BC%80%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置 ---
    const STORAGE_KEY = 'bilibiliAdBlockKeywords_v1.4'; // 版本化键名，避免冲突
    const DEFAULT_KEYWORDS = [
        "淘宝闪购",
        "美团外卖",
    ];

    const PLACEHOLDER_TEXT_PREFIX = "检测到关键词 '";
    const PLACEHOLDER_TEXT_SUFFIX = "'，广告已屏蔽";
    const OBSERVER_CONFIG = { childList: true, subtree: true };
    const RETRY_INTERVAL = 500;
    const MAX_RETRIES = 20;

    // --- 状态变量 ---
    let BLOCKED_KEYWORDS = [];
    let retryCount = 0;
    let settingsPanel = null; // 缓存设置面板元素

    // --- UI 样式 ---
    const UI_STYLES = `
        #bilibili-adblock-settings-btn {
            position: fixed;
            top: 120px; /* 放在默认播放速度按钮下方 */
            right: 10px;
            z-index: 10000;
            padding: 8px 12px;
            background-color: #00a1d6;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            transition: background-color 0.3s;
        }
        #bilibili-adblock-settings-btn:hover {
            background-color: #00b5e5;
        }

        #bilibili-adblock-settings-panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 500px;
            max-height: 80vh;
            background-color: white;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10001;
            padding: 20px;
            display: none; /* 默认隐藏 */
            flex-direction: column;
            font-family: Arial, sans-serif;
        }
        #bilibili-adblock-settings-panel h2 {
            margin-top: 0;
            margin-bottom: 15px;
            text-align: center;
        }
        #bilibili-adblock-keyword-list {
            list-style: none;
            padding: 0;
            margin: 0 0 15px 0;
            border: 1px solid #ddd;
            border-radius: 4px;
            max-height: 200px;
            overflow-y: auto;
        }
        #bilibili-adblock-keyword-list li {
            padding: 8px 12px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        #bilibili-adblock-keyword-list li:last-child {
            border-bottom: none;
        }
        .bilibili-adblock-keyword-text {
            flex-grow: 1;
            word-break: break-all;
        }
        .bilibili-adblock-delete-btn {
            background-color: #ff4d4f;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 4px 8px;
            cursor: pointer;
            font-size: 12px;
        }
        .bilibili-adblock-delete-btn:hover {
            background-color: #ff7875;
        }
        #bilibili-adblock-add-section {
            display: flex;
            margin-bottom: 15px;
        }
        #bilibili-adblock-new-keyword {
            flex-grow: 1;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px 0 0 4px;
            font-size: 14px;
        }
        #bilibili-adblock-add-btn {
            padding: 8px 12px;
            background-color: #00a1d6;
            color: white;
            border: none;
            border-radius: 0 4px 4px 0;
            cursor: pointer;
            font-size: 14px;
        }
        #bilibili-adblock-add-btn:hover {
            background-color: #00b5e5;
        }
        #bilibili-adblock-panel-actions {
            display: flex;
            justify-content: space-between;
        }
        .bilibili-adblock-panel-btn {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        #bilibili-adblock-save-btn {
            background-color: #00a1d6;
            color: white;
        }
        #bilibili-adblock-save-btn:hover {
            background-color: #00b5e5;
        }
        #bilibili-adblock-close-btn, #bilibili-adblock-reset-btn {
            background-color: #f0f0f0;
            color: #333;
        }
        #bilibili-adblock-close-btn:hover, #bilibili-adblock-reset-btn:hover {
            background-color: #e0e0e0;
        }
        #bilibili-adblock-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 10000; /* 略低于面板 */
            display: none; /* 默认隐藏 */
        }
    `;

    // --- 数据持久化 ---
    function loadKeywords() {
        try {
            const storedKeywords = localStorage.getItem(STORAGE_KEY);
            if (storedKeywords) {
                const parsed = JSON.parse(storedKeywords);
                if (Array.isArray(parsed)) {
                    console.log("B站广告屏蔽: 已加载用户自定义关键词");
                    return parsed;
                }
            }
        } catch (e) {
            console.error("B站广告屏蔽: 加载关键词失败:", e);
        }
        console.log("B站广告屏蔽: 使用默认关键词");
        return [...DEFAULT_KEYWORDS]; // 返回副本
    }

    function saveKeywords(keywordsArray) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(keywordsArray));
            console.log("B站广告屏蔽: 关键词已保存到 localStorage");
            return true;
        } catch (e) {
            console.error("B站广告屏蔽: 保存关键词失败:", e);
            alert("保存失败，请检查浏览器存储空间或权限设置。");
            return false;
        }
    }

    // --- UI 创建与交互 ---
    function injectStyles() {
        if (!document.getElementById('bilibili-adblock-styles')) {
            const styleSheet = document.createElement("style");
            styleSheet.id = 'bilibili-adblock-styles';
            styleSheet.innerText = UI_STYLES;
            document.head.appendChild(styleSheet);
        }
    }

    function createSettingsUI() {
        // 防止重复创建
        if (document.getElementById('bilibili-adblock-settings-btn')) return;

        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.id = 'bilibili-adblock-overlay';
        overlay.addEventListener('click', closeSettingsPanel);
        document.body.appendChild(overlay);

        // 创建设置按钮
        const settingsBtn = document.createElement('button');
        settingsBtn.id = 'bilibili-adblock-settings-btn';
        settingsBtn.textContent = '屏蔽设置';
        settingsBtn.addEventListener('click', openSettingsPanel);
        document.body.appendChild(settingsBtn);

        // 创建设置面板
        const panel = document.createElement('div');
        panel.id = 'bilibili-adblock-settings-panel';
        panel.innerHTML = `
            <h2>B站广告屏蔽设置</h2>
            <ul id="bilibili-adblock-keyword-list"></ul>
            <div id="bilibili-adblock-add-section">
                <input type="text" id="bilibili-adblock-new-keyword" placeholder="输入新关键词">
                <button id="bilibili-adblock-add-btn">添加</button>
            </div>
            <div id="bilibili-adblock-panel-actions">
                <button id="bilibili-adblock-reset-btn" class="bilibili-adblock-panel-btn">重置为默认</button>
                <div>
                    <button id="bilibili-adblock-close-btn" class="bilibili-adblock-panel-btn">取消</button>
                    <button id="bilibili-adblock-save-btn" class="bilibili-adblock-panel-btn">保存</button>
                </div>
            </div>
        `;
        document.body.appendChild(panel);
        settingsPanel = panel; // 缓存面板引用

        // 绑定事件
        document.getElementById('bilibili-adblock-add-btn').addEventListener('click', addKeywordFromInput);
        document.getElementById('bilibili-adblock-new-keyword').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') addKeywordFromInput();
        });
        document.getElementById('bilibili-adblock-save-btn').addEventListener('click', saveSettings);
        document.getElementById('bilibili-adblock-close-btn').addEventListener('click', closeSettingsPanel);
        document.getElementById('bilibili-adblock-reset-btn').addEventListener('click', resetToDefaults);
    }

    function openSettingsPanel() {
        if (!settingsPanel) return;
        populateKeywordList(); // 打开时更新列表
        document.getElementById('bilibili-adblock-overlay').style.display = 'block';
        settingsPanel.style.display = 'flex';
        document.getElementById('bilibili-adblock-new-keyword').focus();
    }

    function closeSettingsPanel() {
        if (!settingsPanel) return;
        document.getElementById('bilibili-adblock-overlay').style.display = 'none';
        settingsPanel.style.display = 'none';
    }

    function populateKeywordList(keywords = BLOCKED_KEYWORDS) {
        const listElement = document.getElementById('bilibili-adblock-keyword-list');
        listElement.innerHTML = ''; // 清空现有列表
        keywords.forEach(keyword => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="bilibili-adblock-keyword-text">${keyword}</span>
                <button class="bilibili-adblock-delete-btn" data-keyword="${keyword}">删除</button>
            `;
            listElement.appendChild(li);
        });
        // 为新添加的删除按钮绑定事件
        listElement.querySelectorAll('.bilibili-adblock-delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const keywordToRemove = this.getAttribute('data-keyword');
                removeFromKeywordList(keywordToRemove);
            });
        });
    }

    function addKeywordFromInput() {
        const input = document.getElementById('bilibili-adblock-new-keyword');
        const newKeyword = input.value.trim();
        if (newKeyword && !BLOCKED_KEYWORDS.includes(newKeyword)) {
            BLOCKED_KEYWORDS.push(newKeyword);
            populateKeywordList(); // 更新UI
            input.value = ''; // 清空输入框
        } else if (newKeyword && BLOCKED_KEYWORDS.includes(newKeyword)) {
            alert("关键词已存在！");
        }
        input.focus();
    }

    function removeFromKeywordList(keyword) {
        BLOCKED_KEYWORDS = BLOCKED_KEYWORDS.filter(k => k !== keyword);
        populateKeywordList(); // 更新UI
    }

    function resetToDefaults() {
        if (confirm("确定要重置为默认关键词列表吗？")) {
            BLOCKED_KEYWORDS = [...DEFAULT_KEYWORDS];
            populateKeywordList(); // 更新UI
        }
    }

    function saveSettings() {
        // 从UI列表中获取当前关键词（更安全）
        const currentKeywords = [];
        document.querySelectorAll('#bilibili-adblock-keyword-list .bilibili-adblock-keyword-text').forEach(span => {
            currentKeywords.push(span.textContent);
        });
        BLOCKED_KEYWORDS = currentKeywords;

        if (saveKeywords(BLOCKED_KEYWORDS)) {
            closeSettingsPanel();
            blockAds(); // 应用新规则
            console.log("B站广告屏蔽: 设置已保存并应用");
        }
    }


    // --- 核心屏蔽逻辑 ---
    function getDynamicItems() {
        return document.querySelectorAll(".bili-dyn-item__main");
    }

    function findBlockedKeyword(text) {
        return BLOCKED_KEYWORDS.find(keyword =>
                                     text.includes(keyword)
                                    ) || null;
    }

    function blockAds() {
        try {
            const dynamicItems = getDynamicItems();
            dynamicItems.forEach((item) => {
                if (item.innerText) {
                    const matchedKeyword = findBlockedKeyword(item.innerText);
                    if (matchedKeyword) {
                        const bodyElement = item.querySelector('.bili-dyn-item__body');
                        if (bodyElement && !bodyElement.dataset.blocked) {
                            bodyElement.dataset.blocked = 'true';
                            bodyElement.style.display = 'none';

                            const placeholder = document.createElement('div');
                            placeholder.className = 'ad-blocked-placeholder';
                            placeholder.style.cssText = `
                                color: #999;
                                font-style: italic;
                                padding: 15px 20px;
                                border: 1px dashed #ccc;
                                border-radius: 4px;
                                margin: 10px 0;
                                background-color: #f9f9f9;
                            `;
                            placeholder.textContent = `${PLACEHOLDER_TEXT_PREFIX}${matchedKeyword}${PLACEHOLDER_TEXT_SUFFIX}`;

                            bodyElement.parentNode.insertBefore(placeholder, bodyElement.nextSibling);
                        }
                    }
                }
            });
        } catch (error) {
            console.error("B站广告屏蔽脚本执行出错:", error);
        }
    }

    // --- 脚本初始化 ---
    function initializeScript() {
        BLOCKED_KEYWORDS = loadKeywords(); // 1. 加载关键词
        injectStyles();                   // 2. 注入样式
        createSettingsUI();               // 3. 创建UI
        startObserver();                  // 4. 启动监听
        console.log("B站广告屏蔽脚本 (v1.4) 已初始化");
    }

    function startObserver() {
        const targetNode = document.querySelector(".bili-dyn-list");
        if (targetNode) {
            blockAds(); // Initial run
            const observer = new MutationObserver(blockAds);
            observer.observe(targetNode, OBSERVER_CONFIG);
            console.log("B站广告屏蔽脚本已启动并开始监听。");
        } else if (retryCount < MAX_RETRIES) {
            retryCount++;
            console.log(`B站广告屏蔽: 等待动态列表加载... (${retryCount}/${MAX_RETRIES})`);
            setTimeout(startObserver, RETRY_INTERVAL);
        } else {
            console.warn("B站广告屏蔽脚本：未能找到动态列表容器 '.bili-dyn-list'，脚本可能需要更新或已失效。");
        }
    }

    // --- 启动 ---
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeScript);
    } else {
        initializeScript();
    }

})();