// ==UserScript==
// @name               YouTube 浏览助手
// @name:zh-CN         YouTube 浏览助手
// @name:en            YouTube Assistant
// @description        可在当前页面查看YouTube的缩略图，支持字幕下载
// @description:zh-CN  可在当前页面查看YouTube的缩略图，支持字幕下载
// @description:en     To view subtitle and thumbnail of YouTube Video
// @namespace          https://www.runningcheese.com/userscripts
// @author             RunningCheese
// @version            1.4
// @match              http*://www.youtube.com/*
// @match              http*://m.youtube.com/*
// @icon               https://t1.gstatic.cn/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=32&url=https://www.youtube.com
// @grant              GM_setValue
// @grant              GM_getValue
// @grant              GM_registerMenuCommand
// @license            MIT
// @grant              none

// @downloadURL https://update.greasyfork.org/scripts/543423/YouTube%20%E6%B5%8F%E8%A7%88%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/543423/YouTube%20%E6%B5%8F%E8%A7%88%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 简化的元素创建工具
    const elements = {
        createAs(nodeType, config, appendTo) {
            const element = document.createElement(nodeType);
            if (config) {
                Object.entries(config).forEach(([key, value]) => {
                    element[key] = value;
                });
            }
            if (appendTo) appendTo.appendChild(element);
            return element;
        },
        getAs(selector) {
            return document.body.querySelector(selector);
        }
    };

    // 创建预览图片元素
    const preview = elements.createAs("img", {
        id: "preview",
        style: `
            position: absolute;
            z-index: 2000;
            max-width: 60vw;
            max-height: 60vh;
            border: 1px solid #fff;
            border-radius: 4px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            display: none;
            z-index: 1000000000;
        `
    }, document.body);


// 添加点击事件监听器
preview.addEventListener('click', function() {
    this.style.display = 'none';
});


    // 添加CSS样式
    const style = elements.createAs('style', {
        textContent: `
            .yt-icon-btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 16px;
                height: 16px;
                border-radius: 4px;
                cursor: pointer;
                margin-left: 8px;
                transition: background-color 0.3s;
                padding: 2px;
            }

            .yt-icon-btn svg {
                width: 14px;
                height: 14px;
                fill: currentColor;
            }

            .yt-subtitle-btn {
                color: white;
                background-color: #FF0000;
            }

            .yt-subtitle-btn:hover {
                background-color: #CC0000;
                color: white;
            }

            .yt-thumbnail-btn {
                color: white;
                background-color: #FF0000;
            }

            .yt-thumbnail-btn:hover {
                background-color: #CC0000;
                color: white;
            }
        `
    }, document.head);

    // YouTube缩略图和字幕查看器主体
    const youtubeViewer = {
        videoId: null,
        buttonAdded: false,
        buttonCheckInterval: null,

        // 获取当前视频ID
        getVideoId() {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get('v');
        },

        // 检查是否在视频页面
        isVideoPage() {
            return window.location.pathname.includes('/watch');
        },

        // 获取YouTube缩略图URL
        getThumbnailUrl() {
            const videoId = this.getVideoId();
            if (!videoId) return null;

            // 返回最高质量的缩略图
            return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        },

        // 打开downsub.com下载字幕
        openDownsub() {
            const currentUrl = window.location.href;
            const downsubUrl = `https://downsub.com/?url=${encodeURIComponent(currentUrl)}`;
            window.open(downsubUrl, '_blank');
        },

        // 显示提示消息
        showToast(message) {
            const toast = elements.createAs("div", {
                style: `
                    position: fixed;
                    top: 12%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background-color: #FF0000;
                    color: white;
                    padding: 15px 20px;
                    border-radius: 4px;
                    font-size: 14px;
                    z-index: 1000000000;
                `,
                textContent: message
            }, document.body);

            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 3000);
        },

        // 添加字幕和缩略图按钮到YouTube logo右边
        addButtons() {
            if (elements.getAs('#yt-subtitle-btn') && elements.getAs('#yt-thumbnail-btn')) {
                return;
            }

            // 查找YouTube logo元素
            const logoElement = elements.getAs('#logo') ||
                               elements.getAs('ytd-topbar-logo-renderer') ||
                               elements.getAs('#masthead-logo') ||
                               elements.getAs('a[href="/"]');

            if (!logoElement) {
                console.log('找不到YouTube logo元素');
                return;
            }

            // 创建按钮容器
            let buttonContainer = elements.getAs('#yt-helper-buttons');
            if (!buttonContainer) {
                buttonContainer = elements.createAs('div', {
                    id: 'yt-helper-buttons',
                    style: `
                        display: flex;
                        align-items: center;
                        margin-left: 0px;
                    `
                });

                // 将按钮容器插入到logo的父元素中
                const logoParent = logoElement.parentElement;
                if (logoParent) {
                    logoParent.style.display = 'flex';
                    logoParent.style.alignItems = 'center';
                    logoParent.insertBefore(buttonContainer, logoElement.nextSibling);
                }
            }

            // 创建字幕按钮 - 只在视频页面显示
            if (!elements.getAs('#yt-subtitle-btn') && this.isVideoPage() && this.getVideoId()) {
                const subtitleBtn = elements.createAs('a', {
                    id: 'yt-subtitle-btn',
                    className: 'yt-icon-btn yt-subtitle-btn',
                    title: '下载视频字幕 (downsub.com)',
                    innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.5a1 1 0 0 0-.8.4l-1.9 2.533a1 1 0 0 1-1.6 0L5.3 12.4a1 1 0 0 0-.8-.4H2a2 2 0 0 1-2-2V2zm7.194 2.766a1.688 1.688 0 0 0-.227-.272 1.467 1.467 0 0 0-.469-.324l-.008-.004A1.785 1.785 0 0 0 5.734 4C4.776 4 4 4.746 4 5.667c0 .92.776 1.666 1.734 1.666.343 0 .662-.095.931-.26-.137.389-.39.804-.81 1.22a.405.405 0 0 0 .011.59c.173.16.447.155.614-.01 1.334-1.329 1.37-2.758.941-3.706a2.461 2.461 0 0 0-.227-.4zM11 7.073c-.136.389-.39.804-.81 1.22a.405.405 0 0 0 .012.59c.172.16.446.155.613-.01 1.334-1.329 1.37-2.758.942-3.706a2.466 2.466 0 0 0-.228-.4 1.686 1.686 0 0 0-.227-.273 1.466 1.466 0 0 0-.469-.324l-.008-.004A1.785 1.785 0 0 0 10.07 4c-.957 0-1.734.746-1.734 1.667 0 .92.777 1.666 1.734 1.666.343 0 .662-.095.931-.26z"/></svg>',
                    onclick: () => this.openDownsub()
                }, buttonContainer);
            }

            // 创建缩略图按钮 - 只在视频页面显示
            if (!elements.getAs('#yt-thumbnail-btn') && this.isVideoPage() && this.getVideoId()) {
                const thumbnailBtn = elements.createAs('a', {
                    id: 'yt-thumbnail-btn',
                    className: 'yt-icon-btn yt-thumbnail-btn',
                    title: '查看视频缩略图',
                    innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/><path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/></svg>',
                    onmouseenter: (e) => this.showThumbnailPreview(e),
                    onmouseleave: () => this.hideThumbnailPreview(),
                    onclick: () => this.openThumbnailInNewTab()
                }, buttonContainer);
            }

            this.buttonAdded = true;
            console.log('YouTube浏览助手按钮检查完成');
        },

        // 显示缩略图预览
        showThumbnailPreview(event) {
            const thumbnailUrl = this.getThumbnailUrl();
            if (thumbnailUrl) {
                preview.src = thumbnailUrl;
                const rect = event.currentTarget.getBoundingClientRect();
                preview.style.left = (rect.right + 10) + 'px';
                preview.style.top = rect.top + 'px';
                preview.style.width = 'auto';
                preview.style.height = 'auto';

                preview.onload = () => {
                    const screenWidth = window.innerWidth * 0.6;
                    const screenHeight = window.innerHeight * 0.6;

                    if (preview.naturalWidth > screenWidth || preview.naturalHeight > screenHeight) {
                        const widthRatio = screenWidth / preview.naturalWidth;
                        const heightRatio = screenHeight / preview.naturalHeight;
                        const ratio = Math.min(widthRatio, heightRatio);
                        preview.style.width = (preview.naturalWidth * ratio) + 'px';
                        preview.style.height = (preview.naturalHeight * ratio) + 'px';
                    }

                    const previewRect = preview.getBoundingClientRect();
                    if (previewRect.right > window.innerWidth) {
                        preview.style.left = (rect.left - previewRect.width - 10) + 'px';
                    }
                    if (previewRect.bottom > window.innerHeight) {
                        preview.style.top = (window.innerHeight - previewRect.height - 10) + 'px';
                    }

                    preview.style.display = 'block';
                };
            }
        },

        // 隐藏缩略图预览
        hideThumbnailPreview() {
            preview.style.display = 'none';
        },

        // 在新标签页打开缩略图
        openThumbnailInNewTab() {
            const thumbnailUrl = this.getThumbnailUrl();
            if (thumbnailUrl) {
                window.open(thumbnailUrl, '_blank');
            } else {
                this.showToast('无法获取视频缩略图');
            }
        },

        // 清理按钮
        cleanupButtons() {
            const subtitleBtn = elements.getAs('#yt-subtitle-btn');
            const thumbnailBtn = elements.getAs('#yt-thumbnail-btn');

            if (subtitleBtn) {
                subtitleBtn.remove();
            }
            if (thumbnailBtn) {
                thumbnailBtn.remove();
            }
        },

        // 重置状态
        reset() {
            this.buttonAdded = false;
            this.videoId = null;
            if (this.buttonCheckInterval) {
                clearInterval(this.buttonCheckInterval);
                this.buttonCheckInterval = null;
            }
        },

        // 启动按钮检查
        startButtonCheck() {
            if (this.buttonCheckInterval) {
                clearInterval(this.buttonCheckInterval);
            }

            this.buttonCheckInterval = setInterval(() => {
                // 在视频页面检查按钮是否存在
                if (this.isVideoPage() && this.getVideoId()) {
                    if (!elements.getAs('#yt-subtitle-btn') || !elements.getAs('#yt-thumbnail-btn')) {
                        console.log('视频页面按钮已消失，重新添加');
                        this.addButtons();
                    }
                } else {
                    // 不在视频页面时清理按钮
                    this.cleanupButtons();
                }
            }, 2000);
        },

        // 初始化
        init() {
            // 无论在哪个页面都启动检查
            this.addButtons();
            this.startButtonCheck();
            console.log('YouTube浏览助手初始化成功');

            // 监听页面变化
            let lastUrl = location.href;
            new MutationObserver(() => {
                if (lastUrl !== location.href) {
                    lastUrl = location.href;
                    console.log('页面URL变化:', lastUrl);

                    // 延迟处理，等待页面元素加载
                    setTimeout(() => {
                        this.videoId = this.getVideoId();
                        this.addButtons();
                    }, 1000);
                }
            }).observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    };

    // 等待页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => youtubeViewer.init(), 2000);
        });
    } else {
        setTimeout(() => youtubeViewer.init(), 2000);
    }
})();