// ==UserScript==
// @name         Pixverse MP4 Link Extractor
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Monitor network requests on app.pixverse.ai and extract MP4 links from specific API responses, then open them in a new tab. Only show error and success messages.
// @author       Grok 3
// @match        https://app.pixverse.ai/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529400/Pixverse%20MP4%20Link%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/529400/Pixverse%20MP4%20Link%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个调试信息显示区域
    const contentDiv = document.createElement('div');
    contentDiv.style.position = 'fixed';
    contentDiv.style.top = '10px';
    contentDiv.style.left = '10px';
    contentDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    contentDiv.style.color = 'white';
    contentDiv.style.padding = '10px';
    contentDiv.style.maxHeight = '300px';
    contentDiv.style.overflowY = 'auto';
    contentDiv.style.zIndex = '9999';
    contentDiv.style.fontSize = '14px';
    // 添加绿色小长方形图标及超链接
    contentDiv.innerHTML = `
        <div style="margin-bottom: 10px;">
            <span style="display: inline-block; width: 10px; height: 10px; background-color: green; margin-right: 5px;"></span>
            <a href="https://t.me/nians26" target="_blank" style="color: #00ccff; text-decoration: none;">作者 @nians26</a><br>
            <span style="display: inline-block; width: 10px; height: 10px;"></span>
            <a href="https://t.me/aishencheng" target="_blank" style="color: #00ccff; text-decoration: none;">交流群 @aishencheng</a>
        </div>
    `;
    document.body.appendChild(contentDiv);

    // 辅助函数：添加调试信息到页面（仅用于错误和成功信息）
    function logDebug(message) {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = `<p style="margin: 2px 0;">[${timestamp}] ${message}</p>`;
        contentDiv.innerHTML += logEntry;
        // 自动滚动到底部
        contentDiv.scrollTop = contentDiv.scrollHeight;
        console.log(`[${timestamp}] ${message}`);
    }

    // 保存原始的 XMLHttpRequest.open 方法
    const originalXHROpen = XMLHttpRequest.prototype.open;

    // 重写 XMLHttpRequest.open 方法以拦截网络请求
    XMLHttpRequest.prototype.open = function(method, url) {
        // 检查请求的 URL 是否是我们关心的 API
        if (url.includes('https://app-api.pixverse.ai/creative_platform/video/list/detail')) {
            // 添加事件监听器来捕获响应
            this.addEventListener('load', function() {
                try {
                    // 检查响应是否为空
                    if (!this.responseText) {
                        logDebug('Error: XHR response is empty.');
                        return;
                    }

                    // 解析响应数据
                    const response = JSON.parse(this.responseText);

                    // 检查是否存在 Resp 字段
                    if (!response.Resp) {
                        logDebug('Error: "Resp" field not found in XHR response.');
                        return;
                    }

                    // 检查是否存在 Resp.url 字段
                    if (!response.Resp.url) {
                        logDebug('Error: "Resp.url" field not found in XHR response.');
                        return;
                    }

                    // 检查是否是 MP4 链接
                    if (!response.Resp.url.endsWith('.mp4')) {
                        logDebug(`Error: URL "${response.Resp.url}" is not an MP4 link.`);
                        return;
                    }

                    const mp4Url = response.Resp.url;
                    logDebug(`Found MP4 URL (XHR): ${mp4Url}`);

                    // 在新标签页中打开 MP4 链接
                    window.open(mp4Url, '_blank');
                    logDebug(`Opened MP4 URL in new tab: ${mp4Url}`);
                } catch (e) {
                    logDebug(`Error parsing XHR response: ${e.message}`);
                }
            });

            // 如果请求失败，记录错误
            this.addEventListener('error', function() {
                logDebug('Error: XHR request failed.');
            });
        }

        // 调用原始的 open 方法，确保正常请求流程
        return originalXHROpen.apply(this, arguments);
    };

    // 为了支持 Fetch API 请求（如果网站使用 fetch 而不是 XMLHttpRequest）
    const originalFetch = window.fetch;
    window.fetch = async function(input, init) {
        const url = typeof input === 'string' ? input : input.url;

        // 检查请求的 URL 是否是我们关心的 API
        if (url.includes('https://app-api.pixverse.ai/creative_platform/video/list/detail')) {
            try {
                // 执行 fetch 请求
                const response = await originalFetch(input, init);
                const clonedResponse = response.clone(); // 克隆响应以避免影响原请求

                // 检查响应状态
                if (!response.ok) {
                    logDebug(`Error: Fetch request failed with status: ${response.status}`);
                    return response;
                }

                // 解析 JSON 响应
                const data = await clonedResponse.json();

                // 检查是否存在 Resp 字段
                if (!data.Resp) {
                    logDebug('Error: "Resp" field not found in fetch response.');
                    return response;
                }

                // 检查是否存在 Resp.url 字段
                if (!data.Resp.url) {
                    logDebug('Error: "Resp.url" field not found in fetch response.');
                    return response;
                }

                // 检查是否是 MP4 链接
                if (!data.Resp.url.endsWith('.mp4')) {
                    logDebug(`Error: URL "${data.Resp.url}" is not an MP4 link.`);
                    return response;
                }

                const mp4Url = data.Resp.url;
                logDebug(`Found MP4 URL (fetch): ${mp4Url}`);

                // 在新标签页中打开 MP4 链接
                window.open(mp4Url, '_blank');
                logDebug(`Opened MP4 URL in new tab: ${mp4Url}`);

                return response; // 返回原始响应
            } catch (e) {
                logDebug(`Error processing fetch request: ${e.message}`);
                // 如果解析失败，仍然返回原始响应以避免影响页面
                return originalFetch(input, init);
            }
        }

        // 如果不是目标 API，则直接调用原始 fetch 方法
        return originalFetch(input, init);
    };
})();