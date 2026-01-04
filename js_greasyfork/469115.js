// ==UserScript==
// @name         GESP试卷下载
// @namespace    your-namespace
// @version      1.4
// @description  Adds a download button for question files on GESP website and handles the file downloading using JSZip library.
// @license      AGPL-3.0-or-later
// @author       Y.V
// @match        https://gesp.ccf.org.cn/*
// @grant        GM_download
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.6.0/jszip.min.js
// @icon         https://gesp.ccf.org.cn/101/images/logo20231.png
// @downloadURL https://update.greasyfork.org/scripts/469115/GESP%E8%AF%95%E5%8D%B7%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/469115/GESP%E8%AF%95%E5%8D%B7%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class DownloadManager {
        constructor() {
            this.progressBar = null;
            this.progressContainer = null;
            this.progressText = null;
            this.downloadButton = null;
            this.statusMessage = null;

            this.zipFilename = '';
            this.questionLinks = [];
            this.progress = 0;
            this.increment = 0;

            // 支持的文件类型映射
            this.mimeTypes = {
                'pdf': 'application/pdf',
                'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'doc': 'application/msword',
                'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'ppt': 'application/vnd.ms-powerpoint',
                'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'xls': 'application/vnd.ms-excel',
                'jpg': 'image/jpeg',
                'jpeg': 'image/jpeg',
                'png': 'image/png',
                'txt': 'text/plain'
            };
        }

        initialize() {
            const titleElement = document.querySelector('.title');
            this.zipFilename = titleElement ? (titleElement.textContent.trim() || 'questions') + '合集' : '试卷合集';

            this.findQuestionLinks();

            if (this.questionLinks.length > 0) {
                this.createDownloadButton();
            } else {
                console.log('没有找到可下载的试卷链接');
            }
        }

        findQuestionLinks() {
            const detailsDiv = document.querySelector('.detailsP');

            if (detailsDiv) {
                const links = detailsDiv.querySelectorAll('a');
                links.forEach((link) => {
                    const title = link.textContent.trim();
                    const url = link.href;
                    // 只添加有效的链接
                    if (title && url && url.includes('.')) {
                        this.questionLinks.push({ title, url });
                    }
                });
            }
        }

        createProgressBar() {
            this.progressContainer = document.createElement('div');
            this.progressContainer.classList.add('progress-bar-container');

            const progressInner = document.createElement('div');
            progressInner.classList.add('progress-inner');

            this.progressBar = document.createElement('div');
            this.progressBar.classList.add('progress-bar');

            this.progressText = document.createElement('div');
            this.progressText.classList.add('progress-text');
            this.progressText.textContent = '0%';

            this.statusMessage = document.createElement('div');
            this.statusMessage.classList.add('status-message');
            this.statusMessage.textContent = '准备下载...';

            progressInner.appendChild(this.progressBar);
            this.progressContainer.appendChild(progressInner);
            this.progressContainer.appendChild(this.progressText);
            this.progressContainer.appendChild(this.statusMessage);

            document.body.appendChild(this.progressContainer);
        }

        createDownloadButton() {
            this.downloadButton = document.createElement('button');
            this.downloadButton.textContent = '下载试卷';
            this.downloadButton.classList.add('download-button');
            this.downloadButton.addEventListener('click', () => this.handleDownload());

            document.body.appendChild(this.downloadButton);
        }

        handleDownload() {
            if (this.questionLinks.length === 0) {
                this.showNotification('没有找到可下载的文件', 'error');
                return;
            }

            this.downloadButton.disabled = true;
            this.downloadButton.textContent = '下载中...';
            this.createZipArchive();
        }

        async createZipArchive() {
            const JSZip = window.JSZip;
            const zip = new JSZip();

            this.increment = 100 / this.questionLinks.length;
            this.progress = 0;
            this.createProgressBar();

            let successCount = 0;
            let failCount = 0;

            for (let i = 0; i < this.questionLinks.length; i++) {
                const question = this.questionLinks[i];
                try {
                    this.updateStatusMessage(`下载文件 ${i+1}/${this.questionLinks.length}: ${question.title}`);

                    const response = await fetch(question.url);

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const extension = question.url.split('.').pop().toLowerCase();
                    const arrayBuffer = await response.arrayBuffer();

                    // 获取MIME类型
                    const mimeType = this.mimeTypes[extension] || 'application/octet-stream';

                    // 确保文件名不包含非法字符
                    const safeTitle = this.sanitizeFilename(question.title);
                    const fileName = `${safeTitle}.${extension}`;

                    const fileBlob = new Blob([arrayBuffer], { type: mimeType });
                    zip.file(fileName, fileBlob);

                    successCount++;
                } catch (error) {
                    console.error(`下载文件失败: ${question.title}`, error);
                    failCount++;
                } finally {
                    this.progress += this.increment;
                    this.updateProgressBar(this.progress);
                }
            }

            try {
                this.updateStatusMessage('正在生成压缩包...');
                const zipBlob = await zip.generateAsync({
                    type: 'blob',
                    compression: 'DEFLATE',
                    compressionOptions: { level: 6 }
                });

                this.updateStatusMessage('下载完成!');
                const zipUrl = URL.createObjectURL(zipBlob);
                this.downloadFile(zipUrl, this.zipFilename + '.zip');
                URL.revokeObjectURL(zipUrl);

                const message = `下载完成! 成功: ${successCount}, 失败: ${failCount}`;
                this.showNotification(message, failCount > 0 ? 'warning' : 'success');
            } catch (error) {
                console.error('生成压缩包失败:', error);
                this.showNotification('生成压缩包失败', 'error');
            } finally {
                setTimeout(() => {
                    this.removeProgressBar();
                    this.downloadButton.disabled = false;
                    this.downloadButton.textContent = '下载试卷';
                }, 1500);
            }
        }

        downloadFile(url, fileName) {
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        updateProgressBar(value) {
            const percent = Math.min(Math.round(value), 100);
            this.progressBar.style.width = percent + '%';
            this.progressText.textContent = percent + '%';
        }

        updateStatusMessage(message) {
            if (this.statusMessage) {
                this.statusMessage.textContent = message;
            }
        }

        removeProgressBar() {
            if (this.progressContainer) {
                this.progressContainer.remove();
                this.progressContainer = null;
            }
        }

        showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.classList.add('notification', `notification-${type}`);
            notification.textContent = message;

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.classList.add('show');

                setTimeout(() => {
                    notification.classList.remove('show');
                    setTimeout(() => notification.remove(), 300);
                }, 3000);
            }, 10);
        }

        sanitizeFilename(filename) {
            // 移除文件名中的非法字符
            return filename.replace(/[\\/:*?"<>|]/g, '_');
        }
    }

    // 创建DownloadManager实例并初始化
    const downloadManager = new DownloadManager();
    downloadManager.initialize();

    // 使用GM_addStyle添加CSS样式
    GM_addStyle(`
    .download-button {
        position: fixed;
        right: 20px;
        bottom: 20px;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        background: linear-gradient(45deg, #00C6FF, #0072FF);
        color: #FFFFFF;
        font-family: Arial, sans-serif;
        font-size: 16px;
        cursor: pointer;
        box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
        z-index: 9999;
    }

    .download-button:hover {
        transform: translateY(-2px);
        box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
    }

    .download-button:disabled {
        background: linear-gradient(45deg, #B0B0B0, #808080);
        cursor: not-allowed;
        transform: none;
    }

    .progress-bar-container {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 250px;
        background-color: #FFFFFF;
        border-radius: 10px;
        box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.3);
        padding: 20px;
        text-align: center;
        z-index: 10000;
    }

    .progress-inner {
        width: 100%;
        height: 10px;
        background-color: #F3F3F3;
        border-radius: 5px;
        overflow: hidden;
        margin-bottom: 10px;
    }

    .progress-bar {
        width: 0;
        height: 100%;
        background: linear-gradient(90deg, #00C6FF, #0072FF);
        transition: width 0.3s ease-in-out;
    }

    .progress-text {
        font-size: 16px;
        font-weight: bold;
        color: #333;
        margin-bottom: 10px;
    }

    .status-message {
        font-size: 14px;
        color: #666;
        margin-top: 10px;
        min-height: 20px;
    }

    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-family: Arial, sans-serif;
        box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.2);
        transform: translateX(120%);
        transition: transform 0.3s ease;
        z-index: 10001;
    }

    .notification.show {
        transform: translateX(0);
    }

    .notification-success {
        background-color: #4CAF50;
    }

    .notification-error {
        background-color: #F44336;
    }

    .notification-warning {
        background-color: #FF9800;
    }

    .notification-info {
        background-color: #2196F3;
    }
`);
})();