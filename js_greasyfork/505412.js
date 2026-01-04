// ==UserScript==
// @name         Telegra.ph 上传加强
// @namespace    MOASE
// @version      1.1
// @description  Telegraph.ph 拖拽传图，可以一次拖拽传多图，自动排序，自动切割分批次上传，并带有进度反馈、错误处理、拖放视觉反馈、缓存管理等功能。
// @author       MOASE
// @match        https://telegra.ph/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505412/Telegraph%20%E4%B8%8A%E4%BC%A0%E5%8A%A0%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/505412/Telegraph%20%E4%B8%8A%E4%BC%A0%E5%8A%A0%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const MAX_BATCH_SIZE = 5 * 1024 * 1024; // 5 MB
    let uploadCache = new Set(); // 缓存已上传文件
    let errorCount = 0; // 错误计数
    const errorLogs = []; // 错误日志

    // 创建并显示错误弹窗
    function showErrorPopup(message) {
    errorCount++;
    const timestamp = new Date().toLocaleTimeString();
    const errorMessage = `${timestamp}: ${message}`;

    const errorPopup = document.createElement('div');
    errorPopup.classList.add('error-popup');
    errorPopup.innerHTML = `<span>${errorMessage}</span><button class="close-btn">关闭</button>`;
    errorPopup.style.position = 'fixed';
    errorPopup.style.left = '10px';
    errorPopup.style.bottom = `${10 + errorCount * 60}px`; // 底部对齐，每个弹窗间隔 60px

    // 添加动画效果
    errorPopup.style.opacity = 0;
    errorPopup.style.transition = 'opacity 0.5s ease';
    document.body.appendChild(errorPopup);
    setTimeout(() => errorPopup.style.opacity = 1, 10);

    // 关闭按钮事件
    errorPopup.querySelector('.close-btn').addEventListener('click', () => {
        errorPopup.remove();
        errorCount--;
        adjustErrorPopups();
    });

    // 添加错误日志
    errorLogs.push(errorMessage);

    // 如果错误超过5个，提示下载
    if (errorLogs.length >= 5) {
        if (confirm('错误信息过多，是否下载？')) {
            downloadErrorLogs();
        }
    }
}

    // 调整所有弹窗的位置
    function adjustErrorPopups() {
        const popups = document.querySelectorAll('.error-popup');
        popups.forEach((popup, index) => {
            popup.style.bottom = `${10 + (popups.length - 1 - index) * 60}px`;
        });
    }

    // 下载错误日志
    function downloadErrorLogs() {
        const blob = new Blob([errorLogs.join('\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'error_logs.txt';
        a.click();
        URL.revokeObjectURL(url);
    }

    // 文件排序
    function sortFiles(files) {
        return files.sort((a, b) => {
            const nameA = a.name.replace(/\D/g, '').padStart(10, '0');
            const nameB = b.name.replace(/\D/g, '').padStart(10, '0');
            return nameA.localeCompare(nameB) || a.name.localeCompare(b.name);
        });
    }

    // 批次划分
    function splitIntoBatches(files) {
        let batches = [];
        let currentBatch = [];
        let currentBatchSize = 0;

        for (const file of files) {
            if (uploadCache.has(file.name)) {
                continue; // 跳过已上传文件
            }

            if (currentBatchSize + file.size > MAX_BATCH_SIZE) {
                batches.push(currentBatch);
                currentBatch = [];
                currentBatchSize = 0;
            }
            currentBatch.push(file);
            currentBatchSize += file.size;
        }

        if (currentBatch.length > 0) {
            batches.push(currentBatch);
        }

        return batches;
    }

    // 单个文件处理
    function processFile(file) {
        return new Promise((resolve, reject) => {
            updatePhoto(file, function (e) {
                if (quill.fileSizeLimit && e.size > quill.fileSizeLimit) {
                    quill.fileSizeLimitCallback && quill.fileSizeLimitCallback();
                    reject(new Error('文件大于5M'));
                    return;
                }

                const reader = new FileReader();
                reader.onload = function (event) {
                    const result = getFigureValueByUrl(event.target.result);
                    if (result) {
                        const selection = quill.getSelection(true);
                        quill.updateContents(new Delta().retain(selection.index)["delete"](selection.length).insert({
                            blockFigure: result
                        }), Quill.sources.USER);
                        uploadCache.add(file.name); // 添加到缓存
                        resolve();
                    } else {
                        showErrorPopup("无效的文件格式");
                        reject(new Error('无效的文件格式'));
                    }
                };
                reader.readAsDataURL(e);
            });
        });
    }

    // 批次处理
    async function processBatch(batch, batchIndex) {
        for (const [index, file] of batch.entries()) {
            try {
                await processFile(file);
                updateProgress(batchIndex, index + 1, batch.length); // 更新进度
            } catch (error) {
                handleError(file, error); // 处理错误
            }
        }
    }

    // 全部批次处理
    async function processAllBatches(batches) {
        for (const [batchIndex, batch] of batches.entries()) {
            await processBatch(batch, batchIndex);
        }
        finalizeUpload(); // 上传完成
    }

    // 显示进度条
    function createProgressBar() {
        let progressBar = document.createElement('div');
        progressBar.id = 'uploadProgressBar';
        progressBar.style.position = 'fixed';
        progressBar.style.bottom = '10px';
        progressBar.style.left = '10px';
        progressBar.style.width = '300px';
        progressBar.style.height = '20px';
        progressBar.style.backgroundColor = '#ccc';
        progressBar.style.borderRadius = '5px';
        progressBar.style.overflow = 'hidden';
        progressBar.style.zIndex = '10000';

        let progress = document.createElement('div');
        progress.style.height = '100%';
        progress.style.width = '0';
        progress.style.backgroundColor = '#4caf50';
        progressBar.appendChild(progress);

        document.body.appendChild(progressBar);
        return progress;
    }

    let progressBar = createProgressBar();

    function updateProgress(batchIndex, fileIndex, totalFiles) {
        let totalBatches = parseInt(progressBar.getAttribute('data-total-batches'), 10);
        let currentProgress = ((batchIndex + (fileIndex / totalFiles)) / totalBatches) * 100;
        progressBar.style.width = currentProgress + '%';
    }

    function finalizeUpload() {
        uploadCache.clear(); // 清空缓存
        progressBar.style.width = '100%';
        setTimeout(() => progressBar.style.display = 'none', 2000);
    }

    // 错误处理
    function handleError(file, error) {
        const message = `上传 ${file.name} 时发生错误: ${error.message}`;
        console.error(message);
        showErrorPopup(message);
    }

    // 拖放视觉反馈
    function addDragDropVisualFeedback() {
        const highlightClass = 'drag-over-highlight';
        const dropZone = document.querySelector("[contenteditable]");

        dropZone.addEventListener('dragenter', () => {
            dropZone.classList.add(highlightClass);
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove(highlightClass);
        });

        dropZone.addEventListener('drop', () => {
            dropZone.classList.remove(highlightClass);
        });

        // 添加一些基础的高亮样式
        const style = document.createElement('style');
        style.innerHTML = `
            .${highlightClass} {
                border: 2px dashed #4caf50;
                background-color: rgba(76, 175, 80, 0.1);
            }
            .error-popup {
                padding: 10px;
                background-color: #ffdddd;
                border: 1px solid #f44336;
                border-radius: 5px;
                box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
                margin-bottom: 5px;
                z-index: 10001;
            }
            .error-popup .close-btn {
                margin-left: 10px;
                background-color: #f44336;
                color: white;
                border: none;
                border-radius: 3px;
                padding: 3px 6px;
                cursor: pointer;
            }
            .error-popup .close-btn:hover {
                background-color: #d32f2f;
            }
        `;
        document.head.appendChild(style);
    }

    // 主逻辑
    document.addEventListener('drop', async function (event) {
        event.preventDefault();

        const files = Array.from(event.dataTransfer.files);
        const sortedFiles = sortFiles(files);
        const batches = splitIntoBatches(sortedFiles);

        progressBar.setAttribute('data-total-batches', batches.length);
        progressBar.style.display = 'block';

        await processAllBatches(batches);
    });

    document.addEventListener('dragover', function (event) {
        event.preventDefault();
    });

    addDragDropVisualFeedback();
})();
