// ==UserScript==
// @name         PDFJM Downloader
// @namespace    pdfjm-downloader
// @version      2025-06-23
// @description  Download PDFJM Origin PDF
// @author       delph1s
// @license      MIT
// @match        https://pdfjm.cn/api/pdf/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pdfjm.cn
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/540491/PDFJM%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/540491/PDFJM%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 全局状态管理
    const state = {
        pdfUrl: null,
        pdfBlob: null,
        downloadButton: null,
        notificationContainer: null,
        activeNotifications: [],
        isInitialized: false
    };

    // 配置常量
    const CONFIG = {
        BUTTON_TEXT: {
            WAITING: '等待PDF链接...',
            LOADING: '等待PDF加载...',
            READY: '立即下载',
            DOWNLOADING: '下载中...'
        },
        NOTIFICATION_DURATION: {
            SHORT: 2000,
            NORMAL: 3000,
            LONG: 4000,
            ERROR: 5000
        }
    };

    // CSS 样式（简化版）
    const CSS_STYLES = `
        .pdf-download-btn {
            position: fixed; bottom: 20px; left: 20px; z-index: 10000;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white; border: none; border-radius: 50px;
            padding: 15px 25px; font-size: 14px; font-weight: 600;
            cursor: pointer; transition: all 0.3s ease;
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
            display: flex; align-items: center; gap: 8px;
            min-width: 140px; justify-content: center;
        }
        .pdf-download-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
        }
        .pdf-download-btn:disabled {
            background: #a0aec0; cursor: not-allowed;
            box-shadow: 0 4px 15px rgba(160, 174, 192, 0.2);
        }
        .notification-container {
            position: fixed; top: 20px; right: 20px; z-index: 10001;
            pointer-events: none; display: flex; flex-direction: column;
            gap: 12px; max-width: 400px;
        }
        .notification {
            padding: 16px 20px; border-radius: 12px; color: white;
            font-weight: 500; font-size: 14px; line-height: 1.4;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
            transform: translateX(100%); opacity: 0;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: auto; backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .notification.show { transform: translateX(0); opacity: 1; }
        .notification.hide { transform: translateX(100%); opacity: 0; }
        .notification.success { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
        .notification.error { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); }
        .notification.info { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); }
        .notification.warning { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }
        .loading-spinner {
            width: 16px; height: 16px; border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%; border-top-color: white;
            animation: spin 1s ease-in-out infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 480px) {
            .notification-container { left: 20px; right: 20px; max-width: none; }
            .notification { transform: translateY(-100%); }
            .notification.show { transform: translateY(0); }
            .notification.hide { transform: translateY(-100%); }
        }
    `;

    // 工具函数
    const utils = {
        // 等待DOM准备
        waitForDOM: (callback) => {
            if (document.body) {
                callback();
            } else {
                document.addEventListener('DOMContentLoaded', callback);
            }
        },

        // 防抖函数
        debounce: (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // 检查是否为PDF URL
        isPdfUrl: (url) => {
            return typeof url === 'string' &&
                url.includes('cdn.pdfjm.cn') &&
                url.includes('.pdf');
        },

        // 解码Base64数据
        decodeBase64Data: (data) => {
            try {
                return atob(data);
            } catch (error) {
                console.error('Base64解码失败:', error);
                return null;
            }
        }
    };

    // 通知系统
    const notificationSystem = {
        show: (message, type = 'info', duration = CONFIG.NOTIFICATION_DURATION.NORMAL) => {
            if (!state.notificationContainer) {
                notificationSystem.createContainer();
            }

            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.textContent = message;

            state.activeNotifications.push(notification);
            state.notificationContainer.appendChild(notification);

            // 显示动画
            requestAnimationFrame(() => {
                notification.classList.add('show');
            });

            // 自动隐藏
            setTimeout(() => notificationSystem.hide(notification), duration);
        },

        hide: (notification) => {
            if (!notification || !notification.parentNode) return;

            notification.classList.remove('show');
            notification.classList.add('hide');

            const index = state.activeNotifications.indexOf(notification);
            if (index > -1) {
                state.activeNotifications.splice(index, 1);
            }

            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 400);
        },

        createContainer: () => {
            if (state.notificationContainer) return;

            state.notificationContainer = document.createElement('div');
            state.notificationContainer.className = 'notification-container';

            utils.waitForDOM(() => {
                if (!document.body.contains(state.notificationContainer)) {
                    document.body.appendChild(state.notificationContainer);
                }
            });
        }
    };

    // 按钮管理
    const buttonManager = {
        create: () => {
            state.downloadButton = document.createElement('button');
            state.downloadButton.className = 'pdf-download-btn';
            buttonManager.update(CONFIG.BUTTON_TEXT.WAITING, true);
            state.downloadButton.addEventListener('click', downloadManager.handle);

            utils.waitForDOM(() => {
                document.body.appendChild(state.downloadButton);
            });
        },

        update: (text, disabled = false, loading = false) => {
            if (!state.downloadButton) return;

            state.downloadButton.disabled = disabled;

            const icon = loading ?
                  '<div class="loading-spinner"></div>' :
            '<svg class="icon" style="width:16px;height:16px" viewBox="0 0 24 24" fill="currentColor"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" /></svg>';

            state.downloadButton.innerHTML = `${icon} ${text}`;
        }
    };

    // 下载管理
    const downloadManager = {
        handle: async () => {
            if (!state.pdfBlob && !state.pdfUrl) {
                notificationSystem.show('❌ 暂无可下载的PDF链接', 'error');
                return;
            }

            buttonManager.update(CONFIG.BUTTON_TEXT.DOWNLOADING, true, true);

            try {
                let blob;

                if (state.pdfBlob) {
                    blob = state.pdfBlob;
                    notificationSystem.show('⚡ 使用缓存数据，下载更快！', 'success', CONFIG.NOTIFICATION_DURATION.SHORT);
                } else if (state.pdfUrl) {
                    notificationSystem.show('🔄 重新下载PDF文件...', 'warning');
                    blob = await downloadManager.fetchPdf(state.pdfUrl);
                }

                await downloadManager.triggerDownload(blob);
                notificationSystem.show('🎉 PDF下载成功！', 'success');
                buttonManager.update(CONFIG.BUTTON_TEXT.READY, false);

            } catch (error) {
                console.error('下载失败:', error);
                notificationSystem.show(`❌ 下载失败: ${error.message}`, 'error', CONFIG.NOTIFICATION_DURATION.ERROR);
                buttonManager.update(state.pdfBlob ? CONFIG.BUTTON_TEXT.READY : '下载PDF', false);
            }
        },

        fetchPdf: async (url) => {
            const response = await fetch(url, {
                headers: {
                    "accept": "*/*",
                    "cache-control": "no-cache"
                },
                referrer: "https://pdfjm.cn/",
                method: "GET",
                mode: "cors",
                credentials: "omit"
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.blob();
        },

        triggerDownload: async (blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.download = "pdfjm下载报告.pdf";
            a.href = url;

            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            // 延迟清理URL以确保下载完成
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        }
    };

    // 网络拦截器
    const interceptor = {
        setupFetch: () => {
            const originalFetch = window.fetch;

            window.fetch = function(url, options = {}) {
                if (utils.isPdfUrl(url)) {
                    console.log('检测到PDF文件请求:', url);
                    state.pdfUrl = url;

                    return originalFetch.apply(this, arguments).then(async response => {
                        const responseClone = response.clone();

                        try {
                            state.pdfBlob = await responseClone.blob();
                            console.log('成功缓存PDF blob，大小:', state.pdfBlob.size, 'bytes');

                            buttonManager.update(CONFIG.BUTTON_TEXT.READY, false);
                            notificationSystem.show('✅ PDF文件已缓存，可以下载！', 'success');
                        } catch (error) {
                            console.error('缓存PDF blob失败:', error);
                        }

                        return response;
                    });
                }

                return originalFetch.apply(this, arguments);
            };
        },

        setupXHR: () => {
            const originalXHR = window.XMLHttpRequest;

            window.XMLHttpRequest = function() {
                const xhr = new originalXHR();
                const originalOpen = xhr.open;

                xhr.open = function(method, url, ...args) {
                    this._url = url;
                    return originalOpen.apply(this, [method, url, ...args]);
                };

                const originalSend = xhr.send;
                xhr.send = function(...args) {
                    if (this._url && this._url.includes('/api/pdf/uurl')) {
                        const originalOnReadyStateChange = this.onreadystatechange;
                        this.onreadystatechange = function() {
                            if (this.readyState === 4 && this.status === 200) {
                                try {
                                    const response = JSON.parse(this.responseText);
                                    if (response?.data) {
                                        const decodedData = utils.decodeBase64Data(response.data);
                                        if (decodedData && utils.isPdfUrl(decodedData)) {
                                            state.pdfUrl = decodedData;
                                            if (!state.pdfBlob) {
                                                buttonManager.update(CONFIG.BUTTON_TEXT.LOADING, true);
                                                notificationSystem.show('🔗 PDF链接已获取，等待文件加载...', 'info');
                                            }
                                        }
                                    }
                                } catch (error) {
                                    console.error('解析PDF响应失败:', error);
                                }
                            }

                            if (originalOnReadyStateChange) {
                                originalOnReadyStateChange.apply(this, arguments);
                            }
                        };
                    }

                    return originalSend.apply(this, args);
                };

                return xhr;
            };

            // 复制原型
            Object.setPrototypeOf(window.XMLHttpRequest, originalXHR);
            window.XMLHttpRequest.prototype = originalXHR.prototype;
        }
    };

    // 初始化函数
    function init() {
        if (state.isInitialized) return;

        console.log('PDF下载助手初始化开始');

        // 注入样式
        const style = document.createElement('style');
        style.textContent = CSS_STYLES;
        (document.head || document.documentElement).appendChild(style);

        // 设置拦截器
        interceptor.setupFetch();
        interceptor.setupXHR();

        // 创建UI
        notificationSystem.createContainer();
        buttonManager.create();

        state.isInitialized = true;

        console.log('PDF下载助手初始化完成');
        notificationSystem.show('🚀 PDF下载助手已启动', 'success');
    }

    // 立即初始化
    init();
})();