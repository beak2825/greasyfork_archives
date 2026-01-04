// ==UserScript==
// @name         获取ChatGPT SessionToken
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  一键获取并复制OpenAI聊天的SessionToken，简化用户操作。
// @author       Flyrr & Yongmo & lyy0709 & GPT-4
// @match        https://chatgpt.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494278/%E8%8E%B7%E5%8F%96ChatGPT%20SessionToken.user.js
// @updateURL https://update.greasyfork.org/scripts/494278/%E8%8E%B7%E5%8F%96ChatGPT%20SessionToken.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个悬浮面板
    const panel = document.createElement('div');
    panel.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 1000; padding: 15px; border: 1px solid #ccc; border-radius: 12px; background: white; box-shadow: 0 4px 8px rgba(0,0,0,0.3); font-family: "Microsoft YaHei", sans-serif; display: none; flex-direction: column; align-items: start;';

    // 创建展开面板按钮
    const toggleButton = document.createElement('button');
    toggleButton.textContent = '☰';
    toggleButton.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 1100; padding: 4px 8px; background: #007bff; color: white; cursor: pointer; font-size: 24px; border-radius: 6px; display: block;';

    // 创建操作按钮
    const btnFetchAndCopy = document.createElement('button');
    btnFetchAndCopy.textContent = '获取并复制SessionToken';
    btnFetchAndCopy.style.cssText = 'margin-bottom: 10px; padding: 8px 15px; border: none; border-radius: 6px; color: white; cursor: pointer; font-size: 16px; width: 100%; text-align: center; background-color: #007bff;';

    // 创建文本显示区域
    const tokenDisplay = document.createElement('textarea');
    tokenDisplay.style.cssText = 'width: 100%; height: 60px; margin-bottom: 10px; padding: 10px; border-radius: 6px; border: 1px solid #ccc;';

    // 隐藏面板按钮
    const btnHidePanel = document.createElement('button');
    btnHidePanel.textContent = '隐藏面板';
    btnHidePanel.style.cssText = 'margin-bottom: 10px; padding: 8px 15px; border: none; border-radius: 6px; color: white; cursor: pointer; font-size: 16px; width: 100%; text-align: center; background-color: #ffc107;';
    btnHidePanel.onclick = function() {
        panel.style.display = 'none';
        toggleButton.style.display = 'block';
    };

    // 将元素添加到面板
    panel.appendChild(tokenDisplay);
    panel.appendChild(btnFetchAndCopy);
    panel.appendChild(btnHidePanel);
    document.body.appendChild(panel);
    document.body.appendChild(toggleButton);

    // Toggle panel display
    toggleButton.onclick = function() {
        panel.style.display = (panel.style.display === 'none') ? 'flex' : 'none';
        toggleButton.style.display = (panel.style.display === 'flex') ? 'none' : 'block';
    };

    // 按钮点击事件：获取并复制Token
    btnFetchAndCopy.onclick = function() {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://chatgpt.com/chat",
            onload: function(response) {
                const cookieHeader = response.responseHeaders;
                const match = cookieHeader.match(/__Secure-next-auth.session-token=([^;]+);/);
                if (match && match[1]) {
                    const sessionToken = match[1];
                    tokenDisplay.value = sessionToken;
                    GM_setClipboard(sessionToken, 'text');
                    alert('Session Token 已复制到剪贴板:\n' + sessionToken);
                } else {
                    alert('Session Token 未找到。可能是因为浏览器安全策略限制了头部信息的获取。');
                }
            },
            onerror: function() {
                alert('Failed to fetch session information.');
            }
        });
    };
})();
