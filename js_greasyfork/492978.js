// ==UserScript==
// @name         OpenAI Token 增强管理
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  通过简单的界面操作增强您的OpenAI聊天体验，轻松获取和复制Access Token。面板始终可见，可手动最小化。
// @author       Yongmo & GPT-4 & Claude
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/492978/OpenAI%20Token%20%E5%A2%9E%E5%BC%BA%E7%AE%A1%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/492978/OpenAI%20Token%20%E5%A2%9E%E5%BC%BA%E7%AE%A1%E7%90%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 样式定义
    const styles = `
        #openai-token-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            padding: 15px;
            border: 1px solid #ccc;
            border-radius: 12px;
            background: white;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
            font-family: "Microsoft YaHei", sans-serif;
            display: flex;
            flex-direction: column;
            align-items: start;
            transition: all 0.3s ease-in-out;
        }
        #openai-token-panel.minimized {
            width: 40px;
            height: 40px;
            overflow: hidden;
            padding: 0;
            border-radius: 50%;
            cursor: pointer;
        }
        #openai-token-panel.minimized:hover {
            background-color: #f0f0f0;
        }
        #openai-token-panel button {
            margin-bottom: 10px;
            padding: 8px 15px;
            border: none;
            border-radius: 6px;
            color: white;
            cursor: pointer;
            font-size: 14px;
            width: 100%;
            text-align: center;
            transition: background-color 0.2s;
        }
        #openai-token-panel button:hover {
            filter: brightness(1.1);
        }
        #openai-token-display {
            width: 100%;
            height: 60px;
            margin-bottom: 10px;
            padding: 10px;
            border-radius: 6px;
            border: 1px solid #ccc;
            resize: vertical;
        }
        #expand-button {
            display: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: #007bff;
            color: white;
            font-size: 20px;
            line-height: 40px;
            text-align: center;
        }
        #openai-token-panel.minimized #expand-button {
            display: block;
        }
    `;

    // 添加样式到页面
    GM_addStyle(styles);

    // 创建面板元素
    function createPanel() {
        const panel = document.createElement('div');
        panel.id = 'openai-token-panel';
        panel.innerHTML = `
            <button id="fetch-token" style="background-color: #28a745;">获取 AccessToken</button>
            <textarea id="openai-token-display" placeholder="AccessToken 将显示在这里"></textarea>
            <button id="copy-token" style="background-color: #007bff;">复制 AccessToken</button>
            <button id="toggle-panel" style="background-color: #ffc107;">最小化面板</button>
            <div id="expand-button">+</div>
        `;
        return panel;
    }

    // 获取AccessToken
    async function fetchAccessToken() {
        try {
            const response = await fetch("https://chatgpt.com/api/auth/session");
            if (!response.ok) throw new Error(`HTTP 错误! 状态: ${response.status}`);
            const { accessToken } = await response.json();
            if (!accessToken) throw new Error('响应中未找到 Access Token.');
            return accessToken;
        } catch (error) {
            console.error('获取 Access Token 失败:', error);
            alert('获取 Access Token 失败: ' + error.message);
        }
    }

    // 复制到剪贴板
    function copyToClipboard(accessToken) {
        const message = `ChatGPT Plus国内使用网址：https://new.oaifree.com\n\nAccessToken转ShareToken网址：https://chat.oaifree.com/token\n\nAccessToken号码：${accessToken}`;
        GM_setClipboard(message);
        alert('已复制到剪贴板:\n' + message);
    }

    // 初始化函数
    function init() {
        if (document.getElementById('openai-token-panel')) return;

        const panel = createPanel();
        document.body.appendChild(panel);

        const btnFetchToken = document.getElementById('fetch-token');
        const accessTokenDisplay = document.getElementById('openai-token-display');
        const btnCopyAccessToken = document.getElementById('copy-token');
        const btnTogglePanel = document.getElementById('toggle-panel');
        const expandButton = document.getElementById('expand-button');

        btnFetchToken.onclick = async () => {
            btnFetchToken.disabled = true;
            btnFetchToken.textContent = '获取中...';
            const accessToken = await fetchAccessToken();
            if (accessToken) accessTokenDisplay.value = accessToken;
            btnFetchToken.disabled = false;
            btnFetchToken.textContent = '获取 AccessToken';
        };

        btnCopyAccessToken.onclick = () => {
            const accessToken = accessTokenDisplay.value.trim();
            if (!accessToken) {
                alert('请先获取有效的 AccessToken.');
                return;
            }
            copyToClipboard(accessToken);
        };

        btnTogglePanel.onclick = () => {
            panel.classList.add('minimized');
        };

        expandButton.onclick = (e) => {
            e.stopPropagation();
            panel.classList.remove('minimized');
        };

        // 自动获取Token
        setTimeout(() => btnFetchToken.click(), 1000);
    }

    // 确保在DOM加载完成后执行初始化并持续监听DOM变化
    function ensureInit() {
        if (document.body) {
            init();

            // 使用 MutationObserver 来持续监听 DOM 变化
            const observer = new MutationObserver(() => {
                if (!document.getElementById('openai-token-panel')) {
                    init();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        } else {
            setTimeout(ensureInit, 100);
        }
    }

    // 初次执行
    ensureInit();
})();
