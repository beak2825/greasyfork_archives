// ==UserScript==
// @name         Tencent Redirect Bypass
// @version      0.3
// @description  跳过 c.pc.qq.com 跳转页；显示优雅的提示界面后自动跳转到真实网址
// @author       LMFuture
// @match        https://c.pc.qq.com/*
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1473376
// @downloadURL https://update.greasyfork.org/scripts/539603/Tencent%20Redirect%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/539603/Tencent%20Redirect%20Bypass.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ---------- 解析真实 URL ---------- */
    const params  = new URLSearchParams(window.location.search);
    let   realURL = params.get('url');
    if (!realURL) return;
    try { realURL = decodeURIComponent(realURL); } catch (_) {}

    /* ---------- 注入样式 ---------- */
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }

        @keyframes progress {
            from { width: 0%; }
            to { width: 100%; }
        }

        .bypass-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 999999;
            animation: fadeIn 0.3s ease-out;
        }

        .bypass-container {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px 60px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.2);
            animation: pulse 2s infinite;
        }

        .bypass-title {
            color: #fff;
            font-size: 3rem;
            font-weight: bold;
            margin-bottom: 20px;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .bypass-subtitle {
            color: rgba(255, 255, 255, 0.9);
            font-size: 1.2rem;
            margin-bottom: 30px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .bypass-url {
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.9rem;
            word-break: break-all;
            max-width: 500px;
            margin-bottom: 20px;
            padding: 15px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 10px;
            font-family: monospace;
        }

        .bypass-progress {
            width: 300px;
            height: 4px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 2px;
            overflow: hidden;
        }

        .bypass-progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
            animation: progress 0.8s linear;
        }
    `;
    document.head.appendChild(style);

    /* ---------- 创建提示界面 ---------- */
    const overlay = document.createElement('div');
    overlay.className = 'bypass-overlay';

    const container = document.createElement('div');
    container.className = 'bypass-container';

    const title = document.createElement('div');
    title.className = 'bypass-title';
    title.textContent = '腾讯傻逼';

    const subtitle = document.createElement('div');
    subtitle.className = 'bypass-subtitle';
    subtitle.textContent = '正在跳过无用的安全提示...';

    const urlDisplay = document.createElement('div');
    urlDisplay.className = 'bypass-url';
    urlDisplay.textContent = `目标地址: ${realURL}`;

    const progress = document.createElement('div');
    progress.className = 'bypass-progress';

    const progressBar = document.createElement('div');
    progressBar.className = 'bypass-progress-bar';

    /* ---------- 组装元素 ---------- */
    progress.appendChild(progressBar);
    container.appendChild(title);
    container.appendChild(subtitle);
    container.appendChild(urlDisplay);
    container.appendChild(progress);
    overlay.appendChild(container);
    document.documentElement.appendChild(overlay);

    /* ---------- 延迟跳转 ---------- */
    setTimeout(() => {
        window.location.replace(realURL);
    }, 800);
})();