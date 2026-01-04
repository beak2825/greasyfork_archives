// ==UserScript==
// @name         Hugging Face 文件大小计算器
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  解析 Hugging Face 文件列表并在新窗口显示表格，通过监听浏览器请求获取数据
// @author       YB616
// @match        https://huggingface.co/*
// @match        https://hf-mirror.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542518/Hugging%20Face%20%E6%96%87%E4%BB%B6%E5%A4%A7%E5%B0%8F%E8%AE%A1%E7%AE%97%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/542518/Hugging%20Face%20%E6%96%87%E4%BB%B6%E5%A4%A7%E5%B0%8F%E8%AE%A1%E7%AE%97%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 存储收集到的文件数据
    let collectedFiles = [];
    let isLoading = false;
    let loadingDiv = null;

    // 监听页面加载完成
    window.addEventListener('load', function() {
        // 查找 main 元素
        const mainElement = document.querySelector('main');
        if (!mainElement) return;

        // 查找包含文件列表的 div
        const fileListDiv = document.querySelector('div.SVELTE_HYDRATER.contents[data-target="ViewerIndexTreeList"]');
        if (!fileListDiv) return;

        // 提取初始 JSON 数据
        const props = JSON.parse(fileListDiv.getAttribute('data-props'));
        if (!props || !props.entries) return;

        // 处理初始数据
        processEntries(props.entries);

        // 开始监听网络请求
        startNetworkMonitoring();
    });

    // 开始监听网络请求
    function startNetworkMonitoring() {
        isLoading = true;
        showLoadingMessage("正在监听文件列表加载，请滚动页面加载更多文件...");

        // 保存原始 fetch 方法
        const originalFetch = window.fetch;

        // 重写 fetch 方法以拦截请求
        window.fetch = async function(...args) {
            const response = await originalFetch.apply(this, args);

            // 检查是否是文件列表API请求
            if (typeof args[0] === 'string' && args[0].includes('/api/') && args[0].includes('/tree/')) {
                response.clone().json().then(data => {
                    if (Array.isArray(data)) {
                        processEntries(data);
                    }
                }).catch(e => console.error('解析响应失败:', e));
            }

            return response;
        };

        // 监听滚动事件，提示用户滚动加载更多
        window.addEventListener('scroll', function() {
            if (isLoading && window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
                showLoadingMessage("继续滚动以加载更多文件...");
            }
        });

        // 添加按钮手动完成加载
        addCompleteButton();
    }

    // 处理文件条目
    function processEntries(entries) {
        const newFiles = entries
            .filter(entry => entry.type === 'file')
            .map(entry => ({
                name: entry.path,
                bytes: entry.size,
                size: formatFileSize(entry.size)
            }));

        collectedFiles = [...collectedFiles, ...newFiles];
        updateLoadingMessage(`已收集 ${collectedFiles.length} 个文件，继续滚动加载更多...`);
    }

    // 添加完成加载按钮
    function addCompleteButton() {
        const button = document.createElement('button');
        button.textContent = '已完成加载，显示结果';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.padding = '10px 15px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '9999';

        button.addEventListener('click', function() {
            isLoading = false;
            if (loadingDiv) loadingDiv.remove();
            button.remove();

            // 计算总大小
            const totalBytes = collectedFiles.reduce((sum, file) => sum + file.bytes, 0);
            const totalSize = formatFileSize(totalBytes);

            // 显示结果
            showFileTable(collectedFiles, totalBytes, totalSize);
        });

        document.body.appendChild(button);
    }

    // 显示加载提示
    function showLoadingMessage(message) {
        if (loadingDiv) {
            loadingDiv.textContent = message;
            return;
        }

        loadingDiv = document.createElement('div');
        loadingDiv.style.position = 'fixed';
        loadingDiv.style.top = '20px';
        loadingDiv.style.right = '20px';
        loadingDiv.style.backgroundColor = '#fff';
        loadingDiv.style.padding = '10px';
        loadingDiv.style.border = '1px solid #ccc';
        loadingDiv.style.borderRadius = '5px';
        loadingDiv.style.zIndex = '9999';
        loadingDiv.textContent = message;
        document.body.appendChild(loadingDiv);
    }

    // 更新加载消息
    function updateLoadingMessage(message) {
        if (loadingDiv) {
            loadingDiv.textContent = message;
        }
    }

    // 格式化文件大小（B -> KB/MB/GB）
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // 在新窗口显示文件表格
    function showFileTable(files, totalBytes, totalSize) {
        // 创建新窗口
        const newWindow = window.open('', '_blank', 'width=1000,height=800');
        if (!newWindow) {
            alert('请允许弹出窗口以查看文件列表');
            return;
        }

        // 创建 HTML 内容
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Hugging Face 文件列表</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    h1 { color: #333; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    tr:nth-child(even) { background-color: #f9f9f9; }
                    .size-col { text-align: right; }
                    .total-row { font-weight: bold; background-color: #e6f7ff; }
                </style>
            </head>
            <body>
                <h1>文件列表</h1>
                <table>
                    <thead>
                        <tr>
                            <th>文件名</th>
                            <th class="size-col">大小 (字节)</th>
                            <th class="size-col">格式化大小</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${files.map(file => `
                            <tr>
                                <td>${file.name}</td>
                                <td class="size-col">${file.bytes.toLocaleString()}</td>
                                <td class="size-col">${file.size}</td>
                            </tr>
                        `).join('')}
                        <tr class="total-row">
                            <td>总计</td>
                            <td class="size-col">${totalBytes.toLocaleString()}</td>
                            <td class="size-col">${totalSize}</td>
                        </tr>
                    </tbody>
                </table>
                <p>共 ${files.length} 个文件，总大小: ${totalSize}</p>
            </body>
            </html>
        `;

        // 写入新窗口
        newWindow.document.write(html);
        newWindow.document.close();
    }
})();