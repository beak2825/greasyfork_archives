// ==UserScript==
// @name         Dou音视频下载器
// @namespace    https://greasyfork.org/zh-CN/scripts/538824-dou%E9%9F%B3%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%99%A8
// @version      1.0
// @author       moyu001
// @description  一键下载抖音视频，支持多种清晰度选择，无水印下载
// @license      MIT
// @match        *://*.douyin.com/*
// @match        *://*.iesdouyin.com/*
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/538824/Dou%E9%9F%B3%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/538824/Dou%E9%9F%B3%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 工具函数
    const utils = {
        // 格式化文件大小
        formatByteToSize(bytes) {
            if (bytes === 0) return '0 B';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        },

        // 阻止事件
        preventEvent(event) {
            event.preventDefault();
            event.stopPropagation();
        },

        // 获取React对象
        getReactObj(element) {
            for (let key in element) {
                if (key.startsWith('__reactInternalInstance') || key.startsWith('__reactFiber')) {
                    return element[key];
                }
            }
            return null;
        },

        // 显示消息
        showMessage(message, type = 'info') {
            const colors = {
                info: '#2196F3',
                success: '#4CAF50',
                error: '#F44336',
                warning: '#FF9800'
            };

            const messageEl = document.createElement('div');
            messageEl.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${colors[type]};
                color: white;
                padding: 12px 20px;
                border-radius: 4px;
                z-index: 10000;
                font-size: 14px;
                max-width: 300px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            `;
            messageEl.textContent = message;
            document.body.appendChild(messageEl);

            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 3000);
        }
    };

    // 下载管理器
    class DownloadManager {
        constructor() {
            this.downloads = new Map();
        }

        // 显示视频解析对话框
        showParseDialog(downloadFileName, downloadUrlInfoList) {
            let contentHTML = '';

            downloadUrlInfoList.forEach((downloadInfo) => {
                const videoQualityInfo = `${downloadInfo.width}x${downloadInfo.height} @${downloadInfo.fps}fps`;
                contentHTML += `
                    <div class="dy-video-item" style="margin: 15px 0; padding: 15px; border: 1px solid #e0e0e0; border-radius: 8px;">
                        <div class="dy-video-quality" style="margin-bottom: 8px;">
                            <span style="font-weight: bold;">清晰度：</span>
                            <span>${videoQualityInfo}</span>
                        </div>
                        <div class="dy-video-size" style="margin-bottom: 8px;">
                            <span style="font-weight: bold;">文件大小：</span>
                            <span>${utils.formatByteToSize(downloadInfo.dataSize)}</span>
                        </div>
                        <div class="dy-video-actions">
                            <button class="download-btn" data-url="${downloadInfo.url}" data-filename="${downloadFileName} - ${videoQualityInfo}.${downloadInfo.format}"
                                style="background: #fe2c55; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-right: 10px;">
                                立即下载
                            </button>
                            <a href="${downloadInfo.url}" target="_blank" style="color: #1890ff; text-decoration: none;">
                                在新窗口打开
                            </a>
                        </div>
                        ${downloadInfo.backUrl.length ? `
                            <div class="dy-video-backup" style="margin-top: 8px;">
                                <span style="font-weight: bold;">备用地址：</span>
                                ${downloadInfo.backUrl.map((url, index) =>
                                    `<a href="${url}" target="_blank" style="color: #1890ff; margin-right: 10px;">地址${index + 1}</a>`
                                ).join('')}
                            </div>
                        ` : ''}
                    </div>
                `;
            });

            // 创建对话框
            const dialog = document.createElement('div');
            dialog.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                z-index: 10000;
                max-width: 600px;
                max-height: 80vh;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            `;

            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 9999;
            `;

            dialog.innerHTML = `
                <div style="padding: 20px; border-bottom: 1px solid #e0e0e0;">
                    <h3 style="margin: 0; color: #333;">视频下载</h3>
                    <button id="close-dialog" style="position: absolute; top: 15px; right: 15px; background: none; border: none; font-size: 20px; cursor: pointer;">×</button>
                </div>
                <div style="padding: 20px; overflow-y: auto; flex: 1;">
                    ${contentHTML}
                </div>
            `;

            document.body.appendChild(overlay);
            document.body.appendChild(dialog);

            // 绑定事件
            dialog.querySelector('#close-dialog').onclick = () => {
                document.body.removeChild(overlay);
                document.body.removeChild(dialog);
            };

            overlay.onclick = () => {
                document.body.removeChild(overlay);
                document.body.removeChild(dialog);
            };

            // 绑定下载按钮事件
            dialog.querySelectorAll('.download-btn').forEach(btn => {
                btn.onclick = (e) => {
                    const url = e.target.getAttribute('data-url');
                    const filename = e.target.getAttribute('data-filename');
                    this.downloadVideo(url, filename);
                };
            });
        }

        // 下载视频
        downloadVideo(url, filename) {
            if (typeof GM_download !== 'function') {
                utils.showMessage('当前脚本环境不支持下载功能', 'error');
                window.open(url, '_blank');
                return;
            }

            utils.showMessage('开始下载视频...', 'info');

            let downloadId = Date.now();
            let progressElement = this.createProgressElement(filename, downloadId);

            const downloadOptions = {
                url: url,
                name: filename,
                headers: {
                    'Referer': window.location.href,
                    'User-Agent': navigator.userAgent
                },
                onload: () => {
                    this.removeProgressElement(downloadId);
                    utils.showMessage(`下载完成：${filename}`, 'success');
                },
                onprogress: (details) => {
                    if (details.loaded && details.total) {
                        const progress = Math.round((details.loaded / details.total) * 100);
                        this.updateProgress(downloadId, progress);
                    }
                },
                onerror: (error) => {
                    this.removeProgressElement(downloadId);
                    utils.showMessage(`下载失败：${error.error || '未知错误'}`, 'error');
                },
                ontimeout: () => {
                    this.removeProgressElement(downloadId);
                    utils.showMessage('下载超时', 'error');
                }
            };

            try {
                const result = GM_download(downloadOptions);
                this.downloads.set(downloadId, result);
            } catch (error) {
                this.removeProgressElement(downloadId);
                utils.showMessage('下载启动失败', 'error');
            }
        }

        // 创建进度元素
        createProgressElement(filename, downloadId) {
            const progressEl = document.createElement('div');
            progressEl.id = `download-progress-${downloadId}`;
            progressEl.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: white;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                padding: 15px;
                z-index: 10000;
                max-width: 300px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            `;

            progressEl.innerHTML = `
                <div style="font-size: 14px; margin-bottom: 8px; color: #333;">${filename}</div>
                <div style="background: #f0f0f0; border-radius: 4px; overflow: hidden;">
                    <div id="progress-bar-${downloadId}" style="background: #fe2c55; height: 8px; width: 0%; transition: width 0.3s;"></div>
                </div>
                <div id="progress-text-${downloadId}" style="font-size: 12px; color: #666; margin-top: 4px;">0%</div>
            `;

            document.body.appendChild(progressEl);
            return progressEl;
        }

        // 更新进度
        updateProgress(downloadId, progress) {
            const progressBar = document.getElementById(`progress-bar-${downloadId}`);
            const progressText = document.getElementById(`progress-text-${downloadId}`);

            if (progressBar && progressText) {
                progressBar.style.width = `${progress}%`;
                progressText.textContent = `${progress}%`;
            }
        }

        // 移除进度元素
        removeProgressElement(downloadId) {
            const progressEl = document.getElementById(`download-progress-${downloadId}`);
            if (progressEl && progressEl.parentNode) {
                progressEl.parentNode.removeChild(progressEl);
            }
            this.downloads.delete(downloadId);
        }
    }

    // 视频解析器
    class VideoParser {
        constructor(downloadManager) {
            this.downloadManager = downloadManager;
        }

        // 解析视频信息
        parseVideoInfo(element) {
            try {
                const reactObj = utils.getReactObj(element);
                if (!reactObj) {
                    throw new Error('无法获取React对象');
                }

                // 查找awemeInfo
                let awemeInfo = null;
                let currentFiber = reactObj;

                // 向上遍历fiber树查找awemeInfo
                while (currentFiber && !awemeInfo) {
                    if (currentFiber.memoizedProps && currentFiber.memoizedProps.awemeInfo) {
                        awemeInfo = currentFiber.memoizedProps.awemeInfo;
                        break;
                    }
                    if (currentFiber.return && currentFiber.return.memoizedProps && currentFiber.return.memoizedProps.awemeInfo) {
                        awemeInfo = currentFiber.return.memoizedProps.awemeInfo;
                        break;
                    }
                    currentFiber = currentFiber.return;
                }

                if (!awemeInfo) {
                    throw new Error('无法获取视频信息');
                }

                return this.extractVideoUrls(awemeInfo);
            } catch (error) {
                console.error('解析视频信息失败:', error);
                utils.showMessage('解析视频信息失败', 'error');
                return null;
            }
        }

        // 提取视频URL
        extractVideoUrls(awemeInfo) {
            const videoDownloadUrlList = [];
            const bitRateList = awemeInfo?.video?.bitRateList;

            if (bitRateList && Array.isArray(bitRateList)) {
                bitRateList.forEach(item => {
                    const videoInfo = {
                        url: item.playApi || item.playAddr?.[0]?.src,
                        width: item.width,
                        height: item.height,
                        format: item.format || 'mp4',
                        fps: item.fps || 30,
                        dataSize: item.dataSize || 0,
                        backUrl: []
                    };

                    // 添加备用URL
                    if (Array.isArray(item.playAddr)) {
                        videoInfo.backUrl = item.playAddr.map(addr => addr.src).filter(src => src !== videoInfo.url);
                    }

                    // 处理URL协议
                    if (videoInfo.url) {
                        if (videoInfo.url.startsWith('http:')) {
                            videoInfo.url = videoInfo.url.replace('http:', 'https:');
                        }
                        videoDownloadUrlList.push(videoInfo);
                    }
                });
            }

            if (videoDownloadUrlList.length === 0) {
                throw new Error('未找到有效的视频链接');
            }

            // 去重并排序
            const uniqueVideos = this.removeDuplicates(videoDownloadUrlList);
            uniqueVideos.sort((a, b) => b.width - a.width); // 按清晰度降序排列

            // 生成文件名
            const authorName = awemeInfo?.authorInfo?.nickname || '未知作者';
            const videoDesc = awemeInfo?.desc || '未知视频';
            const filename = `${authorName} - ${videoDesc}`.replace(/[<>:"/\\|?*]/g, '_');

            return { filename, videos: uniqueVideos };
        }

        // 去除重复视频
        removeDuplicates(videoList) {
            const unique = [];
            const seen = new Set();

            videoList.forEach(video => {
                const key = `${video.width}x${video.height}@${video.fps}`;
                if (!seen.has(key)) {
                    seen.add(key);
                    unique.push(video);
                } else {
                    // 如果已存在相同规格，选择文件大小更大的
                    const existingIndex = unique.findIndex(v =>
                        v.width === video.width && v.height === video.height && v.fps === video.fps
                    );
                    if (existingIndex !== -1 && video.dataSize > unique[existingIndex].dataSize) {
                        unique[existingIndex] = video;
                    }
                }
            });

            return unique;
        }
    }

    // 主应用类
    class DouyinDownloader {
        constructor() {
            this.downloadManager = new DownloadManager();
            this.videoParser = new VideoParser(this.downloadManager);
            this.init();
        }

        init() {
            this.bindEvents();
        }

        // 绑定事件
        bindEvents() {
            // 监听分享按钮点击（原有的下载按钮）
            document.addEventListener('click', (event) => {
                const shareContainer = event.target.closest('[data-e2e="video-share-container"]');
                if (shareContainer) {
                    const downloadBtn = event.target.closest('div[data-inuser="false"] button + div');
                    if (downloadBtn) {
                        utils.preventEvent(event);
                        this.handleVideoDownload(event.target);
                    }
                }
            }, true);
        }

        // 处理视频下载
        handleVideoDownload(element) {
            try {
                const result = this.videoParser.parseVideoInfo(element);
                if (result) {
                    this.downloadManager.showParseDialog(result.filename, result.videos);
                }
            } catch (error) {
                console.error('下载处理失败:', error);
                utils.showMessage('下载处理失败', 'error');
            }
        }
    }

    // 启动应用
    function startApp() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                new DouyinDownloader();
            });
        } else {
            new DouyinDownloader();
        }
    }

    // 检查页面是否为抖音相关页面
    if (window.location.hostname.includes('douyin.com') || window.location.hostname.includes('iesdouyin.com')) {
        startApp();
    }

})();