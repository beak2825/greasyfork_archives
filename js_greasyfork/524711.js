// ==UserScript==
// @name         复制Youtube信息
// @namespace    http://tampermonkey.net/
// @version      3.9
// @description  Copy creator name, views, likes, comments, subscribers, and publish date from YouTube videos.
// @author       Punk Deer
// @match        *://www.youtube.com/watch*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/524711/%E5%A4%8D%E5%88%B6Youtube%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/524711/%E5%A4%8D%E5%88%B6Youtube%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== 工具函数 =====
    /**
     * 格式化日期
     * @param {string} dateText - 原始日期文本
     * @returns {string|null} - 格式化后的日期或null
     */
    function formatDate(dateText) {
        if (!dateText) return null;

        // 中文日期格式: 2023年5月20日
        const chineseDateMatch = dateText.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
        if (chineseDateMatch) {
            return `${chineseDateMatch[1]}.${chineseDateMatch[2].padStart(2, '0')}.${chineseDateMatch[3].padStart(2, '0')}`;
        }

        // 英文日期格式: May 20, 2023 或 20 May 2023
        const englishDateMatch1 = dateText.match(/(\w+)\s+(\d{1,2}),\s+(\d{4})/);
        const englishDateMatch2 = dateText.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/);

        const monthMap = {
            Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
            Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12',
            January: '01', February: '02', March: '03', April: '04', May: '05', June: '06',
            July: '07', August: '08', September: '09', October: '10', November: '11', December: '12'
        };

        if (englishDateMatch1) {
            const month = monthMap[englishDateMatch1[1]];
            const day = englishDateMatch1[2].padStart(2, '0');
            const year = englishDateMatch1[3];
            return month ? `${year}.${month}.${day}` : null;
        }

        if (englishDateMatch2) {
            const day = englishDateMatch2[1].padStart(2, '0');
            const month = monthMap[englishDateMatch2[2]];
            const year = englishDateMatch2[3];
            return month ? `${year}.${month}.${day}` : null;
        }

        return null;
    }

    /**
     * 将带单位的数字转换为纯数字
     * @param {string} text - 带单位的数字文本（如 "29K", "1.5万"）
     * @returns {number} - 转换后的数字
     */
    function convertToNumber(text) {
        if (!text) return null;

        // 处理带单位的数字
        if (text.includes('万')) {
            return Math.round(parseFloat(text.replace('万', '')) * 10000);
        } else if (text.includes('K')) {
            return Math.round(parseFloat(text.replace('K', '')) * 1000);
        } else if (text.includes('M')) {
            return Math.round(parseFloat(text.replace('M', '')) * 1000000);
        }

        // 处理纯数字
        return parseInt(text.replace(/,/g, ''), 10);
    }

    /**
     * 显示通知
     * @param {string} message - 通知消息
     */
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.innerText = message;
        notification.style.position = 'fixed';
        notification.style.left = '15px';
        notification.style.bottom = '15px';
        notification.style.backgroundColor = '#323232';
        notification.style.color = 'white';
        notification.style.padding = '10px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '9999';
        notification.style.fontSize = '14px';
        notification.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        document.body.appendChild(notification);

        // 3秒后移除通知
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // ===== 数据提取函数 =====
    /**
     * 获取创作者名称
     * @returns {string|null} - 创作者名称或null
     */
    function getCreatorName() {
        const element = document.querySelector('span[itemprop="author"] [itemprop="name"]');
        return element ? element.getAttribute('content').trim() : null;
    }

    /**
     * 获取创作者URL
     * @returns {string|null} - 创作者URL或null
     */
    function getCreatorURL() {
        const element = document.querySelector('span[itemprop="author"] link[itemprop="url"]');
        return element ? element.getAttribute('href').trim() : null;
    }

/**
 * 获取视频播放量
 * @returns {string|null} - 视频播放量(纯数字)或null
 */
function getRawVideoViews() {
    // 尝试原始方法
    let element = document.querySelector('meta[itemprop="interactionCount"]');
    if (element) {
        return element.getAttribute('content').trim();
    }

    // 尝试新的选择器 - 方法1：视频信息区域
    element = document.querySelector('span.view-count');
    if (element) {
        const viewText = element.textContent.trim();
        // 提取数字部分，去除逗号和其他文本
        const match = viewText.match(/[\d,]+/);
        return match ? match[0].replace(/,/g, '') : null;
    }

    // 尝试新的选择器 - 方法2：视频详情区域
    element = document.querySelector('#count .view-count');
    if (element) {
        const viewText = element.textContent.trim();
        // 提取数字部分，去除逗号和其他文本
        const match = viewText.match(/[\d,]+/);
        return match ? match[0].replace(/,/g, '') : null;
    }

    // 尝试新的选择器 - 方法3：新版YouTube界面
    element = document.querySelector('ytd-video-view-count-renderer');
    if (element) {
        const viewText = element.textContent.trim();
        // 提取数字部分，去除逗号和其他文本
        const match = viewText.match(/[\d,]+/);
        return match ? match[0].replace(/,/g, '') : null;
    }

    console.log('无法获取YouTube播放量，所有已知方法均失败');
    return null;
}

    /**
     * 获取订阅者数量
     * @returns {number|null} - 订阅者数量或null
     */
    function getIntegerSubscriberCount() {
        const element = document.querySelector('yt-formatted-string#owner-sub-count');
        if (element) {
            const text = element.innerText.replace(/位订阅者|subscribers/g, '').trim();
            return convertToNumber(text);
        }
        return null;
    }

    /**
     * 获取评论数量
     * @returns {string|null} - 评论数量或null
     */
    function getCommentsCount() {
        const element = document.querySelector('#count .yt-formatted-string');
        if (element) {
            const text = element.innerText.trim();
            const commentCount = text.match(/(\d{1,3}(?:,\d{3})*)/);
            if (commentCount) {
                return commentCount[1].replace(/,/g, '');
            }
        }
        return null;
    }

/**
 * 获取点赞数量，支持多语言界面
 * @returns {number|null} - 点赞数量或null
 */
function getLikesCount() {
    // 方法1：尝试从按钮元素获取点赞数（更通用的选择器）
    const likeButtons = document.querySelectorAll('button.yt-spec-button-shape-next');
    for (const button of likeButtons) {
        // 检查是否是点赞按钮（通过图标或位置判断）
        if (button.querySelector('div[aria-label*="like" i], div[aria-label*="赞" i]')) {
            const likesElement = button.querySelector('.yt-spec-button-shape-next__button-text-content');
            if (likesElement && likesElement.innerText.trim()) {
                return convertToNumber(likesElement.innerText.trim());
            }
        }
    }

    // 方法2：尝试从分段控件获取点赞数
    const segmentedControls = document.querySelectorAll('segmented-like-dislike-button-view-model');
    if (segmentedControls.length > 0) {
        const likeButton = segmentedControls[0].querySelector('button');
        if (likeButton) {
            const likesText = likeButton.getAttribute('aria-label');
            if (likesText) {
                // 提取数字部分
                const match = likesText.match(/[\d,\.]+[KkMmBb]?/);
                if (match) {
                    return convertToNumber(match[0]);
                }
            }
        }
    }

    // 方法3：尝试从factoid元素获取点赞数（支持多语言）
    const factoidElements = document.querySelectorAll('.ytwFactoidRendererFactoid');
    for (const element of factoidElements) {
        const ariaLabel = element.getAttribute('aria-label') || '';
        // 检查是否包含"likes"或"赞"等关键词
        if (ariaLabel.match(/likes|赞|点赞|喜欢/i)) {
            const valueElement = element.querySelector('.ytwFactoidRendererValue .yt-core-attributed-string');
            if (valueElement && valueElement.innerText.trim()) {
                return convertToNumber(valueElement.innerText.trim());
            }
        }
    }

    // 方法4：尝试从元数据获取
    const metaLikes = document.querySelector('meta[itemprop="interactionCount"]');
    if (metaLikes) {
        return parseInt(metaLikes.getAttribute('content'), 10);
    }

    console.log('无法获取YouTube点赞数，所有已知方法均失败');
    return null;
}

    /**
     * 获取格式化的发布日期
     * @returns {string|null} - 格式化的发布日期或null
     */
    function getFormattedPublishDate() {
        // 尝试从info-strings获取日期
        let dateElement = document.querySelector('div#info-strings yt-formatted-string');

        // 如果上面的选择器没有找到，尝试其他可能的选择器
        if (!dateElement) {
            dateElement = document.querySelector('#info-container .ytd-video-primary-info-renderer');
        }

        if (!dateElement) {
            // 尝试查找包含日期的元素
            const possibleElements = document.querySelectorAll('span.ytd-video-primary-info-renderer');
            for (const el of possibleElements) {
                const text = el.innerText || '';
                if (text.match(/\d{4}/) && (text.includes('-') || text.includes(',') || text.includes('年'))) {
                    dateElement = el;
                    break;
                }
            }
        }

        if (dateElement) {
            return formatDate(dateElement.innerText.trim());
        }

        return null;
    }

    /**
     * 获取简化的视频URL
     * @returns {string} - 简化的视频URL
     */
    function getSimplifiedVideoURL() {
        const url = new URL(window.location.href);
        url.search = url.searchParams.get('v') ? `?v=${url.searchParams.get('v')}` : '';
        return url.toString();
    }

    /**
     * 加载评论（滚动到评论区）
     */
    function loadComments() {
        const commentsSection = document.querySelector('#comments');
        if (commentsSection) {
            commentsSection.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }
    /**
     * 获取并复制全部数据（播放量、点赞数、评论数）
     */
    function getAllData() {
        // 显示加载通知
        showNotification('正在获取数据，请稍候...');

        // 先滚动到评论区以加载评论
        loadComments();

        // 设置一个变量来存储评论数
        let commentValue = null;

        // 保存原始的GM_setClipboard函数
        const originalSetClipboard = GM_setClipboard;

        // 重写GM_setClipboard函数以捕获评论数
        GM_setClipboard = function(text) {
            // 当评论按钮调用此函数时，保存评论数
            if (text && !commentValue) {
                commentValue = text;
            }
        };

        // 等待2秒让评论加载
        setTimeout(() => {
            // 尝试获取评论数
            const commentsData = getCommentsCount();
            if (commentsData) {
                commentValue = commentsData;
            }

            // 如果评论数获取失败，再等待1.5秒重试
            if (!commentValue) {
                setTimeout(() => {
                    const retryCommentsData = getCommentsCount();
                    if (retryCommentsData) {
                        commentValue = retryCommentsData;
                    }

                    // 恢复原始的GM_setClipboard函数
                    GM_setClipboard = originalSetClipboard;

                    // 获取其他数据
                    const viewsData = getRawVideoViews() || '获取失败';
                    const likesData = getLikesCount() || '获取失败';

                    // 格式化数据（竖排显示，点赞和评论之间有3个空格）
                    const formattedData = `${viewsData}\n${likesData}\n\n\n\n${commentValue || '获取失败'}`;

                    // 复制到剪贴板
                    originalSetClipboard(formattedData);
                    showNotification('全部数据已复制');
                }, 1500);
            } else {
                // 恢复原始的GM_setClipboard函数
                GM_setClipboard = originalSetClipboard;

                // 获取其他数据
                const viewsData = getRawVideoViews() || '获取失败';
                const likesData = getLikesCount() || '获取失败';

                // 格式化数据（竖排显示，点赞和评论之间有3个空格）
                const formattedData = `${viewsData}\n${likesData}\n\n\n\n${commentsData}`;

                // 复制到剪贴板
                originalSetClipboard(formattedData);
                showNotification('全部数据已复制');
            }
        }, 2000);
    }



    // ===== UI相关函数 =====
    /**
     * 创建按钮
     * @param {string} text - 按钮文本
     * @param {Function} onClick - 点击事件处理函数
     */
    function createButton(text, onClick) {
        const button = document.createElement('button');
        button.innerText = text;
        button.style.padding = '8px 7px';
        button.style.backgroundColor = '#ff0000';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.addEventListener('click', onClick);
        buttonContainer.appendChild(button);
    }

    /**
     * 复制数据并显示通知
     * @param {Function} dataGetter - 获取数据的函数
     * @param {string} successMessage - 成功消息
     */
    function copyData(dataGetter, successMessage) {
        const data = dataGetter();
        if (data) {
            GM_setClipboard(data.toString());
            showNotification(successMessage);
        } else {
            showNotification('无法获取数据');
        }
    }

   // ===== 初始化 =====
    // 创建按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'fixed';
    buttonContainer.style.top = '80px';
    buttonContainer.style.left = '15px';
    buttonContainer.style.zIndex = '9999';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexDirection = 'column';
    buttonContainer.style.gap = '10px';
    document.body.appendChild(buttonContainer);

    // 创建所有按钮
    createButton('昵称', () => copyData(getCreatorName, '昵称已复制'));
    createButton('订阅', () => copyData(getIntegerSubscriberCount, '订阅数已复制'));
    createButton('日期', () => copyData(getFormattedPublishDate, '发布日期已复制'));
    createButton('主页', () => copyData(getCreatorURL, '创作者主页已复制'));
    createButton('URL', () => copyData(getSimplifiedVideoURL, '视频URL已复制'));
    createButton('播放', () => copyData(getRawVideoViews, '播放数已复制'));
    createButton('点赞', () => copyData(getLikesCount, '点赞数已复制'));

    // 评论按钮需要特殊处理
    createButton('评论', function() {
        loadComments();  // 先滚动到评论区
        setTimeout(() => {
            const data = getCommentsCount();
            if (data) {
                GM_setClipboard(data);
                showNotification('评论数已复制');
            } else {
                showNotification('无法获取评论数');
            }
        }, 1000);  // 等待评论加载
    });

    // 添加全部数据按钮 - 按照原有按钮实现方式
    createButton('全部', function() {
        // 先滚动到评论区以加载评论
        loadComments();

        // 等待评论加载
        setTimeout(() => {
            // 尝试获取评论数
            const commentsData = getCommentsCount();

            if (commentsData) {
                // 获取其他数据
                const viewsData = getRawVideoViews() || '获取失败';
                const likesData = getLikesCount() || '获取失败';

                // 格式化数据（竖排显示，点赞和评论之间有3个空格）
                const formattedData = `${viewsData}\n${likesData}\n\n\n\n${commentsData}`;

                // 复制到剪贴板
                GM_setClipboard(formattedData);
                showNotification('全部数据已复制');
            } else {
                // 如果第一次获取失败，再等待1.5秒重试
                setTimeout(() => {
                    const retryCommentsData = getCommentsCount();

                    // 获取其他数据
                    const viewsData = getRawVideoViews() || '获取失败';
                    const likesData = getLikesCount() || '获取失败';

                    // 格式化数据（竖排显示，点赞和评论之间有3个空格）
                    const formattedData = `${viewsData}\n${likesData}\n\n\n\n${commentsData || '获取失败'}`;

                    // 复制到剪贴板
                    GM_setClipboard(formattedData);
                    showNotification('全部数据已复制');
                }, 1500);
            }
        }, 2000);  // 等待评论加载
    });

    // 添加复制真正完全数据按钮
    createButton('真全部', function() {
        // 先滚动到评论区以加载评论
        loadComments();

        // 等待评论加载
        setTimeout(() => {
            // 尝试获取所有数据
            const creatorName = getCreatorName() || '获取失败';
            const subscriberCount = getIntegerSubscriberCount() || '获取失败';
            const publishDate = getFormattedPublishDate() || '获取失败';
            const creatorURL = getCreatorURL() || '获取失败';
            const videoURL = getSimplifiedVideoURL() || '获取失败';
            const viewsData = getRawVideoViews() || '获取失败';
            const likesData = getLikesCount() || '获取失败';
            const commentsData = getCommentsCount();

            if (commentsData) {
                // 按照指定顺序格式化数据
                const formattedData = `${creatorName}\n${subscriberCount}\n${publishDate}\n\n\n\n\n${creatorURL}\n${videoURL}\n\n\n\n\n${viewsData}\n${likesData}\n\n\n\n${commentsData}`;

                // 复制到剪贴板
                GM_setClipboard(formattedData);
                showNotification('真正完全数据已复制');
            } else {
                // 如果第一次获取失败，再等待1.5秒重试
                setTimeout(() => {
                    const retryCommentsData = getCommentsCount();

                    // 按照指定顺序格式化数据
                    const formattedData = `${creatorName}\n${subscriberCount}\n${publishDate}\n\n\n\n\n${creatorURL}\n${videoURL}\n\n\n\n\n${viewsData}\n${likesData}\n\n\n\n${retryCommentsData || '获取失败'}`;

                    // 复制到剪贴板
                    GM_setClipboard(formattedData);
                    showNotification('真正完全数据已复制');
                }, 1500);
            }
        }, 2000);  // 等待评论加载
    });
})();