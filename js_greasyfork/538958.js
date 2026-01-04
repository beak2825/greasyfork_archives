// ==UserScript==
// @name         YouTube Recommendation History
// @name:zh-CN   YouTube推荐内容回溯
// @namespace    https://github.com/Kibidango086/YouTube-Recommendation-History/
// @version      1.7
// @description  Save and review YouTube homepage recommendations to prevent losing interesting videos after an accidental refresh.
// @description:zh-CN  保存和回溯YouTube首页推荐内容，防止误点刷新后丢失想看的视频推荐
// @author       Kibidang086
// @license      MIT
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538958/YouTube%20Recommendation%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/538958/YouTube%20Recommendation%20History.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 存储推荐历史的数组
    let recommendationHistory = [];
    let currentIndex = -1;
    let isRestoring = false;

    // 存储键名
    const STORAGE_KEY = 'youtube_recommendation_history';
    const INDEX_KEY = 'youtube_current_index';

    // 创建前进按钮
    function createForwardButton() {
        const button = document.createElement('button');
        button.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
            </svg>
            往后Next
        `;
        button.id = 'youtube-forward-btn';
        applyButtonStyles(button);
        return button;
    }

    // 创建后退按钮
    function createBackwardButton() {
        const button = document.createElement('button');
        button.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
            </svg>
            往前Prev
        `;
        button.id = 'youtube-backward-btn';
        applyButtonStyles(button);
        return button;
    }

    function applyButtonStyles(button) {
        const isDark = isDarkMode();

        const lightTheme = {
            background: '#f1f1f1',
            border: '#d3d3d3',
            color: '#0f0f0f',
            hoverBg: '#e5e5e5',
            hoverBorder: '#c6c6c6',
            activeBg: '#d9d9d9'
        };

        const darkTheme = {
            background: '#303030',
            border: '#4a4a4a',
            color: '#ffffff',
            hoverBg: '#3a3a3a',
            hoverBorder: '#5a5a5a',
            activeBg: '#2a2a2a'
        };

        const theme = isDark ? darkTheme : lightTheme;

        button.style.cssText = `
        display: flex;
        align-items: center;
        gap: 8px;
        background: ${theme.background};
        border: 1px solid ${theme.border};
        border-radius: 18px;
        padding: 8px 16px;
        font-size: 14px;
        font-weight: 500;
        color: ${theme.color};
        cursor: pointer;
        transition: all 0.2s ease;
        font-family: "Roboto", sans-serif;
        white-space: nowrap;
        margin: 0 4px;
    `;

        // 移除旧事件，避免重复绑定（可选）
        button.onmouseenter = () => {
            button.style.background = theme.hoverBg;
            button.style.borderColor = theme.hoverBorder;
        };
        button.onmouseleave = () => {
            button.style.background = theme.background;
            button.style.borderColor = theme.border;
        };
        button.onmousedown = () => {
            button.style.background = theme.activeBg;
        };
        button.onmouseup = () => {
            button.style.background = theme.hoverBg;
        };
    }


    // 从localStorage加载历史记录
    function loadHistoryFromStorage() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            const storedIndex = localStorage.getItem(INDEX_KEY);

            if (stored) {
                recommendationHistory = JSON.parse(stored);
                console.log('从存储加载历史记录:', recommendationHistory.length, '条');
            }

            if (storedIndex !== null) {
                currentIndex = parseInt(storedIndex);
                console.log('当前索引:', currentIndex);
            }
        } catch (error) {
            console.error('加载历史记录失败:', error);
            recommendationHistory = [];
            currentIndex = -1;
        }
    }

    // 保存历史记录到localStorage
    function saveHistoryToStorage() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(recommendationHistory));
            localStorage.setItem(INDEX_KEY, currentIndex.toString());
        } catch (error) {
            console.error('保存历史记录失败:', error);
        }
    }

    // 清理过期的历史记录
    function cleanupOldHistory() {
        const now = Date.now();
        const maxAge = 1 * 60 * 60 * 1000; // 1小时。只是我这样写了，并不一定是1小时清理。

        recommendationHistory = recommendationHistory.filter(item => {
            return (now - item.timestamp) < maxAge;
        });

        // 调整currentIndex
        if (currentIndex >= recommendationHistory.length) {
            currentIndex = recommendationHistory.length - 1;
        }

        saveHistoryToStorage();
    }

    // 获取推荐数据（修复版本）
    function getRecommendationData() {
        const videos = [];
        const videoElements = document.querySelectorAll('ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer');

        videoElements.forEach(element => {
            try {
                // 标题
                const titleElement = element.querySelector('#video-title, h3 a, .ytd-video-meta-block h3 a, #video-title-link');

                // 链接
                const linkElement = element.querySelector('a#thumbnail, a#video-title, #video-title-link, a[href*="/watch"]');

                // 缩略图
                const thumbnailElement = element.querySelector('img, ytd-thumbnail img, .ytd-thumbnail img');

                // 频道名称
                const channelElement = element.querySelector(
                    '#channel-name a, ' +
                    '.ytd-channel-name a, ' +
                    'ytd-channel-name a, ' +
                    '#metadata a[href*="/channel"], ' +
                    '#metadata a[href*="/@"], ' +
                    '.ytd-video-meta-block #metadata a'
                );

                // 视频时长
                const durationElement = element.querySelector(
                    'ytd-thumbnail-overlay-time-status-renderer #text, ' +
                    '.ytd-thumbnail-overlay-time-status-renderer #text, ' +
                    'span.ytd-thumbnail-overlay-time-status-renderer, ' +
                    '.video-time, ' +
                    'ytd-thumbnail-overlay-time-status-renderer span'
                );

                // 观看次数和上传时间（通常在metadata中）
                const metadataElements = element.querySelectorAll(
                    '#metadata-line span, ' +
                    '.ytd-video-meta-block #metadata-line span, ' +
                    '#metadata span, ' +
                    '.ytd-video-meta-block span:not([id]), ' +
                    'ytd-video-meta-block span'
                );

                if (titleElement && linkElement) {
                    // 提取观看次数和上传时间
                    let viewCount = '';
                    let uploadTime = '';

                    // 从metadata元素中提取信息
                    metadataElements.forEach(span => {
                        const text = span.textContent?.trim() || '';
                        if (text) {
                            // 检查是否是观看次数（包含"次观看"、"views"等）
                            if (text.includes('次观看') || text.includes('views') || text.includes('次播放') || /^\d+[\d,]*\s*(次|views)/i.test(text)) {
                                if (!viewCount) viewCount = text;
                            }
                            // 检查是否是上传时间（包含时间相关词汇）
                            else if (text.includes('前') || text.includes('ago') || text.includes('天') || text.includes('小时') || text.includes('分钟') || text.includes('秒') ||
                                     text.includes('年') || text.includes('月') || text.includes('周') || /\d+(天|小时|分钟|秒|年|月|周|hours?|days?|minutes?|seconds?|years?|months?|weeks?)/i.test(text)) {
                                if (!uploadTime) uploadTime = text;
                            }
                        }
                    });

                    // 如果上面的方法没有找到，尝试其他选择器
                    if (!viewCount || !uploadTime) {
                        const additionalMetadata = element.querySelectorAll(
                            'span:not([id]):not([class*="button"]):not([class*="icon"]), ' +
                            'div:not([id]):not([class*="button"]):not([class*="icon"]) span'
                        );

                        additionalMetadata.forEach(span => {
                            const text = span.textContent?.trim() || '';
                            if (text && text.length > 0 && text.length < 50) { // 避免太长的文本
                                if (!viewCount && (text.includes('次观看') || text.includes('views') || /^\d+[\d,]*\s*(次|views)/i.test(text))) {
                                    viewCount = text;
                                }
                                if (!uploadTime && (text.includes('前') || text.includes('ago') || /\d+(天|小时|分钟|秒|年|月|周)/i.test(text))) {
                                    uploadTime = text;
                                }
                            }
                        });
                    }

                    const videoData = {
                        title: titleElement.textContent?.trim() || '',
                        url: linkElement.href || '',
                        thumbnail: thumbnailElement?.src || thumbnailElement?.getAttribute('data-src') || '',
                        channel: channelElement?.textContent?.trim() || '',
                        duration: durationElement?.textContent?.trim() || '',
                        viewCount: viewCount,
                        uploadTime: uploadTime,
                        element: element.outerHTML
                    };

                    // 调试输出
                    if (videoData.title) {
                        console.log('提取到视频数据:', {
                            title: videoData.title.substring(0, 30) + '...',
                            duration: videoData.duration,
                            viewCount: videoData.viewCount,
                            uploadTime: videoData.uploadTime,
                            channel: videoData.channel
                        });
                    }

                    videos.push(videoData);
                }
            } catch (error) {
                console.log('提取视频数据时出错:', error);
            }
        });

        console.log(`总共提取到 ${videos.length} 个视频`);
        return videos;
    }

    // 保存当前推荐内容
    function saveCurrentRecommendations() {
        if (isRestoring) return;

        const recommendations = getRecommendationData();
        if (recommendations.length > 0) {
            // 检查是否与最新的历史记录相同（避免重复保存）
            if (recommendationHistory.length > 0) {
                const latest = recommendationHistory[recommendationHistory.length - 1];
                const currentUrls = recommendations.map(r => r.url).sort();
                const latestUrls = latest.data.map(r => r.url).sort();

                if (JSON.stringify(currentUrls) === JSON.stringify(latestUrls)) {
                    console.log('推荐内容未变化，跳过保存');
                    // 忘了要写什么 想起来再说
                    return;
                }
            }

            // 如果当前不在历史末尾，删除后面的历史
            if (currentIndex < recommendationHistory.length - 1) {
                recommendationHistory = recommendationHistory.slice(0, currentIndex + 1);
            }

            recommendationHistory.push({
                timestamp: Date.now(),
                data: recommendations,
                url: window.location.href
            });

            // 限制历史记录数量
            if (recommendationHistory.length > 6) {
                recommendationHistory.shift();
            } else {
                currentIndex++;
            }

            // 保存到localStorage
            saveHistoryToStorage();
            updateButtonStates();
            console.log('已保存推荐内容，当前历史数量:', recommendationHistory.length);
        }
    }

    // 检测当前主题模式
    // 待修改
    function isDarkMode() {
        // 获取页面的主容器元素
        const el = document.querySelector('ytd-app') || document.body;
        const bgColor = window.getComputedStyle(el).backgroundColor;

        // 解析背景颜色为 RGB
        const rgb = bgColor.match(/\d+/g);
        if (!rgb || rgb.length < 3) return false;

        // 将 RGB 转为亮度值（YIQ公式，近似反映人眼感受）
        // https://zh.wikipedia.org/zh-hans/YIQ
        const [r, g, b] = rgb.map(Number);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;

        return brightness < 128; // 亮度低于128视为深色模式
    }


    // 创建自定义视频卡片
    function createVideoCard(video, isDark) {
        const card = document.createElement('div');
        const cardBg = isDark ? '#0f0f0f' : '#ffffff';
        const textColor = isDark ? '#f1f1f1' : '#0f0f0f';
        const secondaryTextColor = isDark ? '#aaaaaa' : '#606060';
        const hoverBg = isDark ? '#272727' : '#f8f8f8';

        card.style.cssText = `
            background: ${cardBg};
            border-radius: 12px;
            overflow: hidden;
            cursor: pointer;
            transition: all 0.2s ease;
            margin-bottom: 16px;
            box-shadow: ${isDark ? '0 1px 3px rgba(255,255,255,0.1)' : '0 1px 3px rgba(0,0,0,0.1)'};
        `;

        // 提取视频ID用于缩略图
        const videoId = extractVideoId(video.url);
        const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/0.jpg` : video.thumbnail;

        // 格式化视频时长显示
        const durationDisplay = video.duration || '';

        // 格式化上传时间和观看次数
        const uploadTimeDisplay = video.uploadTime || '';
        const viewCountDisplay = video.viewCount || '';

        // 构建元数据行
        let metadataLine = '';
        if (viewCountDisplay && uploadTimeDisplay) {
            metadataLine = `${viewCountDisplay} • ${uploadTimeDisplay}`;
        } else if (viewCountDisplay) {
            metadataLine = viewCountDisplay;
        } else if (uploadTimeDisplay) {
            metadataLine = uploadTimeDisplay;
        } else {
            metadataLine = '推荐视频';
        }

        card.innerHTML = `
            <div style="position: relative; width: 100%; padding-bottom: 56.25%; background: #000;">
                <img src="${thumbnailUrl}"
                     alt="${video.title}"
                     style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;"
                     loading="lazy"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: ${isDark ? '#181818' : '#f9f9f9'}; display: none; align-items: center; justify-content: center; color: ${secondaryTextColor}; font-size: 14px;">
                    缩略图加载失败
                </div>
                ${durationDisplay ? `
                <div style="position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.8); color: white; padding: 3px 6px; border-radius: 4px; font-size: 12px; font-weight: 500; font-family: "Roboto", sans-serif;">
                    ${durationDisplay}
                </div>` : ''}
            </div>
            <div style="padding: 12px;">
                <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 500; line-height: 1.3; color: ${textColor}; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; word-break: break-word;">
                    ${video.title}
                </h3>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                    <span style="color: ${secondaryTextColor}; font-size: 14px; font-weight: 400; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                        ${video.channel}
                    </span>
                </div>
                <div style="color: ${secondaryTextColor}; font-size: 13px; line-height: 1.2;">
                    ${metadataLine}
                </div>
            </div>
        `;

        // 添加悬停效果
        card.addEventListener('mouseenter', () => {
            card.style.backgroundColor = hoverBg;
            card.style.transform = 'scale(1.02)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.backgroundColor = cardBg;
            card.style.transform = 'scale(1)';
        });

        // 添加点击事件
        card.addEventListener('click', () => {
            if (video.url) {
                window.open(video.url, '_blank');
            }
        });

        return card;
    }
    // 提取YouTube视频ID
    function extractVideoId(url) {
        if (!url) return null;
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }
    // 创建自定义容器
    function createCustomContainer(recommendations, isDark) {
        const container = document.createElement('div');
        const bgColor = isDark ? '#0f0f0f' : '#ffffff';

        container.style.cssText = `
            background: ${bgColor};
            padding: 20px;
            margin: 10px 0;
            border-radius: 12px;
            box-shadow: ${isDark ? '0 2px 8px rgba(255,255,255,0.05)' : '0 2px 8px rgba(0,0,0,0.1)'};
        `;
        // 添加标题
        const title = document.createElement('div');
        title.style.cssText = `
            font-size: 18px;
            font-weight: 600;
            color: ${isDark ? '#f1f1f1' : '#0f0f0f'};
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 12px;
        `;
        title.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
            </svg>
            历史推荐内容 (${new Date(recommendations.timestamp).toLocaleString()})
        `;
        container.appendChild(title);

        // 创建网格布局
        const grid = document.createElement('div');
        grid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 16px;
        `;

        // 添加视频卡片
        recommendations.data.forEach(video => {
            if (video.title && video.url) {
                const card = createVideoCard(video, isDark);
                grid.appendChild(card);
            }
        });

        container.appendChild(grid);
        return container;
    }

    // 恢复推荐内容
    function restoreRecommendations(index) {
        if (index < 0 || index >= recommendationHistory.length) return;

        isRestoring = true;
        const recommendations = recommendationHistory[index];

        try {
            // 找到推荐内容容器
            const targetContainer = document.querySelector('ytd-rich-grid-renderer #contents') ||
                  document.querySelector('ytd-section-list-renderer #contents') ||
                  document.querySelector('#primary #contents');

            if (targetContainer) {
                // 清空当前内容
                targetContainer.innerHTML = '';

                // 检测深色模式
                const isDark = isDarkMode();

                // 创建自定义容器和内容
                const customContainer = createCustomContainer(recommendations, isDark);
                targetContainer.appendChild(customContainer);

                currentIndex = index;
                saveHistoryToStorage();
                updateButtonStates();
                console.log('已恢复推荐内容，索引:', index, '时间:', new Date(recommendations.timestamp).toLocaleString());
            }
        } catch (error) {
            console.error('恢复推荐内容时出错:', error);
        } finally {
            setTimeout(() => {
                isRestoring = false;
            }, 1000);
        }
    }

    // 更新按钮状态
    function updateButtonStates() {
        const backwardBtn = document.getElementById('youtube-backward-btn');
        const forwardBtn = document.getElementById('youtube-forward-btn');

        if (backwardBtn && forwardBtn) {
            // 更新按钮可用状态
            backwardBtn.disabled = currentIndex <= 0;
            forwardBtn.disabled = currentIndex >= recommendationHistory.length - 1;

            // 更新按钮样式
            if (backwardBtn.disabled) {
                backwardBtn.style.opacity = '0.5';
                backwardBtn.style.cursor = 'not-allowed';
            } else {
                backwardBtn.style.opacity = '1';
                backwardBtn.style.cursor = 'pointer';
            }
            if (forwardBtn.disabled) {
                forwardBtn.style.opacity = '0.5';
                forwardBtn.style.cursor = 'not-allowed';
            } else {
                forwardBtn.style.opacity = '1';
                forwardBtn.style.cursor = 'pointer';
            }

            // 更新按钮文本显示当前位置
            const backwardText = backwardBtn.querySelector('svg').nextSibling;
            const forwardText = forwardBtn.querySelector('svg').nextSibling;
            if (backwardText) backwardText.textContent = `往前Prev (${Math.max(0, currentIndex)}/${Math.max(0, recommendationHistory.length - 1)})`;
            if (forwardText) forwardText.textContent = `往后Next (${Math.max(0, currentIndex)}/${Math.max(0, recommendationHistory.length - 1)})`;
        }
    }

    // 添加按钮到页面
    function addButtonsToPage() {
        if (document.getElementById('youtube-backward-btn')) {
            return;
        }
        const targetElement = document.querySelector('ytd-masthead #end, #masthead #buttons');
        if (targetElement) {
            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = `
            display: flex;
            align-items: center;
            margin-left: 1px;
            width: 0;
            opacity: 0;
            overflow: hidden;
            transition: width 1.2s ease, opacity 1.2s ease;
        `;
            const backwardBtn = createBackwardButton();
            const forwardBtn = createForwardButton();
            backwardBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    restoreRecommendations(currentIndex - 1);
                }
            });
            forwardBtn.addEventListener('click', () => {
                if (currentIndex < recommendationHistory.length - 1) {
                    restoreRecommendations(currentIndex + 1);
                }
            });
            buttonContainer.appendChild(backwardBtn);
            buttonContainer.appendChild(forwardBtn);
            targetElement.appendChild(buttonContainer);
            buttonContainer.offsetWidth;
            buttonContainer.style.width = 'auto'; // 先设为auto，会自动撑开
            buttonContainer.style.opacity = '1';
            updateButtonStates();
        }
    }


    // 删除按钮并添加动画
    function removeButtonsFromPage() {
        const buttonContainer = document.querySelector('#youtube-backward-btn')?.parentElement;
        if (!buttonContainer) return;
        // 获取当前宽度，确保是数值且有单位
        const currentWidth = buttonContainer.offsetWidth + 'px';
        // 先设置宽度为当前宽度（防止宽度是auto），透明度为1，overflow隐藏
        buttonContainer.style.width = currentWidth;
        buttonContainer.style.opacity = '1';
        buttonContainer.style.overflow = 'hidden';
        // 触发浏览器渲染，使初始样式生效
        buttonContainer.offsetWidth; // 访问触发回流
        // 设置过渡效果
        buttonContainer.style.transition = 'width 1.2s ease, opacity 1.2s ease';
        // 设置目标样式：宽度0，透明度0
        buttonContainer.style.width = '0';
        buttonContainer.style.opacity = '0';
        // 动画结束后移除元素
        setTimeout(() => {
            if (buttonContainer && buttonContainer.parentElement) {
                buttonContainer.parentElement.removeChild(buttonContainer);
            }
        }, 1200);
    }
    // 监听页面变化
    function observePageChanges() {
        const observer = new MutationObserver((mutations) => {
            let shouldSave = false;
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    // 检查是否有新的推荐内容加载
                    const addedNodes = Array.from(mutation.addedNodes);
                    if (addedNodes.some(node =>
                                        node.nodeType === 1 &&
                                        (node.matches && node.matches('ytd-rich-item-renderer, ytd-video-renderer')) ||
                                        (node.querySelector && node.querySelector('ytd-rich-item-renderer, ytd-video-renderer'))
                                       )) {
                        shouldSave = true;
                    }
                }
            });
            if (shouldSave && !isRestoring) {
                setTimeout(() => {
                    saveCurrentRecommendations();
                }, 1000);
            }
        });
        // 开始观察
        const targetNode = document.querySelector('ytd-app') || document.body;
        observer.observe(targetNode, {
            childList: true,
            subtree: true
        });
    }

    // 监听URL变化
    function observeUrlChanges() {
        let currentUrl = window.location.href;
        const urlObserver = new MutationObserver(() => {
            if (window.location.href !== currentUrl) {
                currentUrl = window.location.href;
                // 如果是首页，添加按钮并保存推荐内容
                if (window.location.pathname === '/' || window.location.pathname === '') {
                    setTimeout(() => {
                        addButtonsToPage();
                        saveCurrentRecommendations();
                    }, 2000);
                }
                else{
                    removeButtonsFromPage()
                }
            }
        });
        urlObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    function setupYouTubeLogoClickHandler() {
        document.addEventListener('click', function (e) {
            // 检查点击的元素是否是 YouTube 图标或其父元素
            const logo = e.target.closest('a#logo');

            if (logo) {
                saveCurrentRecommendations();
            }
        });
    }


    // 初始化
    function init() {
        console.log('YouTube推荐内容回溯脚本已启动');
        // 加载历史记录
        loadHistoryFromStorage();
        // 清理过期记录
        cleanupOldHistory();
        // 等待页面加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(init, 1000);
            });
            return;
        }
        // 如果在首页，初始化功能
        if (window.location.pathname === '/' || window.location.pathname === '') {
            setTimeout(() => {
                addButtonsToPage();
                // 页面刷新后，不立即保存当前内容，给用户选择恢复的机会
                setTimeout(() => {
                    if (!isRestoring) {
                        saveCurrentRecommendations();
                    }
                }, 3000);
                observePageChanges();
            }, 2000);
        }
        else{
            removeButtonsFromPage()
        }
        // 监听URL变化
        observeUrlChanges();
    }
    // 启动脚本
    init();
})();