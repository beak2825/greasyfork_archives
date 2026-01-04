// ==UserScript==
// @name         复制B站视频信息
// @namespace    https://bilibili.com/
// @version      3.7
// @description  在Bilibili视频页面添加按钮，用于复制UP主昵称、关注数、播放量、点赞、投币、收藏、分享、评论数、发布日期和视频URL
// @author       Punk Deer
// @match        https://www.bilibili.com/video/*
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/524712/%E5%A4%8D%E5%88%B6B%E7%AB%99%E8%A7%86%E9%A2%91%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/524712/%E5%A4%8D%E5%88%B6B%E7%AB%99%E8%A7%86%E9%A2%91%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ===== 工具函数 =====
    /**
     * 处理万/亿等单位，转换成对应的数字
     * @param {string} value - 带单位的数值
     * @returns {number|string} - 转换后的数值
     */
    function convertToNumber(value) {
        const regex = /(\d+(?:\.\d+)?)([万亿])/;
        const match = value.match(regex);

        if (match) {
            const num = parseFloat(match[1]);
            const unit = match[2];

            if (unit === '万') {
                return num * 10000;
            } else if (unit === '亿') {
                return num * 100000000;
            }
        }

        return value; // 如果没有匹配到单位，返回原值
    }

    /**
     * 获取指定选择器的文本内容
     * @param {string} selector - CSS选择器
     * @returns {string|null} - 文本内容或null
     */
    function getTextContent(selector) {
        const element = document.querySelector(selector);
        return element ? element.textContent.trim() : null;
    }

    /**
     * 显示提示框
     * @param {string} message - 提示消息
     */
    function showToast(message) {
        const toast = document.createElement('div');
        toast.innerText = message;
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            backgroundColor: '#323232',
            color: '#fff',
            padding: '10px 15px',
            borderRadius: '5px',
            fontSize: '14px',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.2)',
            zIndex: '9999',
            opacity: '1',
            transition: 'opacity 0.5s ease',
        });

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, 2000);
    }

    /**
     * 复制数据并显示提示
     * @param {string} label - 数据标签
     * @param {*} value - 要复制的值
     */
    function copyAndNotify(label, value) {
        if (value) {
            GM_setClipboard(value);
            showToast(`已复制${label}：${value}`);
        } else {
            showToast(`未能获取${label}，请稍后重试！`);
        }
    }

    /**
     * 检查是否为联合投稿
     * @returns {boolean} - 是否为联合投稿
     */
    function isJointPost() {
        return document.querySelectorAll('.staff-name').length > 0;
    }

    /**
     * 从UP主链接中提取mid
     * @param {string} link - UP主链接
     * @returns {string|null} - UP主ID
     */
    function getMidFromLink(link) {
        const match = link.match(/space\.bilibili\.com\/(\d+)/);
        return match ? match[1] : null;
    }

    /**
     * 获取所有UP主信息
     * @returns {Array<{name: string, mid: string, element: HTMLElement}>} - UP主信息数组
     */
    function getAllUpInfo() {
        const upList = [];
        const staffElements = document.querySelectorAll('.staff-info');

        if (staffElements.length > 0) {
            // 联合投稿
            staffElements.forEach(staff => {
                const nameElement = staff.querySelector('.staff-name');
                if (nameElement) {
                    const name = nameElement.textContent.trim();
                    const link = nameElement.getAttribute('href');
                    const mid = link ? getMidFromLink(link) : null;
                    upList.push({ name, mid, element: staff });
                }
            });
        } else {
            // 单人投稿
            const nameElement = document.querySelector('.up-name');
            if (nameElement) {
                const name = nameElement.textContent.trim();
                const link = nameElement.href;
                const mid = link ? getMidFromLink(link) : null;
                upList.push({ name, mid, element: nameElement });
            }
        }

        return upList;
    }

    /**
     * 显示UP主选择菜单
     * @param {Array} upList - UP主列表
     * @param {string} action - 要执行的动作类型 ('name', 'follow', 'homepage')
     */
    function showUpSelectMenu(upList, action) {
        // 移除已有的菜单
        const existingMenu = document.getElementById('up-select-menu');
        if (existingMenu) {
            existingMenu.remove();
        }

        // 创建菜单
        const menu = document.createElement('div');
        menu.id = 'up-select-menu';
        Object.assign(menu.style, {
            position: 'fixed',
            top: '150px',
            left: '10px',
            backgroundColor: '#fff',
            border: '1px solid #ddd',
            borderRadius: '5px',
            padding: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            zIndex: '10000',
            maxWidth: '250px'
        });

        // 创建标题容器，用于放置标题和关闭按钮
        const titleContainer = document.createElement('div');
        Object.assign(titleContainer.style, {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
            borderBottom: '1px solid #eee',
            paddingBottom: '5px'
        });

        // 添加标题
        const title = document.createElement('div');
        title.textContent = '请选择UP主';
        Object.assign(title.style, {
            fontWeight: 'bold'
        });
        titleContainer.appendChild(title);

        // 添加关闭按钮到右上角
        const closeButton = document.createElement('div');
        closeButton.textContent = '×';
        Object.assign(closeButton.style, {
            cursor: 'pointer',
            color: '#999',
            fontSize: '16px',
            fontWeight: 'bold',
            padding: '0 5px'
        });
        closeButton.addEventListener('click', () => menu.remove());
        closeButton.addEventListener('mouseover', () => {
            closeButton.style.color = '#333';
        });
        closeButton.addEventListener('mouseout', () => {
            closeButton.style.color = '#999';
        });
        titleContainer.appendChild(closeButton);

        menu.appendChild(titleContainer);

        // 添加UP主选项
        upList.forEach(up => {
            const option = document.createElement('div');
            option.textContent = up.name;
            Object.assign(option.style, {
                padding: '5px 10px',
                cursor: 'pointer',
                borderRadius: '3px',
                marginBottom: '5px'
            });

            option.addEventListener('mouseover', () => {
                option.style.backgroundColor = '#f0f0f0';
            });

            option.addEventListener('mouseout', () => {
                option.style.backgroundColor = 'transparent';
            });

            option.addEventListener('click', () => {
                menu.remove();

                // 根据动作类型执行相应操作
                switch (action) {
                    case 'name':
                        copyAndNotify('昵称', up.name);
                        break;
                    case 'follow':
                        if (up.mid) {
                            getUpFollowCount(up.mid, up.name);
                        } else {
                            showToast(`无法获取 ${up.name} 的mid`);
                        }
                        break;
                    case 'homepage':
                        const homepage = `https://space.bilibili.com/${up.mid}`;
                        copyAndNotify('主页链接', homepage);
                        break;
                }
            });

            menu.appendChild(option);
        });

        document.body.appendChild(menu);
    }

    // ===== 数据获取函数 =====
    /**
     * 获取UP主昵称
     * @returns {string|null} - UP主昵称
     */
    function getUpName() {
        const nameElement = document.querySelector('.staff-name');
        if (nameElement) {
            return nameElement.textContent.trim();
        }
        return getTextContent('meta[name="author"]') || getTextContent('.up-name');
    }

    /**
     * 获取UP主关注数
     * @returns {number|null} - 关注数
     */
    function getFollowCount() {
        const followCount = getTextContent('.follow-btn-inner');
        const match = followCount ? followCount.match(/关注\s*([\d.万亿]+)/) : null;
        return match ? convertToNumber(match[1]) : null;
    }

    /**
     * 获取UP主关注数（优化版，同时使用DOM和API）
     * @param {string} mid - UP主ID
     * @param {string} name - UP主昵称
     */
    function getUpFollowCount(mid, name) {
        let dataObtained = false;

        // 显示加载提示
        showToast(`正在获取 ${name} 的关注数...`);

        // 方法1: 尝试从DOM获取（仅适用于非联合投稿）
        function tryGetFollowFromDOM() {
            if (isJointPost()) {
                return false; // 联合投稿不尝试从DOM获取
            }

            const followElement = document.querySelector('.follow-btn-inner');
            if (followElement && followElement.textContent.trim()) {
                const match = followElement.textContent.match(/关注\s*([\d.万亿]+)/);
                if (match && !dataObtained) {
                    const followCount = convertToNumber(match[1]);
                    dataObtained = true;
                    GM_setClipboard(followCount);
                    showToast(`已复制 ${name} 的关注数：${followCount}`);
                    return true;
                }
            }
            return false;
        }

        // 立即尝试从DOM获取
        if (tryGetFollowFromDOM()) {
            return;
        }

        // 方法2: 通过API获取
        const apiUrl = 'https://api.bilibili.com/x/web-interface/card';
        GM_xmlhttpRequest({
            method: "GET",
            url: `${apiUrl}?mid=${mid}&photo=true`,
            onload: function(response) {
                if (dataObtained) return; // 如果已经通过DOM获取到数据，则不处理API结果

                try {
                    const data = JSON.parse(response.responseText);
                    if (data.code === 0 && data.data && data.data.card) {
                        const fansCount = data.data.card.fans;
                        dataObtained = true;
                        GM_setClipboard(fansCount);
                        showToast(`已复制 ${name} 的关注数：${fansCount}`);
                    } else {
                        console.error('获取关注数失败', data);
                        // 再次尝试从DOM获取
                        if (!tryGetFollowFromDOM()) {
                            showToast(`获取 ${name} 的关注数失败: ${data.message || '未知错误'}`);
                        }
                    }
                } catch (e) {
                    console.error('解析响应失败:', e);
                    // 再次尝试从DOM获取
                    if (!tryGetFollowFromDOM()) {
                        showToast(`解析响应失败: ${e.message}`);
                    }
                }
            },
            onerror: function(error) {
                if (!dataObtained) {
                    console.error('请求失败:', error);
                    // 再次尝试从DOM获取
                    if (!tryGetFollowFromDOM()) {
                        showToast('网络请求失败');
                    }
                }
            }
        });

        // 如果不是联合投稿，设置一个轮询，尝试从DOM获取数据
        if (!isJointPost()) {
            let attempts = 0;
            const maxAttempts = 10;
            const interval = setInterval(() => {
                if (dataObtained || attempts >= maxAttempts) {
                    clearInterval(interval);
                    return;
                }

                attempts++;
                tryGetFollowFromDOM();
            }, 100); // 每100ms检查一次
        }
    }

    /**
     * 获取UP主的主页链接
     * @returns {string|null} - UP主主页链接
     */
    function getUpLink() {
        const upLinkElement = document.querySelector('.up-name');
        return upLinkElement ? upLinkElement.href : null;
    }

    /**
     * 获取播放量
     * @returns {number|null} - 播放量
     */
    function getPlayCount() {
        const playCount = getTextContent('.view-text');
        return playCount ? convertToNumber(playCount) : null;
    }

    /**
     * 获取点赞数
     * @returns {number|null} - 点赞数
     */
    function getLikeCount() {
        const likeCount = getTextContent('.video-like-info');
        return likeCount ? convertToNumber(likeCount) : null;
    }

    /**
     * 获取投币数
     * @returns {number|null} - 投币数
     */
    function getCoinCount() {
        const coinCount = getTextContent('.video-coin-info');
        return coinCount ? convertToNumber(coinCount) : null;
    }

    /**
     * 获取收藏数
     * @returns {number|null} - 收藏数
     */
    function getFavoriteCount() {
        const favoriteCount = getTextContent('.video-fav-info');
        return favoriteCount ? convertToNumber(favoriteCount) : null;
    }

    /**
     * 获取分享数
     * @returns {number|null} - 分享数
     */
    function getShareCount() {
        const shareCount = getTextContent('.video-share-info');
        return shareCount ? convertToNumber(shareCount) : null;
    }

    /**
     * 获取 bvid（视频的唯一标识符）
     * @returns {string} - 视频BV号
     */
    function getBvid() {
        return window.location.pathname.split('/')[2];  // 从 URL 中提取 bvid
    }

    /**
     * 获取评论数（优化版，同时使用DOM和API）
     * @param {string} bvid - 视频BV号
     */
    function getCommentCount(bvid) {
        let dataObtained = false;

        // 显示加载提示
        showToast(`正在获取评论数...`);

        // 方法1: 尝试从DOM获取
        function tryGetCommentFromDOM() {
            // 根据提供的DOM结构获取评论数
            const commentElement = document.querySelector('#navbar #count');
            if (commentElement && commentElement.textContent.trim() && !dataObtained) {
                const commentCount = commentElement.textContent.trim();
                dataObtained = true;
                GM_setClipboard(commentCount);
                showToast(`已复制评论数：${commentCount}`);
                return true;
            }
            return false;
        }

        // 立即尝试从DOM获取
        if (tryGetCommentFromDOM()) {
            return;
        }

        // 方法2: 通过API获取
        const apiUrl = `https://api.bilibili.com/x/v2/reply/count?type=1&oid=${bvid}`;
        GM_xmlhttpRequest({
            method: "GET",
            url: apiUrl,
            onload: function(response) {
                if (dataObtained) return; // 如果已经通过DOM获取到数据，则不处理API结果

                try {
                    const data = JSON.parse(response.responseText);
                    if (data.code === 0 && data.data) {
                        const commentCount = data.data.count;
                        dataObtained = true;
                        GM_setClipboard(commentCount);
                        showToast(`已复制评论数：${commentCount}`);
                    } else {
                        console.error('获取评论数失败', data);
                        // 再次尝试从DOM获取
                        if (!tryGetCommentFromDOM()) {
                            showToast(`获取评论数失败: ${data.message || '未知错误'}`);
                        }
                    }
                } catch (e) {
                    console.error('解析响应失败:', e);
                    // 再次尝试从DOM获取
                    if (!tryGetCommentFromDOM()) {
                        showToast(`解析响应失败: ${e.message}`);
                    }
                }
            },
            onerror: function(error) {
                if (!dataObtained) {
                    console.error('请求失败:', error);
                    // 再次尝试从DOM获取
                    if (!tryGetCommentFromDOM()) {
                        showToast('网络请求失败');
                    }
                }
            }
        });

        // 设置一个轮询，尝试从DOM获取数据
        let attempts = 0;
        const maxAttempts = 10;
        const interval = setInterval(() => {
            if (dataObtained || attempts >= maxAttempts) {
                clearInterval(interval);
                return;
            }

            attempts++;
            tryGetCommentFromDOM();
        }, 100); // 每100ms检查一次
    }

    /**
     * 获取发布日期
     * @returns {string|null} - 格式化的发布日期
     */
    function getPublishDate() {
        const dateText = getTextContent('.pubdate-ip-text');
        if (dateText) {
            const date = new Date(dateText.split(' ')[0]);
            return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
        }
        return null;
    }

        /**
     * 获取弹幕数量
     * @returns {number|null} - 弹幕数量
     */
    function getDanmakuCount() {
        const danmakuElement = document.querySelector('.dm-text');
        return danmakuElement ? convertToNumber(danmakuElement.textContent.trim()) : null;
    }

/**
 * 获取并复制全部数据（播放、点赞、投币、收藏、分享、评论、弹幕）
 */
function getAllData() {
    // 保存原始的 GM_setClipboard 函数
    const originalSetClipboard = GM_setClipboard;
    let commentValue = null;
    let commentCaptured = false;

    // 重写 GM_setClipboard 函数来捕获评论数
    GM_setClipboard = function(text) {
        if (!commentCaptured) {
            commentValue = text;
            commentCaptured = true;
            showToast(`已获取评论数：${text}，正在整合其他数据...`);
        }
    };

    // 先触发评论数获取
    const bvid = getBvid();
    if (bvid) {
        getCommentCount(bvid);
    } else {
        showToast('无法获取视频BV号');
        GM_setClipboard = originalSetClipboard; // 恢复原始函数
        return;
    }

    // 等待评论数获取完成后再获取其他数据
    setTimeout(() => {
        // 恢复原始的 GM_setClipboard 函数
        GM_setClipboard = originalSetClipboard;

        // 获取其他数据
        const playCount = getPlayCount() || '';
        const likeCount = getLikeCount() || '';
        const coinCount = getCoinCount() || '';
        const favoriteCount = getFavoriteCount() || '';
        const shareCount = getShareCount() || '';
        const danmakuCount = getDanmakuCount() || '';

        // 格式化为竖向排列的纯数字
        const allData = [
            playCount,
            likeCount,
            coinCount,
            favoriteCount,
            shareCount,
            commentValue || '', // 使用捕获到的评论数
            danmakuCount
        ].join('\n');

        // 复制全部数据
        GM_setClipboard(allData);
        showToast('已复制全部数据（播放、点赞、投币、收藏、分享、评论、弹幕）');
    }, 1500); // 等待1.5秒，确保评论数获取完成
}

    // ===== UI相关函数 =====
    /**
     * 创建按钮
     * @param {string} label - 按钮文本
     * @param {Function} onClick - 点击事件处理函数
     * @returns {HTMLButtonElement} - 创建的按钮
     */
    function createButton(label, onClick) {
        const button = document.createElement('button');
        button.innerText = label;
        Object.assign(button.style, {
            padding: '5px 15px',
            backgroundColor: '#00a1d6',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            fontSize: '14px',
            cursor: 'pointer',
        });
        button.addEventListener('click', onClick);
        return button;
    }

    /**
     * 添加复制按钮
     */
    function addCopyButtons() {
        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'copy-buttons-container';
        Object.assign(buttonContainer.style, {
            position: 'fixed',
            top: '80px',
            left: '10px',
            zIndex: '9999',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
        });

        // 定义按钮配置
        const buttonConfigs = [
            {
                label: '昵称',
                action: () => {
                    const upList = getAllUpInfo();
                    if (upList.length > 1) {
                        showUpSelectMenu(upList, 'name');
                    } else if (upList.length === 1) {
                        copyAndNotify('昵称', upList[0].name);
                    } else {
                        showToast('无法获取UP主昵称');
                    }
                }
            },
            {
                label: '关注',
                action: () => {
                    const upList = getAllUpInfo();
                    if (upList.length > 1) {
                        showUpSelectMenu(upList, 'follow');
                    } else if (upList.length === 1) {
                        if (upList[0].mid) {
                            getUpFollowCount(upList[0].mid, upList[0].name);
                        } else {
                            showToast('无法获取UP主mid');
                        }
                    } else {
                        showToast('无法获取UP主信息');
                    }
                }
            },
            {
                label: '日期',
                action: () => copyAndNotify('日期', getPublishDate())
            },
            {
                label: '主页',
                action: () => {
                    const upList = getAllUpInfo();
                    if (upList.length > 1) {
                        showUpSelectMenu(upList, 'homepage');
                    } else if (upList.length === 1) {
                        const homepage = `https://space.bilibili.com/${upList[0].mid}`;
                        copyAndNotify('主页链接', homepage);
                    } else {
                        showToast('无法获取UP主主页链接');
                    }
                }
            },
            {
                label: 'URL',
                action: () => {
                    // 去除URL参数，保留基础视频地址
                    const cleanURL = window.location.origin + window.location.pathname;
                    copyAndNotify('URL', cleanURL);
                }
            },
            {
                label: '播放',
                action: () => copyAndNotify('播放量', getPlayCount())
            },
            {
                label: '点赞',
                action: () => copyAndNotify('点赞数', getLikeCount())
            },
            {
                label: '投币',
                action: () => copyAndNotify('投币数', getCoinCount())
            },
            {
                label: '收藏',
                action: () => copyAndNotify('收藏数', getFavoriteCount())
            },
            {
                label: '分享',
                action: () => copyAndNotify('分享数', getShareCount())
            },
            {
                label: '评论',
                action: () => {
                    const bvid = getBvid();
                    if (bvid) {
                        getCommentCount(bvid);
                    } else {
                        showToast('无法获取视频BV号');
                    }
                }
            },
            {
                label: '弹幕',
                action: () => copyAndNotify('弹幕数', getDanmakuCount())
    },
    {
        label: '全部',
        action: () => getAllData()
    },
    {
        label: '真全部',
        action: () => {
            // 保存原始的 GM_setClipboard 函数
            const originalSetClipboard = GM_setClipboard;
            let commentValue = null;
            let commentCaptured = false;

            // 重写 GM_setClipboard 函数来捕获评论数
            GM_setClipboard = function(text) {
                if (!commentCaptured) {
                    commentValue = text;
                    commentCaptured = true;
                    showToast(`已获取评论数：${text}，正在整合其他数据...`);
                }
            };

            // 先触发评论数获取
            const bvid = getBvid();
            if (bvid) {
                getCommentCount(bvid);
            } else {
                showToast('无法获取视频BV号');
                GM_setClipboard = originalSetClipboard; // 恢复原始函数
                return;
            }

            // 等待评论数获取完成后再获取其他数据
            setTimeout(() => {
                // 恢复原始的 GM_setClipboard 函数
                GM_setClipboard = originalSetClipboard;

                // 获取UP主信息
                const upList = getAllUpInfo();
                let upName = '';
                let upHomepage = '';

                if (upList.length >= 1) {
                    upName = upList[0].name || '';
                    upHomepage = upList[0].mid ? `https://space.bilibili.com/${upList[0].mid}` : '';
                }

                // 获取关注数（从DOM直接获取，简化处理）
                let followCount = '';
                const followElement = document.querySelector('.follow-btn-inner');
                if (followElement && followElement.textContent.trim()) {
                    const match = followElement.textContent.match(/关注\s*([\d.万亿]+)/);
                    if (match) {
                        followCount = convertToNumber(match[1]);
                    }
                }

                // 获取其他数据
                const publishDate = getPublishDate() || '';
                const videoUrl = window.location.origin + window.location.pathname;
                const playCount = getPlayCount() || '';
                const likeCount = getLikeCount() || '';
                const coinCount = getCoinCount() || '';
                const favoriteCount = getFavoriteCount() || '';
                const danmakuCount = getDanmakuCount() || '';

                // 按照指定格式组织数据
                const completeData = `${upName}\n${followCount}\n${publishDate}\n\n\n\n\n${upHomepage}\n${videoUrl}\n\n\n\n\n${playCount}\n${likeCount}\n${coinCount}\n${favoriteCount}\n${commentValue || ''}\n${danmakuCount}`;

                // 复制全全部
                GM_setClipboard(completeData);
                showToast('已复制完全数据');
            }, 1500); // 等待1.5秒，确保评论数获取完成
        }
    }
];

        // 创建并添加按钮
        buttonConfigs.forEach(config => {
            const button = createButton(config.label, config.action);
            buttonContainer.appendChild(button);
        });

        document.body.appendChild(buttonContainer);
    }

    // 初始化
    window.addEventListener('load', addCopyButtons);
})();