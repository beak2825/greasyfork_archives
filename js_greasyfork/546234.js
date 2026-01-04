// ==UserScript==
// @name         URL定位器
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  选中文本时自动检测URL并定位到指定行和字符位置
// @author       You
// @match        https://apps-staging.razer.com/html-tools/anne-log-viewer.html
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/546234/URL%E5%AE%9A%E4%BD%8D%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/546234/URL%E5%AE%9A%E4%BD%8D%E5%99%A8.meta.js
// ==/UserScript==

//  *://*/*
(function() {
    'use strict';

    // 创建浮动窗口
    function createFloatingWindow() {
        const floatingDiv = document.createElement('div');
        floatingDiv.id = 'url-locator-window';
        floatingDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 800px;
            max-height: 80vh;
            background: #fff;
            border: 2px solid #007bff;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 14px;
            display: none;
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            background: #007bff;
            color: white;
            padding: 10px;
            border-radius: 6px 6px 0 0;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        header.innerHTML = `
            <span>URL定位器</span>
            <button id="close-locator" style="background: none; border: none; color: white; font-size: 18px; cursor: pointer;">×</button>
        `;

        const content = document.createElement('div');
        content.id = 'locator-content';
        content.style.cssText = `
            padding: 15px;
            max-height: calc(80vh - 60px);
            overflow-y: auto;
        `;

        floatingDiv.appendChild(header);
        floatingDiv.appendChild(content);
        document.body.appendChild(floatingDiv);

        // 关闭按钮事件
        document.getElementById('close-locator').addEventListener('click', () => {
            floatingDiv.style.display = 'none';
        });

        return floatingDiv;
    }

    // 解析URL和位置信息
    function parseUrlWithLocation(text) {
        // 匹配URL:行号:字符位置的模式
        const pattern = /(https?:\/\/[^\s:]+\.[^\s:]+)(?::(\d+))?(?::(\d+))?/g;
        const matches = [];
        let match;

        while ((match = pattern.exec(text)) !== null) {
            matches.push({
                url: match[1],
                line: match[2] ? parseInt(match[2]) : null,
                char: match[3] ? parseInt(match[3]) : null,
                fullMatch: match[0]
            });
        }

        return matches;
    }

    // 获取文件内容并定位
    function fetchAndLocate(urlInfo) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: urlInfo.url,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                },
                timeout: 10000, // 10秒超时
                onload: function(response) {
                    try {
                        if (response.status !== 200) {
                            resolve({
                                success: false,
                                url: urlInfo.url,
                                error: `HTTP ${response.status}: ${response.statusText}`
                            });
                            return;
                        }

                        const text = response.responseText;
                        const lines = text.split('\n');

                        let targetLine = '';
                        let targetPosition = '';
                        let context = '';

                        if (urlInfo.line && urlInfo.line <= lines.length) {
                            targetLine = lines[urlInfo.line - 1]; // 行号从1开始，数组从0开始

                            if (urlInfo.char && urlInfo.char <= targetLine.length) {
                                // 获取字符位置前后的上下文
                                const start = Math.max(0, urlInfo.char - 200);
                                const end = Math.min(targetLine.length, urlInfo.char + 200);
                                const beforeChar = targetLine.substring(start, urlInfo.char - 1);
                                const targetChar = targetLine.charAt(urlInfo.char - 1);
                                const afterChar = targetLine.substring(urlInfo.char, end);

                                // HTML转义函数
                                const escapeHtml = (text) => {
                                    return text
                                        .replace(/&/g, '&amp;')
                                        .replace(/</g, '&lt;')
                                        .replace(/>/g, '&gt;')
                                        .replace(/"/g, '&quot;')
                                        .replace(/'/g, '&#039;');
                                };

                                context = `${escapeHtml(beforeChar)}<span style="background: yellow; color: red; font-weight: bold;">${escapeHtml(targetChar)}</span>${escapeHtml(afterChar)}`;
                                targetPosition = `字符位置: ${urlInfo.char}`;
                            } else {
                                context = targetLine.length > 1000 ? targetLine.substring(0, 1000) + '...' : targetLine;
                                targetPosition = urlInfo.char ? `字符位置超出范围 (${urlInfo.char} > ${targetLine.length})` : '';
                            }
                        } else {
                            targetLine = urlInfo.line ? `行号超出范围 (${urlInfo.line} > ${lines.length})` : '未指定行号';
                        }

                        resolve({
                            success: true,
                            url: urlInfo.url,
                            line: urlInfo.line,
                            char: urlInfo.char,
                            targetLine,
                            targetPosition,
                            context,
                            totalLines: lines.length,
                            fileSize: text.length
                        });

                    } catch (error) {
                        resolve({
                            success: false,
                            url: urlInfo.url,
                            error: '解析响应时出错: ' + error.message
                        });
                    }
                },
                onerror: function(error) {
                    resolve({
                        success: false,
                        url: urlInfo.url,
                        error: '网络请求失败: ' + (error.error || '未知错误')
                    });
                },
                ontimeout: function() {
                    resolve({
                        success: false,
                        url: urlInfo.url,
                        error: '请求超时 (10秒)'
                    });
                }
            });
        });
    }

    // 更新浮动窗口内容
    async function updateFloatingWindow(urlInfos) {
        const floatingWindow = document.getElementById('url-locator-window') || createFloatingWindow();
        const content = document.getElementById('locator-content');

        content.innerHTML = '<div style="text-align: center; padding: 20px;">加载中...</div>';
        floatingWindow.style.display = 'block';

        let html = '';

        for (let i = 0; i < urlInfos.length; i++) {
            const urlInfo = urlInfos[i];
            html += `<div style="margin-bottom: 20px; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">`;
            html += `<div style="font-weight: bold; color: #007bff; margin-bottom: 8px;">URL ${i + 1}:</div>`;
            html += `<div style="word-break: break-all; margin-bottom: 5px;"><a href="${urlInfo.url}" target="_blank">${urlInfo.url}</a></div>`;

            if (urlInfo.line) html += `<div><strong>行号:</strong> ${urlInfo.line}</div>`;
            if (urlInfo.char) html += `<div><strong>字符位置:</strong> ${urlInfo.char}</div>`;

            html += `<div style="margin-top: 10px;"><strong>结果:</strong></div>`;
            html += `<div id="result-${i}" style="margin-top: 5px; padding: 8px; background: #f8f9fa; border-radius: 4px;">加载中...</div>`;
            html += `</div>`;
        }

        content.innerHTML = html;

        // 异步加载每个URL的内容
        for (let i = 0; i < urlInfos.length; i++) {
            const result = await fetchAndLocate(urlInfos[i]);
            const resultDiv = document.getElementById(`result-${i}`);

            if (result.success) {
                resultDiv.innerHTML = `
                    <div><strong>文件信息:</strong> ${result.totalLines} 行, ${result.fileSize} 字符</div>
                    ${result.line ? `<div><strong>第 ${result.line} 行内容:</strong></div>` : ''}
                    ${result.targetPosition ? `<div><strong>${result.targetPosition}</strong></div>` : ''}
                    <div style="margin-top: 8px; padding: 12px; background: white; border: 1px solid #ddd; border-radius: 4px; font-family: 'Consolas', 'Monaco', 'Courier New', monospace; font-size: 13px; max-height: 300px; overflow-y: auto; white-space: pre-wrap; word-break: break-all; line-height: 1.4;">
                        ${result.context || result.targetLine}
                    </div>
                `;
            } else {
                resultDiv.innerHTML = `<div style="color: red;"><strong>错误:</strong> ${result.error}</div>`;
            }
        }
    }

    // 监听文本选择事件
    document.addEventListener('mouseup', function(e) {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();

        if (selectedText.length > 0) {
            const urlInfos = parseUrlWithLocation(selectedText);

            if (urlInfos.length > 0) {
                updateFloatingWindow(urlInfos);
            }
        }
    });

    // 监听键盘事件，按ESC关闭窗口
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const floatingWindow = document.getElementById('url-locator-window');
            if (floatingWindow) {
                floatingWindow.style.display = 'none';
            }
        }
    });

    // 添加拖拽功能
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

    document.addEventListener('mousedown', function(e) {
        const floatingWindow = document.getElementById('url-locator-window');
        const locatorContent = document.getElementById('locator-content');

        if (floatingWindow && floatingWindow.contains(e.target) &&
            !locatorContent.contains(e.target) &&
            e.target.tagName !== 'BUTTON' &&
            e.target.tagName !== 'A') {
            isDragging = true;
            const rect = floatingWindow.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;
            floatingWindow.style.cursor = 'move';
        }
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            const floatingWindow = document.getElementById('url-locator-window');
            if (floatingWindow) {
                floatingWindow.style.left = (e.clientX - dragOffset.x) + 'px';
                floatingWindow.style.top = (e.clientY - dragOffset.y) + 'px';
                floatingWindow.style.right = 'auto';
            }
        }
    });

    document.addEventListener('mouseup', function() {
        if (isDragging) {
            isDragging = false;
            const floatingWindow = document.getElementById('url-locator-window');
            if (floatingWindow) {
                floatingWindow.style.cursor = 'default';
            }
        }
    });

})();