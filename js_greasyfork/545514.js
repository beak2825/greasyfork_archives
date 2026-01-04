// ==UserScript==
// @name         Jellyfin 播放器选集功能
// @namespace    https://github.com/guiyuanyuanbao/Jellyfin-InPlayerEpisodePreview
// @version      1.0
// @description  在Jellyfin播放器OSD中添加选集功能，支持快速切换剧集
// @author       guiyuanyuanbao
// @license      MIT
// @match        *://*/*/web/index.html
// @match        *://*/web/index.html
// @match        *://*/*/web/
// @match        *://*/web/
// @run-at       document-idle
// @grant        none
// @supportURL   https://github.com/guiyuanyuanbao/Jellyfin-InPlayerEpisodePreview/issues
// @homepageURL  https://github.com/guiyuanyuanbao/Jellyfin-InPlayerEpisodePreview
// @downloadURL https://update.greasyfork.org/scripts/545514/Jellyfin%20%E6%92%AD%E6%94%BE%E5%99%A8%E9%80%89%E9%9B%86%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/545514/Jellyfin%20%E6%92%AD%E6%94%BE%E5%99%A8%E9%80%89%E9%9B%86%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (!document.querySelector('meta[name="application-name"]') ||
        document.querySelector('meta[name="application-name"]').content !== 'Jellyfin') {
        return;
    }

    // 配置参数
    const config = {
        checkInterval: 200,
        uiQueryStr: '.btnVideoOsdSettings',
        mediaContainerQueryStr: "div[data-type='video-osd']",
        mediaQueryStr: 'video',
        maxRetries: 50
    };

    // 全局变量
    let currentItemId = '';
    let currentSeriesId = '';
    let episodeList = [];
    let isInitialized = false;
    let isNewJellyfin = true;
    let lastCheckedItemId = ''; // 记录上次检查的项目ID
    let isEpisodeType = null;  // 缓存当前内容是否为剧集类型

    // 拦截XMLHttpRequest获取当前播放项目ID
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (_, url) {
        this.addEventListener('load', function () {
            if (url.endsWith('PlaybackInfo')) {
                try {
                    const res = JSON.parse(this.responseText);
                    currentItemId = res.MediaSources[0].Id;
                    console.log('[选集插件] 获取到当前项目ID:', currentItemId);
                } catch (e) {
                    console.error('[选集插件] 解析PlaybackInfo失败:', e);
                }
            }
        });
        originalOpen.apply(this, arguments);
    };

    // 检测Jellyfin版本
    const compareVersions = (version1, version2) => {
        if (typeof version1 !== 'string') return -1;
        if (typeof version2 !== 'string') return 1;
        const v1 = version1.split('.').map(Number);
        const v2 = version2.split('.').map(Number);

        for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
            const n1 = v1[i] || 0;
            const n2 = v2[i] || 0;

            if (n1 > n2) return 1;
            if (n1 < n2) return -1;
        }

        return 0;
    };

    // 等待API客户端就绪
    const waitForApiClient = () => {
        return new Promise((resolve) => {
            const checkApiClient = () => {
                if (window.ApiClient && ApiClient.getCurrentUserId) {
                    isNewJellyfin = compareVersions(ApiClient._appVersion, '10.10.0') >= 0;
                    resolve();
                } else {
                    setTimeout(checkApiClient, 100);
                }
            };
            checkApiClient();
        });
    };

    // 创建选集按钮
    function createEpisodeButton() {
        const button = document.createElement('button');
        button.className = 'paper-icon-button-light';
        button.setAttribute('is', 'paper-icon-button-light');
        button.setAttribute('title', '选集');
        button.setAttribute('id', 'episodeSelector');

        const icon = document.createElement('span');
        icon.className = 'xlargePaperIconButton material-icons';
        icon.textContent = 'format_list_bulleted';

        button.appendChild(icon);
        button.onclick = showEpisodeModal;

        return button;
    }

    // 获取当前播放项目信息
    async function getCurrentItemInfo() {
        try {
            await waitForApiClient();

            if (!currentItemId) {
                console.log('[选集插件] 当前项目ID为空，等待获取...');
                return null;
            }

            const userId = ApiClient.getCurrentUserId();
            const itemInfo = await ApiClient.getItem(userId, currentItemId);
            console.log('[选集插件] 当前用户ID:', userId);
            console.log('[选集插件] 当前项目ID:', currentItemId);
            console.log('[选集插件] 获取到项目信息:', itemInfo);
            return itemInfo;
        } catch (error) {
            console.error('[选集插件] 获取项目信息失败:', error);
            return null;
        }
    }

    // 获取系列中的所有剧集
    async function getSeriesEpisodes(seriesId) {
        try {
            await waitForApiClient();

            const userId = ApiClient.getCurrentUserId();
            const query = {
                ParentId: seriesId,
                IncludeItemTypes: 'Episode',
                Recursive: true,
                SortBy: 'ParentIndexNumber,IndexNumber',
                SortOrder: 'Ascending',
                Fields: 'Overview,PrimaryImageAspectRatio,ParentId,IndexNumber,ParentIndexNumber'
            };

            const result = await ApiClient.getItems(userId, query);
            console.log('[选集插件] 获取到剧集列表:', result.Items);
            return result.Items || [];
        } catch (error) {
            console.error('[选集插件] 获取剧集列表失败:', error);
            return [];
        }
    }

    // 创建加载遮罩 - 使用已有的spinner元素
    function createLoadingOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'episodeLoadingOverlay';
        overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                backdrop-filter: blur(10px);
                z-index: 9999999;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                transition: opacity 0.3s ease;
            `;

        // 查找并克隆现有的spinner元素
        let spinner = document.querySelector('div.docspinner.mdl-spinner');
        let spinnerElement;
        
        if (spinner) {
            // 克隆现有的spinner
            spinnerElement = spinner.cloneNode(true);
            spinnerElement.style.opacity = '1';
            spinnerElement.style.visibility = 'visible';
            spinnerElement.style.display = 'block';
            spinnerElement.classList.add('mdlSpinnerActive');
        } else {
            // 找不到spinner时的备用方案
            spinnerElement = document.createElement('div');
            spinnerElement.className = 'docspinner mdl-spinner mdlSpinnerActive';
            spinnerElement.setAttribute('dir', 'ltr');
            
            // 创建spinner内部结构
            for (let i = 0; i < 4; i++) {
                const circle = document.createElement('div');
                circle.className = 'mdl-spinner__layer mdl-spinner__layer-' + (i + 1);
                
                const clipContainer = document.createElement('div');
                clipContainer.className = 'mdl-spinner__circle-clipper mdl-spinner__left';
                
                const circle1 = document.createElement('div');
                circle1.className = 'mdl-spinner__circle';
                clipContainer.appendChild(circle1);
                
                const gapPatch = document.createElement('div');
                gapPatch.className = 'mdl-spinner__gap-patch';
                
                const circle2 = document.createElement('div');
                circle2.className = 'mdl-spinner__circle';
                gapPatch.appendChild(circle2);
                
                const clipperRight = document.createElement('div');
                clipperRight.className = 'mdl-spinner__circle-clipper mdl-spinner__right';
                
                const circle3 = document.createElement('div');
                circle3.className = 'mdl-spinner__circle';
                clipperRight.appendChild(circle3);
                
                circle.appendChild(clipContainer);
                circle.appendChild(gapPatch);
                circle.appendChild(clipperRight);
                
                spinnerElement.appendChild(circle);
            }
        }
        
        // 设置spinner样式
        spinnerElement.style.width = '60px';
        spinnerElement.style.height = '60px';
        
        const textContainer = document.createElement('div');
        textContainer.style.cssText = `
            position: absolute;
            top: 55vh;
            left: 0;
            right: 0;
            text-align: center;
        `;
        
        const loadingText = document.createElement('div');
        loadingText.className = 'loading-text';
        loadingText.style.cssText = `
            color: #fff;
            font-size: 18px;
            font-weight: 500;
        `;
        loadingText.textContent = '正在切换剧集...';
        
        const subText = document.createElement('div');
        subText.style.cssText = `
            color: rgba(255, 255, 255, 0.7);
            font-size: 14px;
            margin-top: 8px;
        `;
        subText.textContent = '请稍候';
        
        textContainer.appendChild(loadingText);
        textContainer.appendChild(subText);
        
        overlay.appendChild(spinnerElement);
        overlay.appendChild(textContainer);
        
        document.body.appendChild(overlay);
        return overlay;
    }

    // 移除加载遮罩
    function removeLoadingOverlay() {
        const overlay = document.getElementById('episodeLoadingOverlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 300);
        }
    }

    // 播放指定剧集
    async function playEpisode(episodeId) {
        let loadingOverlay = null;
        let retryAttempt = 0;
        const maxMainRetries = 2; // 主要重试次数

        const attemptPlayEpisode = async (attemptNumber = 1) => {
            try {
                await waitForApiClient();

                if (episodeId === currentItemId) {
                    console.log('[选集插件] 已经是当前剧集，无需跳转');
                    return true;
                }

                console.log(`[选集插件] 第${attemptNumber}次尝试播放剧集:`, episodeId);

                // 获取serverId
                const serverId = ApiClient.serverId() || ApiClient._serverInfo?.Id || '';
                if (!serverId) {
                    console.error('[选集插件] 无法获取serverId');
                    throw new Error('无法获取服务器信息');
                }

                // 保存当前页面状态
                const originalHash = window.location.hash;
                const originalTitle = document.title;

                // 删除弹幕容器元素（如果存在）
                const danmakuContainer = document.getElementById('danmakuCtr');
                if (danmakuContainer) {
                    danmakuContainer.remove();
                    console.log('[选集插件] 已删除弹幕容器元素');
                }

                // 构造详情页路由
                const detailRoute = `#/details?id=${episodeId}&context=home&serverId=${serverId}`;
                console.log('[选集插件] 准备跳转到详情页:', detailRoute);

                // 更新加载遮罩文本
                const loadingText = document.querySelector('#episodeLoadingOverlay .loading-text');
                if (loadingText) {
                    loadingText.textContent = attemptNumber > 1 ? `正在重试切换剧集 (${attemptNumber}/${maxMainRetries + 1})...` : '正在切换剧集...';
                }

                // 执行跳转并播放
                const performJump = () => {
                    return new Promise((resolve, reject) => {
                        // 隐藏主要内容区域
                        const mainContent = document.querySelector('.mainAnimatedPage') ||
                            document.querySelector('main') ||
                            document.querySelector('.pageContainer') ||
                            document.querySelector('[data-role="page"]');

                        let originalDisplay = '';
                        if (mainContent) {
                            originalDisplay = mainContent.style.display;
                            mainContent.style.display = 'none';
                        }

                        // 跳转到详情页
                        window.location.hash = detailRoute;

                        // 等待详情页加载并查找播放按钮
                        let retryCount = 0;
                        const maxRetries = 35; // 增加重试次数
                        const retryInterval = 200; // 减少重试间隔

                        const waitForPlayButton = () => {
                            // 扩展播放按钮选择器
                            const playButtonSelectors = [
                                'button.btnPlay[data-action="resume"]',
                                'button.btnPlay.detailButton',
                                'button[title="播放"]',
                                'button[title="Play"]',
                                '.btnPlay',
                                'button[data-action="play"]',
                                '.detailButton.btnPlay',
                                '.itemDetailPage .btnPlay',
                                '[data-role="button"][title="播放"]'
                            ];

                            let playButton = null;
                            for (const selector of playButtonSelectors) {
                                const buttons = document.querySelectorAll(selector);
                                for (const btn of buttons) {
                                    // 检查按钮是否可见且可点击
                                    if (btn.offsetParent !== null && !btn.disabled &&
                                        getComputedStyle(btn).visibility !== 'hidden') {
                                        playButton = btn;
                                        break;
                                    }
                                }
                                if (playButton) break;
                            }

                            if (playButton) {
                                console.log('[选集插件] 找到播放按钮，准备点击:', playButton);

                                // 恢复主要内容显示（如果还在详情页）
                                if (mainContent && window.location.hash.includes('details')) {
                                    mainContent.style.display = originalDisplay;
                                }

                                // 模拟点击播放按钮
                                try {
                                    // 先尝试触发focus和mousedown事件
                                    playButton.focus();
                                    playButton.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                                    playButton.click();
                                    playButton.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

                                    console.log('[选集插件] 播放按钮已点击');

                                    // 等待一段时间后验证是否切换成功
                                    setTimeout(() => {
                                        // 检查当前播放的内容是否已切换
                                        const currentPlayingId = getCurrentPlayingItemId();
                                        if (currentPlayingId === episodeId) {
                                            console.log('[选集插件] 剧集切换成功，当前播放:', currentPlayingId);
                                            resolve(true);
                                        } else {
                                            console.warn('[选集插件] 播放按钮已点击但剧集未切换，可能需要重试');
                                            // 检查是否进入了播放页面
                                            if (window.location.hash.includes('video') || document.querySelector('video')) {
                                                console.log('[选集插件] 已进入播放页面，认为切换成功');
                                                resolve(true);
                                            } else {
                                                reject(new Error('播放按钮点击后未成功切换剧集'));
                                            }
                                        }
                                    }, 2000);

                                } catch (clickError) {
                                    console.error('[选集插件] 点击播放按钮失败:', clickError);
                                    reject(new Error('点击播放按钮失败'));
                                }

                            } else if (retryCount < maxRetries) {
                                retryCount++;
                                console.log(`[选集插件] 未找到播放按钮，重试 ${retryCount}/${maxRetries}`);
                                setTimeout(waitForPlayButton, retryInterval);

                            } else {
                                console.error('[选集插件] 超时未找到播放按钮');

                                // 恢复页面状态
                                if (mainContent) {
                                    mainContent.style.display = originalDisplay;
                                }
                                window.location.hash = originalHash;
                                document.title = originalTitle;

                                reject(new Error('在详情页未找到播放按钮，可能是页面加载异常'));
                            }
                        };

                        // 延迟开始查找播放按钮，给页面加载时间
                        setTimeout(waitForPlayButton, 1000);
                    });
                };

                // 执行跳转
                const jumpResult = await performJump();
                return jumpResult;

            } catch (error) {
                console.error(`[选集插件] 第${attemptNumber}次尝试失败:`, error);
                throw error;
            }
        };

        try {
            console.log('[选集插件] 准备播放剧集:', episodeId);

            // 显示加载遮罩
            loadingOverlay = createLoadingOverlay();

            // 尝试播放剧集，如果失败则重试
            let success = false;
            let lastError = null;

            for (retryAttempt = 1; retryAttempt <= maxMainRetries + 1; retryAttempt++) {
                try {
                    success = await attemptPlayEpisode(retryAttempt);
                    if (success) {
                        console.log(`[选集插件] 第${retryAttempt}次尝试成功`);
                        break;
                    }
                } catch (error) {
                    lastError = error;
                    console.warn(`[选集插件] 第${retryAttempt}次尝试失败:`, error.message);

                    // 如果不是最后一次尝试，等待后重试
                    if (retryAttempt < maxMainRetries + 1) {
                        console.log(`[选集插件] 准备进行第${retryAttempt + 1}次重试`);
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }
            }

            if (success) {
                // 延迟移除遮罩，确保播放开始
                setTimeout(() => {
                    removeLoadingOverlay();
                    // 显示成功提示
                    showNotification('剧集切换成功', 'success');
                }, 1500);
            } else {
                throw lastError || new Error('所有重试均失败');
            }

        } catch (error) {
            console.error('[选集插件] 播放剧集最终失败:', error);
            removeLoadingOverlay();

            // 根据错误类型和重试次数给出不同的提示
            let errorMessage = '切换剧集失败';
            let suggestion = '';

            if (error.message.includes('服务器信息')) {
                errorMessage = '无法连接到服务器';
                suggestion = '请检查网络连接';
            } else if (error.message.includes('播放按钮')) {
                errorMessage = retryAttempt > 1 ?
                    `多次尝试后仍找不到播放按钮 (已重试${retryAttempt - 1}次)` :
                    '找不到播放按钮';
                suggestion = '页面可能加载异常，请手动刷新页面后重试';
            } else if (error.message.includes('详情页')) {
                errorMessage = '详情页加载失败';
                suggestion = '请检查剧集是否存在或稍后重试';
            } else if (error.message.includes('未成功切换')) {
                errorMessage = '播放按钮响应异常';
                suggestion = '请尝试手动点击播放按钮或刷新页面';
            }

            const retryInfo = retryAttempt > 1 ? `\n\n已尝试次数：${retryAttempt}次` : '';

            alert(`${errorMessage}\n\n建议：${suggestion}\n\n其他解决方案：\n1. 刷新页面后重试\n2. 检查网络连接\n3. 确认剧集访问权限${retryInfo}`);

            // 显示失败通知
            showNotification(`剧集切换失败：${errorMessage}`, 'error');
        }
    };

    // 获取当前播放项目ID的辅助函数
    function getCurrentPlayingItemId() {
        try {
            // 尝试从多个可能的位置获取当前播放ID
            if (window.currentPlayingItem) {
                return window.currentPlayingItem.Id;
            }
            if (window.playbackManager && window.playbackManager.currentItem) {
                return window.playbackManager.currentItem().Id;
            }
            return currentItemId; // 回退到全局变量
        } catch (e) {
            return currentItemId;
        }
    }

    // 创建通知函数
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 20px;
                border-radius: 6px;
                color: white;
                font-size: 14px;
                font-weight: 500;
                z-index: 9999999;
                max-width: 300px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                transition: all 0.3s ease;
                ${type === 'success' ? 'background: linear-gradient(130deg, #a95bc2, #00a4db);' :
                type === 'error' ? 'background: linear-gradient(135deg, #f44336, #d32f2f);' :
                    'background: linear-gradient(135deg, #2196F3, #1976D2);'}
            `;

        notification.textContent = message;
        document.body.appendChild(notification);

        // 自动移除通知
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // 创建模态框
    function createModal(id, title, contentHtml) {
        const modal = document.createElement('div');
        modal.id = id;
        modal.className = 'dialogContainer';
        modal.style.zIndex = '1000000';

        modal.innerHTML = `
                <div class="dialog" style="width: 90%; max-width: 1200px; max-height: 80vh; padding: 20px; border-radius: 8px; background: rgba(24, 24, 24, 0.95); backdrop-filter: blur(10px);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                        <h2 style="color: #fff; margin: 0; font-size: 24px; font-weight: 600;">
                            ${title}
                        </h2>
                        <button id="close${id}" style="background: none; border: none; color: #fff; font-size: 24px; cursor: pointer; padding: 5px; border-radius: 4px;" title="关闭">
                            ✕
                        </button>
                    </div>
                    <div style="max-height: 60vh; overflow-y: auto; padding-right: 10px;" class="episodes-container">
                        ${contentHtml}
                    </div>
                    <div style="display: flex; justify-content: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                        <button id="cancel${id}" class="raised button-cancel block btnCancel formDialogFooterItem emby-button">
                            关闭
                        </button>
                    </div>
                </div>
            `;

        document.body.appendChild(modal);

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
                .episode-item:hover {
                    background: linear-gradient(135deg, rgba(169, 91, 194, 0.2), rgba(0, 164, 219, 0.2)) !important;
                    border-color: rgba(169, 91, 194, 0.4) !important;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(169, 91, 194, 0.3);
                }

                .current-episode {
                    position: relative;
                }

                .current-episode::before {
                    content: '▶';
                    position: absolute;
                    right: 8px;
                    top: 8px;
                    color: #a95bc2;
                    font-size: 16px;
                    font-weight: bold;
                }

                .episodes-container::-webkit-scrollbar {
                    width: 8px;
                }

                .episodes-container::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 4px;
                }

                .episodes-container::-webkit-scrollbar-thumb {
                    background: linear-gradient(180deg, #a95bc2, #00a4db);
                    border-radius: 4px;
                }

                #close${id}:hover {
                    background: rgba(255, 255, 255, 0.1) !important;
                }
            `;
        document.head.appendChild(style);

        // 绑定事件
        document.getElementById(`close${id}`).onclick = () => closeModal(id);
        document.getElementById(`cancel${id}`).onclick = () => closeModal(id);
    }

    // 关闭模态框
    function closeModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            if (modal._handleEscape) {
                document.removeEventListener('keydown', modal._handleEscape);
            }

            // 清理样式
            const style = document.head.querySelector('style:last-of-type');
            if (style && style.textContent.includes('.episode-item:hover')) {
                document.head.removeChild(style);
            }

            document.body.removeChild(modal);
        }
    }

    // 创建侧边栏选集面板（替代原来的模态框）
    function createEpisodeSidebar(id, title, episodesBySeasons, currentItemId) {
        // 防止创建重复的侧边栏
        if (document.getElementById(id)) {
            return document.getElementById(id);
        }

        const sidebar = document.createElement('div');
        sidebar.id = id;
        sidebar.className = 'episodeSidebar';
        sidebar.style.cssText = `
            position: fixed;
            top: 0;
            right: 0;
            width: 400px;
            max-width: 90%;
            height: 100vh;
            background: rgba(18, 18, 20, 0.95);
            backdrop-filter: blur(15px);
            z-index: 1000000;
            display: flex;
            flex-direction: column;
            box-shadow: -5px 0 25px rgba(0, 0, 0, 0.5);
            transform: translateX(100%);
            transition: transform 0.3s ease-in-out;
            overflow: hidden;
        `;

        // 创建头部
        const header = document.createElement('div');
        header.style.cssText = `
            padding: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            min-height: 60px;
        `;

        const titleEl = document.createElement('h2');
        titleEl.textContent = title;
        titleEl.style.cssText = `
            color: #fff;
            margin: 0;
            font-size: 20px;
            font-weight: 600;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        `;

        const closeButton = document.createElement('button');
        closeButton.innerHTML = '✕';
        closeButton.style.cssText = `
            background: none;
            border: none;
            color: #fff;
            font-size: 20px;
            cursor: pointer;
            padding: 5px;
            border-radius: 4px;
        `;
        closeButton.onclick = () => closeEpisodeSidebar(id);

        header.appendChild(titleEl);
        header.appendChild(closeButton);
        sidebar.appendChild(header);

        // 创建季节选择栏
        const seasonContainer = document.createElement('div');
        seasonContainer.className = 'season-selector';
        seasonContainer.style.cssText = `
            display: flex;
            overflow-x: auto;
            padding: 12px 16px;
            background: rgba(0, 0, 0, 0.2);
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            scrollbar-width: thin;
            scrollbar-color: rgba(169, 91, 194, 0.5) rgba(0, 0, 0, 0.1);
        `;

        // 获取季节列表
        const seasons = Object.keys(episodesBySeasons).sort((a, b) => Number(a) - Number(b));

        // 确定当前剧集所在的季
        let currentSeason = null;
        for (const season in episodesBySeasons) {
            if (episodesBySeasons[season].some(episode => episode.Id === currentItemId)) {
                currentSeason = season;
                break;
            }
        }

        // 如果找不到当前季，默认使用第一季
        const activeSeason = currentSeason || seasons[0];
        console.log('[选集插件] 当前季:', activeSeason);

        // 创建季节按钮
        seasons.forEach(season => {
            const seasonButton = document.createElement('button');
            seasonButton.textContent = `第${season}季`;
            seasonButton.dataset.season = season;
            seasonButton.className = 'season-button';
            seasonButton.style.cssText = `
                padding: 8px 16px;
                margin-right: 8px;
                border: none;
                border-radius: 6px;
                background: ${season === activeSeason ? 'linear-gradient(135deg, #a95bc2, #00a4db)' : 'rgba(255, 255, 255, 0.1)'};
                color: white;
                font-weight: ${season === activeSeason ? 'bold' : 'normal'};
                cursor: pointer;
                white-space: nowrap;
                flex-shrink: 0;
                transition: all 0.2s ease;
            `;

            seasonButton.onclick = function() {
                // 更新所有按钮样式
                document.querySelectorAll('.season-button').forEach(btn => {
                    btn.style.background = 'rgba(255, 255, 255, 0.1)';
                    btn.style.fontWeight = 'normal';
                });
                // 设置当前按钮样式
                this.style.background = 'linear-gradient(135deg, #a95bc2, #00a4db)';
                this.style.fontWeight = 'bold';

                // 显示对应季的剧集
                showSeasonEpisodes(this.dataset.season);
            };

            seasonContainer.appendChild(seasonButton);
        });

        sidebar.appendChild(seasonContainer);

        // 创建剧集列表容器
        const episodesContainer = document.createElement('div');
        episodesContainer.className = 'episodes-container';
        episodesContainer.style.cssText = `
            flex: 1;
            overflow-y: auto;
            padding: 16px;
        `;
        sidebar.appendChild(episodesContainer);

        // 函数：显示指定季的剧集
        function showSeasonEpisodes(season) {
            const episodes = episodesBySeasons[season] || [];
            episodesContainer.innerHTML = '';

            episodes.forEach(episode => {
                const isCurrentEpisode = episode.Id === currentItemId;
                const episodeItem = document.createElement('div');
                episodeItem.className = `episode-item ${isCurrentEpisode ? 'current-episode' : ''}`;
                episodeItem.dataset.episodeId = episode.Id;

                episodeItem.style.cssText = `
                    padding: 12px;
                    margin-bottom: 10px;
                    border-radius: 6px;
                    background: ${isCurrentEpisode ? 'linear-gradient(135deg, rgba(169, 91, 194, 0.3), rgba(0, 164, 219, 0.3))' : 'rgba(255, 255, 255, 0.05)'};
                    border: 1px solid ${isCurrentEpisode ? 'rgba(169, 91, 194, 0.6)' : 'rgba(255, 255, 255, 0.1)'};
                    cursor: pointer;
                    transition: all 0.2s ease;
                    position: relative;
                `;

                // 集数和标题
                const titleElement = document.createElement('div');
                titleElement.style.cssText = `
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 6px;
                `;

                const episodeNumber = document.createElement('span');
                episodeNumber.style.cssText = `
                    color: #fff;
                    font-weight: 600;
                    font-size: 15px;
                `;
                episodeNumber.textContent = episode.IndexNumber ? `第${episode.IndexNumber}集` : '特别篇';

                const episodeTitle = document.createElement('span');
                episodeTitle.style.cssText = `
                    color: rgba(255, 255, 255, 0.85);
                    font-size: 15px;
                    margin-left: 8px;
                    flex: 1;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                `;
                episodeTitle.textContent = episode.Name || '未命名';

                const duration = document.createElement('span');
                duration.style.cssText = `
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 13px;
                `;
                duration.textContent = episode.RunTimeTicks ? formatRuntime(episode.RunTimeTicks) : '';

                titleElement.appendChild(episodeNumber);
                titleElement.appendChild(episodeTitle);
                titleElement.appendChild(duration);
                episodeItem.appendChild(titleElement);

                // 剧集简介
                if (episode.Overview) {
                    const overview = document.createElement('div');
                    overview.style.cssText = `
                        color: rgba(255, 255, 255, 0.6);
                        font-size: 13px;
                        margin-top: 6px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        line-height: 1.4;
                    `;
                    overview.textContent = episode.Overview;
                    episodeItem.appendChild(overview);
                }

                // 当前播放指示器
                if (isCurrentEpisode) {
                    const indicator = document.createElement('div');
                    indicator.style.cssText = `
                        position: absolute;
                        right: 12px;
                        top: 12px;
                        width: 0;
                        height: 0;
                        border-left: 8px solid #a95bc2;
                        border-top: 6px solid transparent;
                        border-bottom: 6px solid transparent;
                        filter: drop-shadow(1px 1px 2px rgba(169, 91, 194, 0.5));
                    `;
                    episodeItem.appendChild(indicator);
                }

                // 点击事件
                episodeItem.onclick = function() {
                    const episodeId = this.dataset.episodeId;
                    if (episodeId && episodeId !== currentItemId) {
                        // 关闭侧边栏并播放
                        closeEpisodeSidebar(id);
                        playEpisode(episodeId);
                    }
                };
                
                episodesContainer.appendChild(episodeItem);
            });
            
            // 自动滚动到当前剧集
            setTimeout(() => {
                const currentEpisodeElement = episodesContainer.querySelector('.current-episode');
                if (currentEpisodeElement) {
                    currentEpisodeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
        }

        // 初始化显示当前季的剧集（而非第一季）
        showSeasonEpisodes(activeSeason);

        // 将当前季节的按钮滚动到可见位置
        setTimeout(() => {
            const activeButton = seasonContainer.querySelector(`[data-season="${activeSeason}"]`);
            if (activeButton) {
                activeButton.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            }
        }, 100);

        document.body.appendChild(sidebar);

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            .episodeSidebar .episodes-container::-webkit-scrollbar {
                width: 5px;
            }

            .episodeSidebar .episodes-container::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.1);
            }

            .episodeSidebar .episodes-container::-webkit-scrollbar-thumb {
                background: rgba(169, 91, 194, 0.5);
                border-radius: 5px;
            }

            .episodeSidebar .season-selector::-webkit-scrollbar {
                height: 5px;
            }

            .episodeSidebar .season-selector::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.1);
            }

            .episodeSidebar .season-selector::-webkit-scrollbar-thumb {
                background: rgba(169, 91, 194, 0.5);
                border-radius: 5px;
            }

            .episode-item:hover {
                background: linear-gradient(135deg, rgba(169, 91, 194, 0.2), rgba(0, 164, 219, 0.2)) !important;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }
        `;
        document.head.appendChild(style);

        // ESC键关闭
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeEpisodeSidebar(id);
            }
        };
        document.addEventListener('keydown', handleEscape);
        sidebar._handleEscape = handleEscape;

        // 添加点击外部关闭功能
        const handleOutsideClick = (e) => {
            // 检查点击是否在侧边栏外部
            if (sidebar && !sidebar.contains(e.target)) {
                closeEpisodeSidebar(id);
            }
        };

        // 延迟添加点击事件，避免创建侧边栏时的点击立即关闭它
        setTimeout(() => {
            document.addEventListener('click', handleOutsideClick);
            sidebar._handleOutsideClick = handleOutsideClick;
        }, 300);

        // 延迟显示侧边栏（添加动画效果）
        setTimeout(() => {
            sidebar.style.transform = 'translateX(0)';
        }, 50);

        return sidebar;
    }

    // 关闭侧边栏
    function closeEpisodeSidebar(id) {
        const sidebar = document.getElementById(id);
        if (!sidebar) return;

        // 添加关闭动画
        sidebar.style.transform = 'translateX(100%)';

        // 移除事件监听器
        if (sidebar._handleEscape) {
            document.removeEventListener('keydown', sidebar._handleEscape);
        }

        // 移除点击外部关闭的事件监听器
        if (sidebar._handleOutsideClick) {
            document.removeEventListener('click', sidebar._handleOutsideClick);
        }

        // 等待动画完成后移除
        setTimeout(() => {
            const style = document.head.querySelector('style:last-of-type');
            if (style && style.textContent.includes('.episode-item:hover')) {
                document.head.removeChild(style);
            }
            sidebar.parentNode?.removeChild(sidebar);
        }, 300);
    }

    // 显示选集侧边栏（替代原来的模态框）
    async function showEpisodeModal() {
        // 检查是否已存在侧边栏
        if (document.getElementById('episodeModal')) {
            return;
        }

        console.log('[选集插件] 显示选集侧边栏');

        // 获取当前项目信息
        const currentItem = await getCurrentItemInfo();
        if (!currentItem) {
            alert('无法获取当前播放信息');
            return;
        }

        // 确定系列ID
        let seriesId = currentItem.SeriesId;
        if (!seriesId) {
            alert('当前项目不是剧集，无法显示选集列表');
            return;
        }

        // 获取剧集列表
        const episodes = await getSeriesEpisodes(seriesId);
        if (episodes.length === 0) {
            alert('未找到相关剧集');
            return;
        }

        // 按季分组剧集
        const episodesBySeasons = {};
        episodes.forEach(episode => {
            const seasonNumber = episode.ParentIndexNumber || 1;
            if (!episodesBySeasons[seasonNumber]) {
                episodesBySeasons[seasonNumber] = [];
            }
            episodesBySeasons[seasonNumber].push(episode);
        });

        // 创建侧边栏
        createEpisodeSidebar(
            'episodeModal',
            `选择剧集 - ${currentItem.SeriesName || currentItem.Name}`,
            episodesBySeasons,
            currentItemId
        );
    }

    // 格式化运行时间
    function formatRuntime(ticks) {
        const minutes = Math.floor(ticks / 600000000);
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        if (hours > 0) {
            return `${hours}:${remainingMinutes.toString().padStart(2, '0')}`;
        } else {
            return `${minutes}分钟`;
        }
    }

    // 初始化UI
    async function initUI() {
        // 页面未加载
        let uiAnchor = document.getElementsByClassName('pause');
        if (!uiAnchor || !uiAnchor[0]) {
            return;
        }

        // 检查是否已经存在选集按钮或容器，避免重复添加
        if (document.getElementById('episodeSelector') || document.getElementById('episodeSelectorCtr')) {
            console.log('[选集插件] 选集按钮已存在，跳过初始化');
            return;
        }

        console.log('[选集插件] 初始化UI');

        // 先清理可能存在的旧元素
        const existingButtons = document.querySelectorAll('#episodeSelector');
        const existingContainers = document.querySelectorAll('#episodeSelectorCtr');

        existingButtons.forEach(btn => btn.remove());
        existingContainers.forEach(container => container.remove());

        // 检查当前项目ID是否变化，避免重复请求
        if (currentItemId !== lastCheckedItemId) {
            // 记录当前检查的项目ID
            lastCheckedItemId = currentItemId;
            
            // 重置类型缓存
            isEpisodeType = null;
            
            // 获取当前项目信息并检查类型
            const currentItem = await getCurrentItemInfo();
            if (!currentItem) {
                console.log('[选集插件] 无法获取当前项目信息，跳过初始化');
                return;
            }

            // 缓存当前内容类型
            isEpisodeType = (currentItem.Type === 'Episode');
            console.log('[选集插件] 内容类型检查结果：', isEpisodeType ? '剧集' : '非剧集');
        }

        // 使用缓存的类型结果，避免重复检查
        if (!isEpisodeType) {
            console.log('[选集插件] 当前项目不是剧集类型，不显示选集按钮');
            return;
        }

        // 弹幕按钮容器div
        let uiEle = null;
        document.querySelectorAll(config.uiQueryStr).forEach(function (element) {
            if (element.offsetParent != null) {
                uiEle = element;
            }
        });
        if (uiEle == null) {
            return;
        }

        // 再次检查是否已经存在选集按钮或容器，防止异步过程中被添加
        if (document.getElementById('episodeSelector') || document.getElementById('episodeSelectorCtr')) {
            console.log('[选集插件] 选集按钮已在异步过程中创建，跳过初始化');
            return;
        }

        let parent = uiEle.parentNode;
        console.log('[选集插件] 找到UI锚点:', uiEle, parent);
        let menubar = document.createElement('div');
        menubar.id = 'episodeSelectorCtr';

        parent.insertBefore(menubar, uiEle.previousSibling);

        // 选集按钮
        menubar.appendChild(createEpisodeButton());

        isInitialized = true;
        console.log('[选集插件] UI初始化完成');
    }

    // 检查是否在播放页面
    function isPlaybackPage() {
        return document.querySelector(config.mediaQueryStr) &&
            document.querySelector(config.mediaContainerQueryStr);
    }

    // 防抖函数，避免短时间内多次执行
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // 主循环，等待页面加载完成后初始化
    function checkAndInit() {
        if (isPlaybackPage()) {
            // 清理冗余按钮，确保不会有多个按钮
            const containers = document.querySelectorAll('#episodeSelectorCtr');
            if (containers.length > 1) {
                console.log(`[选集插件] 发现多个选集按钮容器(${containers.length})，清理冗余`);
                // 保留第一个，删除其他的
                for (let i = 1; i < containers.length; i++) {
                    containers[i].remove();
                }
            }

            initUI();
        } else {
            // 重置初始化状态，因为可能切换到了非播放页面
            isInitialized = false;
            // 清理已创建的UI元素
            const existingContainers = document.querySelectorAll('#episodeSelectorCtr');
            existingContainers.forEach(container => {
                container.remove();
            });
        }
    }

    // 使用防抖版本的checkAndInit
    const debouncedCheckAndInit = debounce(checkAndInit, 150);

    // 等待页面加载完成后初始化
    const waitForElement = (selector) => {
        return new Promise((resolve) => {
            const observer = new MutationObserver(() => {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
        });
    };

    // 主程序启动
    waitForElement('.htmlvideoplayer').then(async () => {

        await waitForApiClient();

        // 等待获取itemId
        if (isNewJellyfin) {
            let retry = 0;
            while (!currentItemId && retry < config.maxRetries) {
                await new Promise((resolve) => setTimeout(resolve, 200));
                retry++;
            }
        }

        // 立即尝试初始化一次
        setTimeout(() => {
            checkAndInit(); // 使用直接版本，第一次初始化
        }, 1000);

        // 定期检查
        setInterval(debouncedCheckAndInit, config.checkInterval);

        // 监听页面变化
        const observer = new MutationObserver((mutations) => {
            let shouldCheck = false;

            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                            // 检测到视频播放器或OSD变化
                            if (node.querySelector &&
                                (node.querySelector(config.mediaQueryStr) ||
                                    node.querySelector(config.mediaContainerQueryStr) ||
                                    node.querySelector(config.uiQueryStr))) {
                                shouldCheck = true;
                            }
                        }
                    });
                }
            });

            if (shouldCheck) {
                setTimeout(debouncedCheckAndInit, 100); // 使用防抖版本
            }
        });

        // 开始观察
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('[选集插件] 插件已加载');
    });
})();