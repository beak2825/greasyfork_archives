// ==UserScript==
// @name         SpankBang 视频链接提取下载器（复制 + 下载 + 进度）
// @namespace    https://greasyfork.org/
// @version      1.5
// @description  自动提取 spankbang 的视频链接，支持复制、下载、进度条，支持 .party 与 .com 域名。
// @author       You
// @match        https://spankbang.party/*
// @match        https://spankbang.com/*
// @grant        GM_setClipboard
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541526/SpankBang%20%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96%E4%B8%8B%E8%BD%BD%E5%99%A8%EF%BC%88%E5%A4%8D%E5%88%B6%20%2B%20%E4%B8%8B%E8%BD%BD%20%2B%20%E8%BF%9B%E5%BA%A6%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/541526/SpankBang%20%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5%E6%8F%90%E5%8F%96%E4%B8%8B%E8%BD%BD%E5%99%A8%EF%BC%88%E5%A4%8D%E5%88%B6%20%2B%20%E4%B8%8B%E8%BD%BD%20%2B%20%E8%BF%9B%E5%BA%A6%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const waitForStreamDataScript = () => {
        return new Promise((resolve) => {
            const check = () => {
                const scripts = Array.from(document.scripts);
                const targetScript = scripts.find(s => s.textContent.includes('var stream_data ='));
                if (targetScript) {
                    resolve(targetScript.textContent);
                } else {
                    setTimeout(check, 500);
                }
            };
            check();
        });
    };

    const extractStreamData = (scriptText) => {
        const match = scriptText.match(/var\s+stream_data\s*=\s*(\{[\s\S]*?\});/);
        if (match && match[1]) {
            try {
                return eval('(' + match[1] + ')');
            } catch (e) {
                console.error('stream_data 解析失败:', e);
                return null;
            }
        }
        return null;
    };

    const getUrlTailSegment = () => {
        const parts = location.pathname.split('/').filter(Boolean);
        return parts[parts.length - 1] || 'video';
    };

    const getFileExtension = (url) => {
        const m = url.match(/\.(mp4|m3u8|ts|webm)(\?|$)/i);
        return m ? m[1] : 'bin';
    };

    const downloadFileWithProgress = async (url, filename, button, progressBar) => {
        try {
            button.disabled = true;
            button.textContent = '下载中...';

            const response = await fetch(url);
            const contentLength = +response.headers.get('Content-Length') || 0;
            const reader = response.body.getReader();
            const chunks = [];
            let receivedLength = 0;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                chunks.push(value);
                receivedLength += value.length;

                if (contentLength) {
                    const percent = Math.floor((receivedLength / contentLength) * 100);
                    progressBar.style.width = `${percent}%`;
                    progressBar.textContent = `${percent}%`;
                }
            }

            const blob = new Blob(chunks);
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(blobUrl);
        } catch (e) {
            alert('下载失败: ' + e.message);
        } finally {
            button.disabled = false;
            button.textContent = '下载';
            progressBar.textContent = '完成';
            progressBar.style.backgroundColor = 'lightgreen';
        }
    };

    const createLinkUI = (data) => {
        const container = document.createElement('div');
        container.style.cssText = `
            background: #111;
            color: white;
            padding: 8px 12px;
            border: 1px solid lightgreen;
            margin: 20px 0;
            margin-left: 58px;
            font-size: 13px;
            width: 75%;
            border-radius: 8px;
            line-height: 1.4;
        `;
        container.innerHTML = '<h3 style="color:lightgreen; margin: 0 0 10px 0;">🎥 可用视频链接</h3>';

        const tail = getUrlTailSegment();

        Object.entries(data).forEach(([key, value]) => {
            if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string' && value[0].startsWith('http')) {
                const url = value[0];
                const ext = getFileExtension(url);
                const filename = `${tail}_${key}.${ext}`;

                const div = document.createElement('div');
                div.style.margin = '6px 0';

                const progressBar = document.createElement('div');
                progressBar.style.cssText = `
                    width: 0%;
                    height: 6px;
                    background-color: red;
                    margin-top: 4px;
                    font-size: 11px;
                    color: white;
                    text-align: center;
                `;

                div.innerHTML = `
                    <strong style="color: #0f0;">${key}</strong>:
                    <a href="${url}" target="_blank" style="color: skyblue; word-break: break-all;">${url}</a>
                    <button style="margin-left: 8px;">复制</button>
                    <button style="margin-left: 5px;">下载</button>
                `;

                const buttons = div.querySelectorAll('button');
                const copyBtn = buttons[0];
                const downloadBtn = buttons[1];

                copyBtn.addEventListener('click', () => {
                    GM_setClipboard(url);
                    alert(`已复制 ${key} 链接`);
                });

                downloadBtn.addEventListener('click', () => {
                    downloadFileWithProgress(url, filename, downloadBtn, progressBar);
                });

                div.appendChild(progressBar);
                container.appendChild(div);
            }
        });

        // ➕ 添加极速下载链接
        const fastLink = document.createElement('div');
        fastLink.style.marginTop = '12px';
        fastLink.innerHTML = `
            <span style="color: orange;">极速下载手动版：</span>
            <a href="https://dirpy.com/studio?url=${location.href}" target="_blank" style="color: lightblue;">https://dirpy.com/studio?url=当前视频链接</a>
        `;
        container.appendChild(fastLink);

        const main = document.querySelector('main.main-container') || document.body;
        if (main.children.length > 1) {
            main.insertBefore(container, main.children[1]);
        } else {
            main.insertBefore(container, main.firstChild);
        }
    };

    waitForStreamDataScript().then(scriptText => {
        const data = extractStreamData(scriptText);
        if (data) {
            createLinkUI(data);
        }
    });
})();
