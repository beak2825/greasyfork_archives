// ==UserScript==
// @name         复制Tiktok信息
// @namespace    http://tampermonkey.net/
// @version      1.31
// @description  复制tiktok信息
// @author       Punk Deer
// @match        https://www.tiktok.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @icon         https://www.tiktok.com/favicon.ico
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/toastify-js/1.12.0/toastify.min.js
// @resource     TOASTIFY_CSS https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css
// @downloadURL https://update.greasyfork.org/scripts/531808/%E5%A4%8D%E5%88%B6Tiktok%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/531808/%E5%A4%8D%E5%88%B6Tiktok%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 加载 Toastify.js 的 CSS
    const toastifyCSS = GM_getResourceText('TOASTIFY_CSS');
    GM_addStyle(toastifyCSS);

    let currentUrl = window.location.href;
    let retryCount = 0;

    // 注入按钮样式到页面
    function injectButtonStyles() {
        const styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.textContent = `
            .tiktok-copy-button {
                display: block;
                padding: 8px 15px;
                margin: 5px;
                background-color: #007bff;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                width: 80px;
                text-align: center;
                font-size: 14px;
                font-weight: 600;
                transition: background-color 0.3s;
                user-select: none;
                -webkit-user-select: none;
                touch-action: manipulation;
            }

            .tiktok-copy-button:hover {
                background-color: #0056b3;
            }

            .tiktok-copy-button:active {
                transform: scale(0.95);
            }

            .tiktok-button-container {
                position: fixed;
                top: 80px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 2px;
            }

            .tiktok-special-button {
                display: block;
                padding: 10px 15px;
                margin: 5px;
                background-color: #28a745;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                width: 80px;
                text-align: center;
                font-size: 14px;
                font-weight: 600;
                transition: background-color 0.3s;
                user-select: none;
                -webkit-user-select: none;
                touch-action: manipulation;
            }

            .tiktok-special-button:hover {
                background-color: #1e7e34;
            }

            .tiktok-special-button:active {
                transform: scale(0.95);
            }
        `;
        document.head.appendChild(styleElement);
    }

    // 创建单个复制按钮
    function createCopyButton(name, getValueFunction) {
        const button = document.createElement('button');
        button.className = 'tiktok-copy-button';
        button.textContent = name;

        button.addEventListener('click', () => {
            const value = getValueFunction();
            navigator.clipboard.writeText(value).then(() => {
                showNotification(`已复制${name}: ${value}`);
            }).catch(err => {
                console.error('复制失败: ', err);
                showNotification('复制失败，请重试');
            });
        });

        return button;
    }

    // 创建特殊按钮（一键复制多个数据）
    function createSpecialButton(name, data) {
        const button = document.createElement('button');
        button.className = 'tiktok-special-button';
        button.textContent = name;

        button.addEventListener('click', () => {
            // 处理点赞数格式
            let formattedDiggCount = data.diggCount || '未知';
            if (typeof formattedDiggCount === 'string') {
                formattedDiggCount = formattedDiggCount.replace(/(\d+(\.\d+)?)([KkMm])/g, (match, num, decimal, unit) => {
                    const multiplier = unit.toUpperCase() === 'K' ? 1000 : 1000000;
                    return Math.round(parseFloat(num) * multiplier);
                });
            }

            const copyText = `${data.playCount || '未知'}\n${formattedDiggCount}\n\n${data.collectCount || '未知'}\n${data.shareCount || '未知'}\n${data.commentCount || '未知'}`;

            navigator.clipboard.writeText(copyText).then(() => {
                showNotification('已复制全部数据');
            }).catch(err => {
                console.error('复制失败: ', err);
                showNotification('复制失败，请重试');
            });
        });

        return button;
    }

    // 创建复制按钮组
    function createCopyButtons(data) {
        // 移除已存在的按钮容器
        const existingContainer = document.querySelector('.tiktok-button-container');
        if (existingContainer) {
            existingContainer.remove();
        }

        // 尝试再次获取最新的点赞数
        const likeElement = document.querySelector('strong[data-e2e="like-count"]');
        if (likeElement) {
            data.diggCount = likeElement.textContent.trim();
            console.log('更新点赞数:', data.diggCount);
        }

        // 创建新的按钮容器
        const container = document.createElement('div');
        container.className = 'tiktok-button-container';

        // 提取账户名，去掉 @ 符号
        const accountName = window.location.pathname.split('/')[1].replace('@', '');

        // 处理点赞数格式
        let formattedDiggCount = data.diggCount || '未知';
        if (typeof formattedDiggCount === 'string') {
            // 将 "156.3K" 转换为 "156300"
            formattedDiggCount = formattedDiggCount.replace(/(\d+(\.\d+)?)([KkMm])/g, (match, num, decimal, unit) => {
                const multiplier = unit.toUpperCase() === 'K' ? 1000 : 1000000;
                return Math.round(parseFloat(num) * multiplier);
            });
        }

        // 处理日期格式
        let formattedDate = data.publishDate || (data.createTime ? new Date(data.createTime * 1000).toLocaleString() : '未知');

        // 处理 YYYY-MM-DD 格式
        if (formattedDate.match(/\d{4}-\d{1,2}-\d{1,2}/)) {
            const dateParts = formattedDate.split('-');
            if (dateParts.length === 3) {
                const year = dateParts[0];
                const month = dateParts[1].padStart(2, '0');
                const day = dateParts[2].padStart(2, '0');
                formattedDate = `${year}.${month}.${day}`;
            }
        }
        // 处理从 createTime 生成的日期格式 (如 2022/5/9 00:35:21)
        else if (formattedDate.includes('/')) {
            const dateTimeParts = formattedDate.split(' ');
            if (dateTimeParts.length > 0) {
                const dateParts = dateTimeParts[0].split('/');
                if (dateParts.length === 3) {
                    const year = dateParts[0];
                    const month = dateParts[1].padStart(2, '0');
                    const day = dateParts[2].padStart(2, '0');
                    formattedDate = `${year}.${month}.${day}`;
                }
            }
        }

        // 创建各个功能按钮
        const nameButton = createCopyButton('名称', () => accountName);
        const followButton = createCopyButton('关注', () => data.followerCount || '未知');
        const dateButton = createCopyButton('日期', () => formattedDate);
        const homeButton = createCopyButton('主页', () => `https://www.tiktok.com/@${accountName}`);
        const urlButton = createCopyButton('URL', () => window.location.href);
        const playButton = createCopyButton('播放', () => data.playCount || '未知');
        const likeButton = createCopyButton('点赞', () => formattedDiggCount);
        const collectButton = createCopyButton('收藏', () => data.collectCount || '未知');
        const shareButton = createCopyButton('转发', () => data.shareCount || '未知');
        const commentButton = createCopyButton('评论', () => data.commentCount || '未知');

        // 创建特殊按钮（一键复制）
        const specialButton = createSpecialButton('全部', data);

        // 创建复制真正完全数据按钮
        const completeDataButton = document.createElement('button');
        completeDataButton.className = 'tiktok-special-button';
        completeDataButton.textContent = '复制全部数据';
        completeDataButton.style.backgroundColor = '#dc3545'; // 使用不同颜色区分

        completeDataButton.addEventListener('click', () => {
            // 处理点赞数格式
            let formattedDiggCount = data.diggCount || '未知';
            if (typeof formattedDiggCount === 'string') {
                formattedDiggCount = formattedDiggCount.replace(/(\d+(\.\d+)?)([KkMm])/g, (match, num, decimal, unit) => {
                    const multiplier = unit.toUpperCase() === 'K' ? 1000 : 1000000;
                    return Math.round(parseFloat(num) * multiplier);
                });
            }

            // 按照指定格式组织数据
            const copyText = `${accountName}\n${data.followerCount || '未知'}\n${formattedDate}\n\n\n\n\n${'https://www.tiktok.com/@' + accountName}\n${window.location.href}\n\n\n\n\n${data.playCount || '未知'}\n${formattedDiggCount}\n\n${data.collectCount || '未知'}\n${data.shareCount || '未知'}\n${data.commentCount || '未知'}`;

            navigator.clipboard.writeText(copyText).then(() => {
                showNotification('已复制真正完全数据');
            }).catch(err => {
                console.error('复制失败: ', err);
                showNotification('复制失败，请重试');
            });
        });

        // 按顺序添加按钮到容器（全部按钮放在最后）
        container.appendChild(nameButton);
        container.appendChild(followButton);
        container.appendChild(dateButton);
        container.appendChild(homeButton);
        container.appendChild(urlButton);
        container.appendChild(playButton);
        container.appendChild(likeButton);
        container.appendChild(collectButton);
        container.appendChild(shareButton);
        container.appendChild(commentButton);
        container.appendChild(specialButton);  // 全部按钮
        container.appendChild(completeDataButton); // 复制真正完全数据按钮

        // 将容器添加到页面
        document.body.appendChild(container);
    }

    // 提取视频统计信息
    function extractStats() {
        if (!window.location.pathname.includes('/video/')) {
            return; // 只在视频页面运行
        }

        fetch(window.location.href)
            .then(response => response.text())
            .then(responseText => {
                const scriptMatch = responseText.match(/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__" type="application\/json">([\s\S]*?)<\/script>/);
                if (scriptMatch) {
                    try {
                        const jsonData = JSON.parse(scriptMatch[1]);
                        console.log('Attempting to extract data from script tag');
                        const stats = findStats(jsonData);
                        if (stats) {
                            console.log('Video stats found:', stats);
                            extractFollowerCount(stats);
                        } else {
                            console.warn('No relevant stats found in the script tag.');
                            retryExtractStats();
                        }
                    } catch (e) {
                        console.error('Error parsing script tag:', e);
                        retryExtractStats();
                    }
                } else {
                    console.warn('Script tag "__UNIVERSAL_DATA_FOR_REHYDRATION__" not found.');
                    retryExtractStats();
                }
            })
            .catch(error => {
                console.error('Error fetching page:', error);
                retryExtractStats();
            });
    }

    // 重试提取数据
    function retryExtractStats() {
        if (retryCount < 5) {
            setTimeout(() => {
                console.log('Retrying data extraction...');
                retryCount++;
                extractStats();
            }, 2000);
        } else {
            console.warn('Max retry attempts reached. Data extraction failed.');
        }
    }

    // 提取粉丝数量
    function extractFollowerCount(stats) {
        const userUrl = `https://www.tiktok.com/${window.location.pathname.split('/')[1]}`;

        fetch(userUrl)
            .then(response => response.text())
            .then(responseText => {
                const scriptMatch = responseText.match(/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__" type="application\/json">([\s\S]*?)<\/script>/);
                if (scriptMatch) {
                    try {
                        const obj = JSON.parse(scriptMatch[1]);
                        const followerCount = findFollowerCount(obj);
                        if (followerCount !== null) {
                            stats.followerCount = followerCount;
                            createCopyButtons(stats);
                        } else {
                            console.warn('未找到粉丝计数。');
                            createCopyButtons(stats); // 即使没有粉丝数也创建按钮
                        }
                    } catch (error) {
                        console.error('解析 JSON 时出错:', error);
                        createCopyButtons(stats); // 即使出错也创建按钮
                    }
                } else {
                    console.log('未找到包含页面数据的 <script> 标签。');
                    createCopyButtons(stats); // 即使没有找到脚本标签也创建按钮
                }
            })
            .catch(error => {
                console.error('请求用户页面时出错:', error);
                createCopyButtons(stats); // 即使出错也创建按钮
            });
    }

    // 查找视频统计信息
    function findStats(jsonData) {
        let result = {};

        // 尝试从DOM直接获取点赞数
        const likeElement = document.querySelector('strong[data-e2e="like-count"]');
        if (likeElement) {
            result.diggCount = likeElement.textContent.trim();
            console.log('找到点赞数:', result.diggCount);
        }

        // 尝试从DOM直接获取评论数 - 使用多个选择器
        const commentSelectors = [
            'p.css-1nkd8rm-PCommentTitle.ejcng161',
            '[data-e2e="comment-count"]',
            'p[class*="CommentTitle"]',
            'span[class*="comment"]',
            'div[class*="comment"] span',
            'h4[class*="comment"]'
        ];

        let commentFound = false;
        for (const selector of commentSelectors) {
            const commentElement = document.querySelector(selector);
            if (commentElement) {
                const commentText = commentElement.textContent.trim();
                console.log(`使用选择器 ${selector} 找到评论元素:`, commentText);

                // 提取数字部分，例如从"336 条评论"或"336 comments"中提取"336"
                const commentMatch = commentText.match(/(\d+(?:[.,]\d+)*(?:[KkMm])?)/);
                if (commentMatch) {
                    let commentCount = commentMatch[1];
                    // 处理K、M等单位
                    if (commentCount.includes('K') || commentCount.includes('k')) {
                        commentCount = commentCount.replace(/[Kk]/g, '');
                        commentCount = Math.round(parseFloat(commentCount) * 1000);
                    } else if (commentCount.includes('M') || commentCount.includes('m')) {
                        commentCount = commentCount.replace(/[Mm]/g, '');
                        commentCount = Math.round(parseFloat(commentCount) * 1000000);
                    } else {
                        // 移除逗号分隔符
                        commentCount = commentCount.replace(/,/g, '');
                    }
                    result.commentCount = commentCount;
                    console.log('从DOM获取评论数:', result.commentCount);
                    commentFound = true;
                    break;
                }
            }
        }

        if (!commentFound) {
            console.log('未能从DOM获取评论数，将尝试从JSON数据获取');
        }

        // 尝试从DOM直接获取发布时间 - 支持多种日期格式
let dateFound = false;

// 尝试新的HTML结构
const dateElement = document.querySelector('.css-1kcycbd-SpanOtherInfos span:last-child');
if (dateElement) {
    const dateText = dateElement.textContent.trim();
    console.log('找到日期文本:', dateText);

    // 处理完整的年-月-日格式 (如 2024-12-27)
    if (dateText.match(/^\d{4}-\d{1,2}-\d{1,2}$/)) {
        result.publishDate = dateText;
        console.log('从DOM获取完整日期:', result.publishDate);
        dateFound = true;
    }
    // 处理只有月-日格式 (如 6-19)
    else if (dateText.match(/^\d{1,2}-\d{1,2}$/)) {
        // 添加当前年份
        const currentYear = new Date().getFullYear();
        result.publishDate = `${currentYear}-${dateText.replace('-', '-')}`;
        console.log('从DOM获取部分日期并添加年份:', result.publishDate);
        dateFound = true;
    }
    // 处理其他可能的日期格式
    else if (dateText.match(/\d/)) {
        // 尝试提取任何包含数字的文本作为日期
        result.publishDate = dateText;
        console.log('从DOM获取未知格式日期:', result.publishDate);
        dateFound = true;
    }
}

// 如果新结构没找到，尝试旧的HTML结构
if (!dateFound) {
    const authorElement = document.querySelector('span[data-e2e="browser-nickname"]');
    if (authorElement) {
        // 获取最后一个span元素的文本内容（日期）
        const spans = authorElement.querySelectorAll('span');
        if (spans.length >= 3) {
            const dateText = spans[spans.length - 1].textContent.trim();
            if (dateText && dateText.match(/\d/)) {
                result.publishDate = dateText;
                console.log('从旧DOM结构获取日期:', result.publishDate);
                dateFound = true;
            }
        }
    }
}

// 如果还是没找到，尝试更通用的选择器
if (!dateFound) {
    // 尝试查找页面上任何可能包含日期的span元素
    const allSpans = document.querySelectorAll('span');
    for (const span of allSpans) {
        const text = span.textContent.trim();
        // 检查是否包含日期分隔符和数字
        if (text && (text.includes('-') || text.includes('/') || text.includes('.')) && text.match(/\d/)) {
            result.publishDate = text;
            console.log('从通用选择器获取日期:', result.publishDate);
            dateFound = true;
            break;
        }
    }
}

        function recursiveSearch(obj) {
            if (!obj || typeof obj !== 'object') return;

            for (const key in obj) {
                if (key === 'playCount' || key === 'commentCount' ||
                    key === 'shareCount' || key === 'collectCount' || key === 'createTime') {
                    // 如果从DOM已经获取到评论数，则不覆盖
                    if (key === 'commentCount' && result.commentCount) {
                        continue;
                    }
                    result[key] = obj[key];
                }

                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    recursiveSearch(obj[key]);
                }
            }
        }

        recursiveSearch(jsonData);

        // 检查是否找到了至少一个统计数据
        return Object.keys(result).length > 0 ? result : null;
    }

    // 查找粉丝数量
    function findFollowerCount(jsonData) {
        let followerCount = null;

        function recursiveSearch(obj) {
            if (!obj || typeof obj !== 'object') return;

            for (const key in obj) {
                if (key === 'followerCount') {
                    followerCount = obj[key];
                    return;
                }

                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    recursiveSearch(obj[key]);
                }
            }
        }

        recursiveSearch(jsonData);
        return followerCount;
    }

    // 显示通知
    function showNotification(message) {
        Toastify({
            text: message,
            duration: 3000,
            close: true,
            gravity: 'top',
            position: 'center',
            style: {
                background: '#f0f0f0',
                color: '#333',
                borderRadius: '5px',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                border: '1px solid #ddd'
            },
            stopOnFocus: true,
        }).showToast();
    }

    // 注入样式
    injectButtonStyles();

    // 在页面加载完成后运行 extractStats
    window.addEventListener('load', () => {
        console.log('Page fully loaded, attempting to extract stats.');
        extractStats();
    });

    // 监听 URL 变化并重新运行 extractStats
    setInterval(() => {
        if (currentUrl !== window.location.href) {
            console.log('URL changed, attempting to extract stats again.');
            currentUrl = window.location.href;
            retryCount = 0;
            extractStats();
        }
    }, 1000);
})();