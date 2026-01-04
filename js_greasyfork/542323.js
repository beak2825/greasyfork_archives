// ==UserScript==
// @name         绿站工作区助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  绿站工作区自动重试，以及批量下载
// @author       zonde306
// @match        https://books.fishhawk.top/*
// @match        https://books1.fishhawk.top/*
// @match        https://n.novelia.cc/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fishhawk.top
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/542323/%E7%BB%BF%E7%AB%99%E5%B7%A5%E4%BD%9C%E5%8C%BA%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/542323/%E7%BB%BF%E7%AB%99%E5%B7%A5%E4%BD%9C%E5%8C%BA%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (location.href.includes("/workspace/")) {
        window.setInterval(() => {
            let button = document.evaluate("//*[contains(text(),'重试未完成任务')]", document.body).iterateNext();
            if (button) {
                button.click();
                let iterator = document.evaluate("//*[contains(text(),'启动')]", document.body);
                while ((button = iterator.iterateNext()) != null) {
                    button.click();
                }
            }
        }, 10000);
    }

    if (location.href.includes("/novel/")) {
        var novel_inv_id = 0;
        var hiddenProperty = 'hidden' in document ? 'hidden' : 'webkitHidden' in document ? 'webkitHidden' : 'mozHidden' in document ? 'mozHidden' : null;
        novel_inv_id = window.setInterval(() => {
            const a = document.evaluate("//*[contains(text(),'下载机翻')]/..", document.body).iterateNext();
            if (a) {
                const title = document.evaluate('//h3/span', document.body).iterateNext()?.innerText;
                if (title) {
                    const novelId = window.location.href.split("/novel/", 2)[1];
                    localStorage.setItem(novelId, title);
                }
                window.clearInterval(novel_inv_id);
                console.log(`${window.location.href} download is ${a.href} current hidden is ${document[hiddenProperty]}`);
                if (document[hiddenProperty] && document.referrer && (document.referrer.includes("/favorite/") || document.referrer.includes("/workspace/sakura"))) {
                    const total_bar = document.evaluate("//*[contains(text(),'总计')][contains(text(),'Sakura')]", document.body).iterateNext();
                    if (total_bar) {
                        const total = parseInt(total_bar.innerText.match(/总计\s*(\d+)/)[1]);
                        const sakura = parseInt(total_bar.innerText.match(/Sakura\s*(\d+)/i)[1]);
                        const baidu = parseInt(total_bar.innerText.match(/百度\s*(\d+)/)[1]);
                        const youdao = parseInt(total_bar.innerText.match(/有道\s*(\d+)/)[1]);
                        const gpt = parseInt(total_bar.innerText.match(/GPT\s*(\d+)/i)[1]);
                        if (total > 0 && sakura >= total && sakura >= baidu && sakura >= youdao && sakura >= gpt) {
                            a.click();
                        }
                    }
                }
            }
        }, 4000);

        var downloader = window.setInterval(() => {
            let fail = document.evaluate("//div[contains(text(),'加载错误')]", document.body).iterateNext() ||
                document.evaluate("//*[contains(text(),'Bad gateway')]", document.body).iterateNext() ||
                document.evaluate("//*[contains(text(),'Tunnel error')]", document.body).iterateNext() ||
                document.evaluate("//*[contains(text(),'Argo Tunnel')]", document.body).iterateNext();
            if (fail) {
                // location.reload();
                window.clearInterval(downloader);
                const [site, novelId] = window.location.href.split("/novel/", 2);
                const title = localStorage.getItem(novelId);
                if (title) {
                    window.location.href = `${site}/api/novel/${novelId}/file?mode=zh&translationsMode=priority&type=epub&filename=${title}.epub&translations=sakura&translations=gpt&translations=youdao&translations=baidu`;
                }
            }
        }, 15000);
    }

    (function(){
        'use strict';
        // CSS 样式字符串
        const css = `
            /* 悬浮按钮 */
            #download-fab {
                position: fixed; /* 固定定位，使其在滚动时保持在视图内 */
                bottom: 20px;
                right: 20px;
                width: 60px;
                height: 60px;
                background-color: #007bff;
                color: white;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 2em;
                cursor: pointer;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                z-index: 99999; /* 确保在绝大多数内容之上 */
                transition: background-color 0.3s;
                font-family: Arial, sans-serif;
            }

            #download-fab:hover {
                background-color: #0056b3;
            }

            /* 下载列表容器 */
            #download-list-container {
                position: fixed;
                bottom: 90px; /* 避免和悬浮按钮重叠 */
                right: 20px;
                width: 350px;
                max-height: 500px;
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
                z-index: 99998; /* 比按钮低一点 */
                display: flex;
                flex-direction: column;
                overflow: hidden; /* 隐藏内容溢出，内部滚动 */
                transition: all 0.3s ease-in-out;
                font-family: Arial, sans-serif;
            }

            #download-list-container.hidden {
                opacity: 0;
                transform: translateY(20px);
                pointer-events: none; /* 隐藏时禁用事件 */
            }

            #download-list-container .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 15px;
                border-bottom: 1px solid #eee;
                background-color: #f8f9fa;
            }

            #download-list-container .header h3 {
                margin: 0;
                font-size: 1.1em;
            }

            #download-list-container .close-btn {
                font-size: 1.5em;
                cursor: pointer;
                color: #888;
            }

            #download-list-container .close-btn:hover {
                color: #333;
            }

            #download-list-container .batch-actions,
            #download-list-container .footer {
                padding: 10px 15px;
                display: flex;
                gap: 10px;
                border-top: 1px solid #eee;
                background-color: #f8f9fa;
            }

            #download-list-container .batch-actions button,
            #download-list-container .footer button {
                padding: 8px 12px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.9em;
                flex-grow: 1;
                white-space: nowrap; /* 防止按钮文本换行 */
            }

            #batch-download-new-btn { /* 新增的批量下载按钮样式 */
                background-color: #28a745; /* 绿色 */
                color: white;
            }
            #batch-download-new-btn:hover {
                background-color: #218838;
            }

            #pause-all-btn, #batch-pause-selected-btn {
                background-color: #ffc107;
                color: #333;
            }
            #pause-all-btn:hover, #batch-pause-selected-btn:hover {
                background-color: #e0a800;
            }

            #cancel-all-btn, #batch-cancel-selected-btn {
                background-color: #dc3545;
                color: white;
            }
            #cancel-all-btn:hover, #batch-cancel-selected-btn:hover {
                background-color: #c82333;
            }

            #delete-all-btn, #batch-delete-selected-btn {
                background-color: #6c757d;
                color: white;
            }
            #delete-all-btn:hover, #batch-delete-selected-btn:hover {
                background-color: #5a6268;
            }


            /* 下载项列表 */
            #download-items-list {
                list-style: none;
                margin: 0;
                padding: 0;
                overflow-y: auto; /* 列表内容溢出时滚动 */
                flex-grow: 1; /* 占据可用空间 */
            }

            .download-item {
                display: flex;
                flex-wrap: wrap; /* 允许换行 */
                align-items: center;
                padding: 10px 15px;
                border-bottom: 1px solid #eee;
                background-color: white;
                transition: background-color 0.2s;
                user-select: none; /* 防止拖拽时选中文字 */
            }

            .download-item:last-child {
                border-bottom: none;
            }

            .download-item.dragging {
                opacity: 0.5;
                border: 2px dashed #007bff;
            }

            /* 拖拽位置指示 */
            .download-item.drag-before {
                border-top: 2px solid #007bff;
            }
            .download-item.drag-after {
                border-bottom: 2px solid #007bff;
            }


            .download-item:hover {
                background-color: #f9f9f9;
            }

            .download-item .item-info {
                display: flex;
                align-items: center;
                flex: 1; /* 占据大部分空间 */
                margin-right: 10px;
            }

            .download-item .select-item-checkbox {
                margin-right: 8px;
            }

            .download-item .file-name {
                flex-grow: 1;
                // white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .download-item .progress-bar-container {
                width: 100%; /* 进度条占据整行 */
                height: 8px;
                background-color: #e9ecef;
                border-radius: 4px;
                margin-top: 5px;
                overflow: hidden;
            }

            .download-item .progress-bar {
                height: 100%;
                background-color: #28a745;
                width: 0%; /* 初始宽度 */
                border-radius: 4px;
                transition: width 0.3s ease;
            }
            /* 排队中项目的进度条颜色 */
            .download-item.status-queued .progress-bar {
                background-color: #ced4da; /* 浅灰色 */
            }


            .download-item .download-status {
                width: 100%;
                font-size: 0.85em;
                color: #666;
                margin-top: 5px;
                margin-bottom: 5px;
            }

            .download-item .item-actions {
                display: flex;
                gap: 5px;
                margin-top: 5px;
                width: 100%; /* 按钮占据整行 */
                justify-content: flex-end; /* 按钮靠右 */
            }

            .download-item .item-actions button {
                padding: 5px 10px;
                font-size: 0.8em;
                border: 1px solid #ccc;
                border-radius: 4px;
                cursor: pointer;
                background-color: #f8f9fa;
                transition: background-color 0.2s;
            }

            .download-item .item-actions button:hover {
                background-color: #e2e6ea;
            }

            .download-item .item-actions .pause-btn {
                background-color: #ffc107;
                color: #333;
            }
            .download-item .item-actions .pause-btn:hover {
                background-color: #e0a800;
            }
            .download-item .item-actions .resume-btn,
            .download-item .item-actions .start-btn { /* 添加开始按钮样式 */
                background-color: #007bff; /* 蓝色 */
                color: white;
            }
            .download-item .item-actions .resume-btn:hover,
            .download-item .item-actions .start-btn:hover {
                background-color: #0056b3;
            }

            .download-item .item-actions .cancel-btn {
                background-color: #dc3545;
                color: white;
            }
            .download-item .item-actions .cancel-btn:hover {
                background-color: #c82333;
            }

            .download-item .item-actions .delete-btn {
                background-color: #f44336;
                color: white;
            }
            .download-item .item-actions .delete-btn:hover {
                background-color: #da190b;
            }
            .download-item .item-actions .completed-btn,
            .download-item .item-actions .cancelled-btn {
                background-color: #f8f9fa; /* 更柔和的背景 */
                color: #666;
                cursor: default; /* 不可点击 */
                opacity: 0.7;
                border: 1px solid #eee;
            }
            .download-item .item-actions .retry-btn {
                background-color: #17a2b8; /* 信息蓝 */
                color: white;
                cursor: pointer;
            }
            .download-item .item-actions .retry-btn:hover {
                background-color: #138496;
            }

            /* 获取链接按钮样式 */
            .download-item .item-actions .get-link-btn {
                background-color: #6f42c1; /* 紫色 */
                color: white;
            }
            .download-item .item-actions .get-link-btn:hover {
                background-color: #5d34a4;
            }
        `;

        // HTML 结构字符串
        const html = `
            <!-- 悬浮按钮 -->
            <div id="download-fab" class="download-fab">
                <span class="icon">⬇️</span>
            </div>

            <!-- 下载列表容器 -->
            <div id="download-list-container" class="download-list-container hidden">
                <div class="header">
                    <h3>下载列表</h3>
                    <span class="close-btn">×</span>
                </div>
                <div class="batch-actions">
                    <button id="batch-download-new-btn">批量下载</button> <!-- 新增的批量下载按钮 -->
                    <button id="pause-all-btn">全部暂停</button>
                    <button id="cancel-all-btn">全部取消</button>
                    <button id="delete-all-btn">全部删除</button>
                </div>
                <ul id="download-items-list" class="download-items-list">
                    <!-- 下载项将通过 JavaScript 动态添加 -->
                </ul>
                <div class="footer">
                    <button id="batch-delete-selected-btn">删除选中</button>
                    <button id="batch-pause-selected-btn">暂停选中</button>
                    <button id="batch-cancel-selected-btn">取消选中</button>
                </div>
            </div>
        `;

        // 注入 CSS 样式
        const styleElement = document.createElement('style');
        styleElement.textContent = css;
        document.head.appendChild(styleElement);

        // 注入 HTML 结构
        const container = document.createElement('div');
        container.innerHTML = html;
        document.body.appendChild(container);

        // 获取 DOM 元素的引用
        const fabButton = document.getElementById('download-fab');
        const downloadListContainer = document.getElementById('download-list-container');
        const closeBtn = downloadListContainer.querySelector('.close-btn');
        const downloadItemsList = document.getElementById('download-items-list');

        // 新增批量下载按钮的引用
        const batchDownloadNewBtn = document.getElementById('batch-download-new-btn');

        const pauseAllBtn = document.getElementById('pause-all-btn');
        const cancelAllBtn = document.getElementById('cancel-all-btn');
        const deleteAllBtn = document.getElementById('delete-all-btn');

        const batchDeleteSelectedBtn = document.getElementById('batch-delete-selected-btn');
        const batchPauseSelectedBtn = document.getElementById('batch-pause-selected-btn');
        const batchCancelSelectedBtn = document.getElementById('batch-cancel-selected-btn');

        // 模拟下载数据存储
        // status: 'downloading', 'paused', 'cancelled', 'completed', 'failed', 'queued'
        // 初始为空数组，等待通过 API 添加任务
        let downloads = [];

        let draggedItem = null; // 用于拖拽排序

        // 存储每个下载任务的 ReadableStreamDefaultReader 引用，用于取消下载
        const activeReaders = {};
        // 存储每个下载任务的 WritableStream 引用，用于关闭文件写入
        const activeWriters = {};

        // 并发控制
        let activeDownloadWorkers = 0;
        const MAX_CONCURRENT_DOWNLOADS = 3; // 同时进行的下载任务数量上限

        // 用于存储用户选择的目录句柄
        let globalFileSystemPicker = null;

        // ---------------------- 辅助函数：复制到剪贴板 ----------------------
        async function copyToClipboard(text) {
            if (typeof GM_setClipboard !== 'undefined') {
                // 使用 Tampermonkey API
                GM_setClipboard(text);
                console.log('Text copied to clipboard using GM_setClipboard.');
                return true;
            } else if (navigator.clipboard && navigator.clipboard.writeText) {
                // 使用现代 Clipboard API
                try {
                    await navigator.clipboard.writeText(text);
                    console.log('Text copied to clipboard using Clipboard API.');
                    return true;
                } catch (err) {
                    console.error('Failed to copy text using Clipboard API: ', err);
                    return false;
                }
            } else {
                // 回退方案：创建一个 textarea 元素来复制
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed'; // 防止滚动
                textarea.style.top = '0';
                textarea.style.left = '0';
                textarea.style.width = '2em';
                textarea.style.height = '2em';
                textarea.style.padding = '0';
                textarea.style.border = 'none';
                textarea.style.outline = 'none';
                textarea.style.boxShadow = 'none';
                textarea.style.background = 'transparent';
                document.body.appendChild(textarea);
                textarea.focus();
                textarea.select();
                try {
                    const successful = document.execCommand('copy');
                    console.log('Text copied to clipboard using execCommand: ', successful);
                    document.body.removeChild(textarea);
                    return successful;
                } catch (err) {
                    console.error('Failed to copy text using execCommand: ', err);
                    document.body.removeChild(textarea);
                    return false;
                }
            }
        }

        // ---------------------- 核心渲染函数 ----------------------
        function renderDownloadList() {
            downloadItemsList.innerHTML = ''; // 清空现有列表
            if (downloads.length === 0) {
                downloadItemsList.innerHTML = '<li class="empty-list" style="text-align: center; padding: 20px; color: #888;">暂无下载任务</li>';
                return;
            }

            downloads.forEach(download => {
                const listItem = document.createElement('li');
                listItem.className = 'download-item';
                listItem.dataset.id = download.id;
                listItem.setAttribute('draggable', 'true'); // 允许拖拽

                let statusText = '';
                let actionButtonsHtml = ''; // 使用一个变量来构建所有操作按钮的HTML

                switch (download.status) {
                    case 'downloading':
                        statusText = `下载中 (${download.progress}%)`;
                        actionButtonsHtml = `
                            <button class="pause-btn" data-action="pause">暂停</button>
                            <button class="cancel-btn" data-action="cancel">取消</button>
                        `;
                        break;
                    case 'paused':
                        statusText = `已暂停 (${download.progress}%)`;
                        actionButtonsHtml = `
                            <button class="resume-btn" data-action="resume">继续</button>
                            <button class="cancel-btn" data-action="cancel">取消</button>
                        `;
                        break;
                    case 'completed':
                        statusText = '已完成';
                        actionButtonsHtml = `
                            <button class="completed-btn">完成</button>
                        `;
                        break;
                    case 'cancelled':
                        statusText = '已取消';
                        actionButtonsHtml = `
                            <button class="cancelled-btn">取消</button>
                        `;
                        break;
                    case 'failed':
                        statusText = '下载失败';
                        actionButtonsHtml = `
                            <button class="retry-btn" data-action="retry">重试</button>
                        `;
                        break;
                    case 'queued': // 新增排队中状态的逻辑
                        statusText = '排队中';
                        actionButtonsHtml = `
                            <button class="start-btn" data-action="start">开始</button>
                            <button class="cancel-btn" data-action="cancel">取消</button>
                        `;
                        listItem.classList.add('status-queued'); // 添加特定类以便CSS样式
                        break;
                }

                // 构建下载项的内部HTML
                listItem.innerHTML = `
                    <div class="item-info">
                        <input type="checkbox" class="select-item-checkbox" data-id="${download.id}">
                        <span class="file-name">${download.name}</span>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: ${download.progress}%;"></div>
                    </div>
                    <div class="download-status">${statusText}</div>
                    <div class="item-actions">
                        ${actionButtonsHtml}
                        <button class="get-link-btn" data-action="getLink">获取链接</button> <!-- 新增获取链接按钮 -->
                        <button class="delete-btn" data-action="delete">删除</button>
                    </div>
                `;
                downloadItemsList.appendChild(listItem);
            });

            addEventListenersToItems(); // 重新绑定事件监听器
        }

        // ---------------------- 事件绑定函数 ----------------------
        function addEventListenersToItems() {
            // 单个操作按钮
            downloadItemsList.querySelectorAll('.item-actions button').forEach(button => {
                button.onclick = (e) => {
                    const itemId = e.target.closest('.download-item').dataset.id;
                    const action = e.target.dataset.action;
                    if (action) { // 确保有 data-action 属性的按钮才响应
                        handleSingleAction(itemId, action);
                    }
                };
            });

            // 复选框事件
            downloadItemsList.querySelectorAll('.select-item-checkbox').forEach(checkbox => {
                checkbox.onchange = () => {
                    // 当复选框状态改变时，这里不直接更新批量操作按钮状态，只是记录选中项
                    // 可以在这里根据需要添加 UI 反馈，例如改变批量按钮的禁用状态
                };
            });

            // 拖拽事件监听器
            downloadItemsList.querySelectorAll('.download-item').forEach(item => {
                item.addEventListener('dragstart', (e) => {
                    draggedItem = e.target;
                    e.target.classList.add('dragging');
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('text/plain', e.target.dataset.id); // 兼容性
                });

                item.addEventListener('dragover', (e) => {
                    e.preventDefault(); // 允许放置
                    const target = e.target.closest('.download-item');
                    if (target && target !== draggedItem) {
                        // 移除所有item的拖拽指示类，防止残留
                        downloadItemsList.querySelectorAll('.download-item').forEach(li => {
                            li.classList.remove('drag-before', 'drag-after');
                        });

                        const bounding = target.getBoundingClientRect();
                        const offset = bounding.y + (bounding.height / 2);
                        if (e.clientY < offset) {
                            target.classList.add('drag-before');
                        } else {
                            target.classList.add('drag-after');
                        }
                    }
                });

                item.addEventListener('dragleave', (e) => {
                    // drageleave在离开子元素时也会触发，所以要判断是否真正离开了父元素
                    // 这里简化处理，直接移除，drop时会再次判断
                });

                item.addEventListener('drop', (e) => {
                    e.preventDefault();
                    const target = e.target.closest('.download-item');
                    if (target && draggedItem && target !== draggedItem) {
                        const dragId = draggedItem.dataset.id;
                        const dropId = target.dataset.id;

                        const dragIndex = downloads.findIndex(d => d.id === dragId);
                        const dropIndex = downloads.findIndex(d => d.id === dropId);

                        if (dragIndex > -1 && dropIndex > -1) {
                            const [removed] = downloads.splice(dragIndex, 1);
                            let insertIndex = dropIndex;
                            if (target.classList.contains('drag-after') && dragIndex < dropIndex) {
                                insertIndex = dropIndex;
                            } else if (target.classList.contains('drag-after') && dragIndex > dropIndex) {
                                insertIndex = dropIndex + 1;
                            } else if (target.classList.contains('drag-before') && dragIndex < dropIndex) {
                                insertIndex = dropIndex -1;
                            } else if (target.classList.contains('drag-before') && dragIndex > dropIndex) {
                                insertIndex = dropIndex;
                            } else {
                                insertIndex = dropIndex + (dragIndex < dropIndex ? 0 : 1);
                            }

                            // 修正插入索引，防止越界
                            if (insertIndex < 0) insertIndex = 0;
                            if (insertIndex > downloads.length) insertIndex = downloads.length;

                            downloads.splice(insertIndex, 0, removed);
                            renderDownloadList(); // 重新渲染列表以反映新顺序
                        }
                    }
                    // 清理拖拽状态
                    if (draggedItem) {
                        draggedItem.classList.remove('dragging');
                    }
                    downloadItemsList.querySelectorAll('.download-item').forEach(li => {
                        li.classList.remove('drag-before', 'drag-after');
                    });
                    draggedItem = null;
                });

                item.addEventListener('dragend', () => {
                    // 拖拽结束时，无论成功与否都清除状态
                    if (draggedItem) {
                        draggedItem.classList.remove('dragging');
                    }
                    downloadItemsList.querySelectorAll('.download-item').forEach(li => {
                        li.classList.remove('drag-before', 'drag-after');
                    });
                    draggedItem = null;
                });
            });
        }

        // ---------------------- 单个操作处理 ----------------------
        async function handleSingleAction(id, action) { // 将函数声明为 async
            // 直接调用 updateDownloadTask 来处理
            const downloadItem = downloads.find(d => d.id === id);
            if (!downloadItem) return;

            switch (action) {
                case 'pause':
                    updateDownloadTask(id, 'paused', downloadItem.progress);
                    break;
                case 'resume':
                    updateDownloadTask(id, 'downloading', downloadItem.progress);
                    break;
                case 'cancel':
                    if (confirm(`确定要取消 ${downloadItem.name} 吗？`)) {
                        updateDownloadTask(id, 'cancelled', 0);
                    }
                    break;
                case 'delete':
                    if (confirm(`确定要删除 ${downloadItem.name} 吗？`)) {
                        // 对于删除，直接从数组中移除
                        downloads = downloads.filter(d => d.id !== id);
                        // 确保取消正在进行的下载和写入操作
                        if (activeReaders[id]) {
                            try { activeReaders[id].cancel(); } catch (e) { console.error("Error cancelling reader:", e); }
                            delete activeReaders[id];
                        }
                        if (activeWriters[id]) {
                            try { activeWriters[id].abort(); activeWriters[id].close(); } catch (e) { console.error("Error aborting writer:", e); } // Abort and close
                            delete activeWriters[id];
                        }
                        renderDownloadList();
                    }
                    break;
                case 'retry':
                    updateDownloadTask(id, 'downloading', 0); // 重试时从0开始
                    break;
                case 'start': // 从排队中开始下载
                    updateDownloadTask(id, 'downloading', 0); // 从0开始
                    break;
                case 'getLink': // 新增获取链接操作
                    if (downloadItem.url) {
                        const success = await copyToClipboard(downloadItem.url);
                        if (success) {
                            alert('下载链接已复制到剪贴板！');
                        } else {
                            alert('无法自动复制链接到剪贴板。请手动复制：\n' + downloadItem.url);
                        }
                    } else {
                        alert('该任务没有可用的下载链接。');
                    }
                    break;
            }
        }

        // ---------------------- 真实下载工作器 ----------------------
        async function runDownloadWorker(task) {
            if (!task || (task.status !== 'downloading' && task.status !== 'queued' && task.status !== 'failed')) {
                return; // 任务状态不正确或已处理
            }
            if (!task.url || !task.fileSystemHandle) {
                console.error(`Task ${task.id} (${task.name}) missing URL or fileSystemHandle.`);
                updateDownloadTask(task.id, 'failed', task.progress);
                return;
            }

            activeDownloadWorkers++;
            console.log(`Worker starting for task ${task.id} (${task.name}). Active workers: ${activeDownloadWorkers}`);

            // 确保状态是 downloading
            updateDownloadTask(task.id, 'downloading', task.progress);

            let buffer = new Uint8Array();
            let downloadSuccess = false;
            let currentProgress = task.progress; // 恢复进度

            // 下载文件，最多重试9次
            for (let i = 0; i < 9; ++i) {
                let response = null;
                try {
                    // 检查任务是否被取消或暂停
                    const latestTaskState = getDownloadStatus(task.id);
                    if (latestTaskState.status === 'paused' || latestTaskState.status === 'cancelled') {
                        console.log(`Download for ${task.name} was paused/cancelled during fetch setup.`);
                        downloadSuccess = false; // 标记为未成功下载
                        break;
                    }

                    response = await fetch(task.url);
                    if (response.ok) {
                        const contentLength = response.headers.get('content-length');
                        const totalLength = contentLength ? parseInt(contentLength, 10) : 0;

                        const reader = response.body.getReader();
                        activeReaders[task.id] = reader; // 存储 reader 引用以便取消
                        let receivedLength = 0;
                        let chunks = [];

                        while (true) {
                            const { value, done } = await reader.read();

                            // 再次检查任务是否被取消或暂停
                            const currentState = getDownloadStatus(task.id);
                            if (currentState.status === 'paused' || currentState.status === 'cancelled') {
                                reader.cancel('Task paused/cancelled'); // 尝试取消 fetch
                                break;
                            }

                            if (value) {
                                chunks.push(value);
                                receivedLength += value.length;
                                currentProgress = totalLength > 0 ? Math.floor((receivedLength / totalLength) * 100) : 0;
                                // 实时更新UI进度，不改变状态
                                const listItemElement = downloadItemsList.querySelector(`[data-id="${task.id}"]`);
                                if (listItemElement) {
                                    const progressBar = listItemElement.querySelector('.progress-bar');
                                    const statusTextElem = listItemElement.querySelector('.download-status');
                                    if (progressBar) progressBar.style.width = `${currentProgress}%`;
                                    if (statusTextElem) {
                                        statusTextElem.textContent = `下载中 (${currentProgress}%)`;
                                    }
                                }
                            }

                            if (done) {
                                downloadSuccess = true;
                                break;
                            }
                        }

                        delete activeReaders[task.id]; // 移除 reader 引用

                        if (downloadSuccess) {
                            // 合并所有chunks到最终的buffer
                            buffer = new Uint8Array(receivedLength);
                            let offset = 0;
                            for (let chunk of chunks) {
                                buffer.set(chunk, offset);
                                offset += chunk.length;
                            }
                            console.log(`Worker for ${task.name} downloaded ${buffer.byteLength} bytes.`);
                            break; // 下载成功，退出重试循环
                        } else {
                            // 如果是暂停/取消导致的退出，不认为是失败，退出重试循环
                            if (getDownloadStatus(task.id).status === 'paused' || getDownloadStatus(task.id).status === 'cancelled') {
                                return;
                            }
                        }
                    } else {
                        console.error(`Worker for ${task.name} download failed (status: ${response.status}). Retrying...`);
                        updateDownloadTask(task.id, 'failed', currentProgress); // 暂时标记为失败，如果重试成功会覆盖
                    }
                } catch (e) {
                    // 如果是用户主动取消 (reader.cancel())，e.name 会是 AbortError
                    if (e.name === 'AbortError') {
                        console.log(`Download for ${task.name} aborted.`);
                        downloadSuccess = false; // 不算成功也不算失败，只是终止
                        break;
                    }
                    console.error(`Worker for ${task.name} download error:`, e, `. Retrying...`);
                    updateDownloadTask(task.id, 'failed', currentProgress); // 暂时标记为失败
                }
                if (!downloadSuccess) {
                    await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // 指数退避重试
                }
            }

            if (!downloadSuccess) {
                updateDownloadTask(task.id, getDownloadStatus(task.id).status === 'paused' ? 'paused' : 'failed', currentProgress); // 确保状态正确
                activeDownloadWorkers--;
                console.log(`Worker finished (failed/aborted) for task ${task.id} (${task.name}). Active workers: ${activeDownloadWorkers}`);
                return;
            }

            // 保存文件，最多重试3次
            let saveSuccess = false;
            for (let i = 0; i < 3; ++i) {
                try {
                    // 检查任务是否被取消或暂停
                    const latestTaskState = getDownloadStatus(task.id);
                    if (latestTaskState.status === 'paused' || latestTaskState.status === 'cancelled') {
                        console.log(`Download for ${task.name} was paused/cancelled before saving.`);
                        saveSuccess = false;
                        break;
                    }

                    const hdl = await task.fileSystemHandle.getFileHandle(`${task.name}.epub`, { create: true });
                    const writer = await hdl.createWritable();
                    activeWriters[task.id] = writer; // 存储 writer 引用以便取消
                    await writer.write(buffer);
                    await writer.close();
                    saveSuccess = true;
                    delete activeWriters[task.id]; // 移除 writer 引用
                    break;
                } catch (e) {
                    console.error(`Worker for ${task.name} save error:`, e);
                    // 如果是用户主动取消 (writer.abort())，e.name 可能是 AbortError
                    if (e.name === 'AbortError') {
                        console.log(`Save for ${task.name} aborted.`);
                        saveSuccess = false;
                        break;
                    }
                }
                if (!saveSuccess) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }

            if (saveSuccess) {
                updateDownloadTask(task.id, 'completed', 100);
            } else {
                updateDownloadTask(task.id, getDownloadStatus(task.id).status === 'paused' ? 'paused' : 'failed', currentProgress);
            }

            activeDownloadWorkers--;
            console.log(`Worker finished for task ${task.id} (${task.name}). Active workers: ${activeDownloadWorkers}`);
        }

        // ---------------------- 下载任务管理器循环 ----------------------
        // 持续检查是否有需要开始或恢复的下载任务
        async function downloadManagerLoop() {
            while (true) {
                if (activeDownloadWorkers < MAX_CONCURRENT_DOWNLOADS) {
                    // 查找处于 'queued' 或 'failed' 状态的任务，且尚未被其他 worker 处理
                    const nextTask = downloads.find(d =>
                        (d.status === 'queued' || d.status === 'failed') && d.fileSystemHandle // 确保有文件句柄才能下载
                    );

                    if (nextTask) {
                        // 启动一个异步下载任务，不阻塞主循环
                        // runDownloadWorker 内部会管理 activeDownloadWorkers 并更新状态
                        runDownloadWorker(nextTask);
                    }
                }
                await new Promise(resolve => setTimeout(resolve, 1000)); // 每1秒检查一次
            }
        }
        // 启动下载管理器循环
        downloadManagerLoop();

        // ---------------------- API 函数 ----------------------

        /**
         * 添加一个新的下载任务。
         * @param {string} name 文件名称。
         * @param {string} url 文件下载URL。
         * @param {FileSystemDirectoryHandle} fileSystemHandle 保存文件的目录句柄。
         * @param {string} [initialStatus='queued'] 初始状态 ('downloading', 'paused', 'cancelled', 'completed', 'failed', 'queued')。
         * @param {number} [initialProgress=0] 初始进度 (0-100)。
         * @param {object} [data={}] 初始进度 (0-100)。
         * @returns {string} 新任务的ID。
         */
        function addDownloadTask(name, url, fileSystemHandle, initialStatus = 'queued', initialProgress = 0) {
            if(downloads.findIndex(x => x.url === url && x.status !== 'failed' && x.status !== 'cancelled') !== -1) {
                console.warn(`Download task with URL ${url} already exists.`);
                return null;
            }

            const newId = 'file_' + Date.now().toString() + Math.random().toString(36).substring(2, 9);
            const newTask = {
                id: newId,
                name: name,
                url: url,
                fileSystemHandle: fileSystemHandle, // 保存句柄
                progress: Math.max(0, Math.min(100, initialProgress)), // 确保进度在0-100之间
                status: initialStatus
            };
            downloads.push(newTask);
            renderDownloadList(); // 渲染列表以显示新任务
            return newId;
        }

        /**
         * 更新指定ID的下载任务的状态和/或进度。
         * @param {string} id 任务ID。
         * @param {string} [newStatus] 新的状态 ('downloading', 'paused', 'cancelled', 'completed', 'failed', 'queued')。
         * @param {number} [newProgress] 新的进度 (0-100)。
         */
        function updateDownloadTask(id, newStatus, newProgress) {
            const downloadIndex = downloads.findIndex(d => d.id === id);
            if (downloadIndex === -1) {
                console.warn(`Download task with ID ${id} not found.`);
                return;
            }

            const downloadItem = downloads[downloadIndex];
            const oldStatus = downloadItem.status;

            if (newStatus !== undefined) {
                downloadItem.status = newStatus;
            }
            if (newProgress !== undefined) {
                downloadItem.progress = Math.max(0, Math.min(100, newProgress));
            }

            // 处理状态转换时的取消操作
            if (newStatus === 'paused' || newStatus === 'cancelled') {
                if (activeReaders[id]) {
                    try { activeReaders[id].cancel(); } catch (e) { console.error("Error cancelling reader:", e); }
                    delete activeReaders[id];
                }
                if (activeWriters[id]) {
                    try { activeWriters[id].abort(); activeWriters[id].close(); } catch (e) { console.error("Error aborting writer:", e); }
                    delete activeWriters[id];
                }
            }

            // 立即更新UI，防止在 worker 循环中重新渲染整个列表
            const listItemElement = downloadItemsList.querySelector(`[data-id="${id}"]`);
            if (listItemElement) {
                const progressBar = listItemElement.querySelector('.progress-bar');
                const statusTextElem = listItemElement.querySelector('.download-status');
                if (progressBar) progressBar.style.width = `${downloadItem.progress}%`;
                if (statusTextElem) {
                    let text = '';
                    switch (downloadItem.status) {
                        case 'downloading': text = `下载中 (${downloadItem.progress}%)`; break;
                        case 'paused': text = `已暂停 (${downloadItem.progress}%)`; break;
                        case 'completed': text = '已完成'; break;
                        case 'cancelled': text = '已取消'; break;
                        case 'failed': text = '下载失败'; break;
                        case 'queued': text = '排队中'; break;
                    }
                    statusTextElem.textContent = text;
                }
                // 重新渲染按钮和类（如果状态变化导致按钮组变化）
                if (oldStatus !== newStatus) {
                    renderDownloadList(); // 状态变化时重新渲染整个列表，确保按钮和类正确
                }
            } else {
                // 如果元素不在DOM中（可能是新添加的任务），则完全重新渲染
                renderDownloadList();
            }
        }

        /**
         * 获取指定ID的下载任务的详细信息。
         * @param {string} id 任务ID。
         * @returns {object|null} 任务对象（副本），如果未找到则返回null。
         */
        function getDownloadStatus(id) {
            const downloadItem = downloads.find(d => d.id === id);
            return downloadItem ? { ...downloadItem } : null; // 返回副本，防止外部直接修改内部数据
        }

        /**
         * 获取所有指定状态的下载任务列表。
         * @param {string} status 要查询的状态 ('downloading', 'paused', 'cancelled', 'completed', 'failed', 'queued')。
         * @returns {Array<object>} 符合条件的任务对象数组（副本）。
         */
        function getDownloadsByStatus(status) {
            return downloads.filter(d => d.status === status).map(d => ({ ...d })); // 返回副本数组
        }

        // 将API暴露到全局window对象
        window.myDownloadManager = {
            addDownload: addDownloadTask,
            updateDownload: updateDownloadTask,
            getDownloadStatus: getDownloadStatus,
            getDownloadsByStatus: getDownloadsByStatus,
        };

        // ---------------------- 批量操作处理 ----------------------
        function getSelectedDownloadIds() {
            const selectedIds = [];
            downloadListContainer.querySelectorAll('.select-item-checkbox:checked').forEach(checkbox => {
                selectedIds.push(checkbox.dataset.id);
            });
            return selectedIds;
        }

        batchDeleteSelectedBtn.onclick = () => {
            const selectedIds = getSelectedDownloadIds();
            if (selectedIds.length === 0) {
                alert('请选择要删除的文件！');
                return;
            }
            if (confirm(`确定要删除选中的 ${selectedIds.length} 个文件吗？`)) {
                // 从后往前删除，避免索引问题
                // 复制一份数组，因为删除会修改原数组
                [...selectedIds].reverse().forEach(id => {
                    handleSingleAction(id, 'delete');
                });
            }
        };

        batchPauseSelectedBtn.onclick = () => {
            const selectedIds = getSelectedDownloadIds();
            if (selectedIds.length === 0) {
                alert('请选择要暂停的文件！');
                return;
            }
            downloads.forEach(d => {
                // 只暂停下载中的项目
                if (selectedIds.includes(d.id) && d.status === 'downloading') {
                    updateDownloadTask(d.id, 'paused', d.progress);
                }
            });
        };

        batchCancelSelectedBtn.onclick = () => {
            const selectedIds = getSelectedDownloadIds();
            if (selectedIds.length === 0) {
                alert('请选择要取消的文件！');
                return;
            }
            downloads.forEach(d => {
                // 取消除已完成和已取消之外的所有状态，包括排队中
                if (selectedIds.includes(d.id) && d.status !== 'completed' && d.status !== 'cancelled') {
                    updateDownloadTask(d.id, 'cancelled', 0);
                }
            });
        };

        // ---------------------- “全部”操作处理 ----------------------
        pauseAllBtn.onclick = () => {
            downloads.forEach(d => {
                // 只暂停下载中的项目
                if (d.status === 'downloading') {
                    updateDownloadTask(d.id, 'paused', d.progress);
                }
            });
        };

        cancelAllBtn.onclick = () => {
            downloads.forEach(d => {
                // 取消除已完成和已取消之外的所有状态，包括排队中
                if (d.status !== 'completed' && d.status !== 'cancelled') {
                    updateDownloadTask(d.id, 'cancelled', 0);
                }
            });
        };

        deleteAllBtn.onclick = () => {
            if (confirm('确定要删除所有已完成下载任务吗？这无法恢复！')) {
                /*
                downloads.forEach(d => {
                    /*
                    // 取消所有正在进行的下载和写入操作
                    if (activeReaders[d.id]) {
                        try { activeReaders[d.id].cancel(); } catch (e) { console.error("Error cancelling reader:", e); }
                        delete activeReaders[d.id];
                    }
                    if (activeWriters[d.id]) {
                        try { activeWriters[d.id].abort(); activeWriters[d.id].close(); } catch (e) { console.error("Error aborting writer:", e); }
                        delete activeWriters[d.id];
                    }
                });
                downloads = []; // 清空数组
                */
                downloads = downloads.filter(d => d.status !== 'completed');
                renderDownloadList();
            }
        };


        // ---------------------- UI 交互 ----------------------
        // 悬浮按钮点击事件
        fabButton.addEventListener('click', () => {
            downloadListContainer.classList.toggle('hidden');
            if (!downloadListContainer.classList.contains('hidden')) {
                // 如果显示了，确保列表是最新的
                renderDownloadList();
            }
        });

        // 关闭按钮点击事件
        closeBtn.addEventListener('click', () => {
            downloadListContainer.classList.add('hidden');
        });

        // 初始化渲染列表 (此时会显示“暂无下载任务”)
        renderDownloadList();

        // ---------------------- 批量下载按钮集成 (新按钮) ----------------------
        batchDownloadNewBtn.addEventListener("click", async () => {
            if (!window.showDirectoryPicker) {
                alert('您的浏览器不支持 File System Access API，无法使用批量下载功能。请使用 Chrome/Edge 浏览器。');
                return;
            }

            try {
                // 让用户选择保存目录
                globalFileSystemPicker = await window.showDirectoryPicker({ mode: "readwrite" });
                // alert('已选择下载目录。正在收集任务，请查看下载列表。');
            } catch (e) {
                // 用户取消选择目录或权限被拒绝
                console.error("User cancelled directory picker or permission denied:", e);
                alert('未选择下载目录，或权限被拒绝。无法进行批量下载。');
                globalFileSystemPicker = null;
                return;
            }

            if(location.href.includes("/workspace/")) {
                let jobs = [];
                let iterator = document.evaluate("//time/../../..//a", document.body);
                let a;
                while ((a = iterator.iterateNext()) != null)
                    jobs.push(a);

                let tasksAddedCount = 0;
                for(const a of jobs) {
                    const span = a.querySelector("span") ?? a;
                    const novelId = a.href.split("/novel/", 2)[1];
                    if (!novelId) {
                        console.info(`Bad novelId extracted from ${a.href}`);
                        continue;
                    }
                    const title = localStorage.getItem(novelId);
                    if (!title) {
                        console.info(`Unknown novelId ${novelId}, no title found in localStorage.`);
                        span.textContent = `✖${span.textContent}`;
                        continue;
                    }
                    // 构建下载URL，确保文件名编码正确
                    const url = `/api/novel/${novelId}/file?mode=zh&translationsMode=priority&type=epub&filename=${encodeURIComponent(title)}.epub&translations=sakura&translations=gpt&translations=youdao&translations=baidu`;

                    // 使用下载管理器API添加任务，初始状态为 'queued'
                    if(addDownloadTask(title, url, globalFileSystemPicker, 'queued')) {
                        tasksAddedCount++;
                        span.textContent = `✔${span.textContent}`;
                    }
                }
                if (tasksAddedCount) {
                    // 如果列表是隐藏的，显示它
                    if (downloadListContainer.classList.contains('hidden')) {
                        downloadListContainer.classList.remove('hidden');
                    }
                }
            } else if(location.href.includes("/favorite/")) {
                let tasksAddedCount = 0;
                for(const div of document.querySelectorAll(".n-list-item__main")) {
                    const statusBar = document.evaluate(".//span[starts-with(text(), '连载中') or starts-with(text(), '已完结')]", div).iterateNext();
                    if(!statusBar)
                        continue;

                    // 连载中 /  总计 490 / 百度 163 / 有道 410 / GPT 0 / Sakura 454 / 
                    const status = statusBar.innerText.split("/");
                    const total = parseInt(/\d+/.exec(status[1])[0]);
                    const sakura = parseInt(/\d+/.exec(status[5])[0]);
                    if(total > sakura) {
                        console.log(`${statusBar.innerText} is not completed. total: ${total}, sakura: ${sakura}`);
                        continue;
                    }

                    const a = document.evaluate(".//a[starts-with(@href, '/novel/')]", div).iterateNext();
                    if(!a)
                        continue;

                    const novelId = a.href.split("/novel/", 2)[1];
                    if (!novelId) {
                        console.info(`Bad novelId extracted from ${a.href}`);
                        continue;
                    }
                    const title = localStorage.getItem(novelId);
                    if (!title) {
                        console.info(`Unknown novelId ${novelId}, no title found in localStorage.`);
                        a.textContent = `✖${a.textContent}`;
                        continue;
                    }
                    // 构建下载URL，确保文件名编码正确
                    const url = `/api/novel/${novelId}/file?mode=zh&translationsMode=priority&type=epub&filename=${encodeURIComponent(title)}.epub&translations=sakura&translations=gpt&translations=youdao&translations=baidu`;

                    // 使用下载管理器API添加任务，初始状态为 'queued'
                    if(addDownloadTask(title, url, globalFileSystemPicker, 'queued')) {
                        a.textContent = `✔${a.textContent}`;
                        tasksAddedCount++;
                    }
                }
                if (tasksAddedCount) {
                    // 如果列表是隐藏的，显示它
                    if (downloadListContainer.classList.contains('hidden')) {
                        downloadListContainer.classList.remove('hidden');
                    }
                }
            }
        });
    })();
})();
