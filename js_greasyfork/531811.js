// ==UserScript==
// @name         央视频m3u8提取器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动提取央视网视频真实m3u8地址，支持一键复制/下载/关闭
// @author       星空
// @match        *://*.cctv.com/*
// @match        *://*.cntv.cn/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_setClipboard
// @connect      cctv.com
// @connect      cntv.cn
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/531811/%E5%A4%AE%E8%A7%86%E9%A2%91m3u8%E6%8F%90%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/531811/%E5%A4%AE%E8%A7%86%E9%A2%91m3u8%E6%8F%90%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 拦截所有XHR请求
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (url.includes('getHttpVideoInfo.do')) {
            this.addEventListener('load', function() {
                try {
                    const response = JSON.parse(this.responseText);
                    handleHlsUrl(response.hls_url);
                } catch (e) {
                    console.error('解析失败:', e);
                }
            });
        }
        originalOpen.apply(this, arguments);
    };

    // 拦截Fetch请求
    const originalFetch = window.fetch;
    window.fetch = async function(input, init) {
        if (typeof input === 'string' && input.includes('getHttpVideoInfo.do')) {
            const response = await originalFetch(input, init);
            const clone = response.clone();
            clone.json().then(data => handleHlsUrl(data.hls_url));
            return response;
        }
        return originalFetch(input, init);
    };

    // 处理获取到的URL
    function handleHlsUrl(rawUrl) {
        const finalUrl = rawUrl.replace(/\\\//g, '/');
        if (document.getElementById('cctv-hls-panel')) return;

        // 创建浮动控制面板
        const panel = document.createElement('div');
        panel.id = 'cctv-hls-panel';
        panel.style = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #fff;
            padding: 15px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 99999;
            border-radius: 8px;
            min-width: 350px;
            animation: slideIn 0.3s ease-out;
        `;

        // 添加CSS动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            #cctv-hls-panel:hover #countdown { display: none; }
        `;
        document.head.appendChild(style);

        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <h3 style="margin:0; color:#333; font-size:16px;">🎬 视频地址已捕获</h3>
                <button id="closeBtn" style="
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #999;
                    font-size: 20px;
                    line-height: 1;
                    padding: 0 4px;
                    transition: color 0.3s;
                ">×</button>
            </div>
            <input id="hlsUrl"
                   style="
                       width: 100%;
                       padding: 8px;
                       margin-bottom: 12px;
                       border: 1px solid #ddd;
                       border-radius: 4px;
                       font-family: monospace;
                       font-size: 12px;
                       cursor: text;
                   "
                   value="${finalUrl}"
                   readonly>
            <div style="display:flex; gap:8px;">
                <button style="
                    flex:1;
                    padding:8px;
                    background:#2196F3;
                    color:white;
                    border:none;
                    border-radius:4px;
                    cursor:pointer;
                    transition: all 0.3s;
                " id="copyBtn">📋 复制</button>
                <button style="
                    flex:1;
                    padding:8px;
                    background:#4CAF50;
                    color:white;
                    border:none;
                    border-radius:4px;
                    cursor:pointer;
                    transition: all 0.3s;
                " id="openBtn">⬇️ 下载</button>
            </div>
            <div style="color:#666; font-size:12px; margin-top:10px; text-align:center;">
                提示：本窗口将在<span id="countdown">8</span>秒后自动关闭
            </div>
        `;

        document.body.appendChild(panel);

        // 事件绑定
        const closeBtn = document.getElementById('closeBtn');
        const copyBtn = document.getElementById('copyBtn');
        const openBtn = document.getElementById('openBtn');

        // 关闭功能
        closeBtn.addEventListener('click', () => {
            panel.remove();
            clearInterval(countdownInterval);
        });

        // 复制功能
        copyBtn.addEventListener('click', () => {
            GM_setClipboard(finalUrl, 'text');
            GM_notification({
                title: '✅ 复制成功',
                text: '视频地址已复制到剪贴板',
                timeout: 2000,
                highlight: true
            });
            panel.style.background = '#f8fff9';
            setTimeout(() => panel.style.background = '#fff', 500);
        });

        // 下载功能
        openBtn.addEventListener('click', () => {
            window.open(finalUrl, '_blank');
            panel.style.transform = 'scale(0.95)';
            setTimeout(() => panel.style.transform = 'scale(1)', 200);
        });

        // 悬停效果
        [closeBtn, copyBtn, openBtn].forEach(btn => {
            btn.addEventListener('mouseover', () => {
                if(btn === closeBtn) btn.style.color = '#ff4444';
                else btn.style.opacity = '0.8';
            });
            btn.addEventListener('mouseout', () => {
                if(btn === closeBtn) btn.style.color = '#999';
                else btn.style.opacity = '1';
            });
        });

        // 自动关闭功能
        let seconds = 8;
        const countdownElement = document.getElementById('countdown');
        const countdownInterval = setInterval(() => {
            seconds--;
            countdownElement.textContent = seconds;
            if (seconds <= 0) {
                panel.style.opacity = '0';
                setTimeout(() => panel.remove(), 300);
                clearInterval(countdownInterval);
            }
        }, 1000);
    }
})();