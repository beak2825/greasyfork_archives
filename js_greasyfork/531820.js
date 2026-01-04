// ==UserScript==
// @name         复活玩机器鱼吧
// @namespace    http://tampermonkey.net/
// @version      1.11
// @description  在指定关鱼吧(5496243)页面加载/发帖/评论/回复/点赞 (学习用)
// @author       ysl
// @match        https://yuba.douyu.com/discussion/5496243/posts*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_cookie
// @connect      yuba.douyu.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531820/%E5%A4%8D%E6%B4%BB%E7%8E%A9%E6%9C%BA%E5%99%A8%E9%B1%BC%E5%90%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/531820/%E5%A4%8D%E6%B4%BB%E7%8E%A9%E6%9C%BA%E5%99%A8%E9%B1%BC%E5%90%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 配置常量 ---
    const API_FEED_LIST_URL = 'https://yuba.douyu.com/wgapi/yubanc/api/feed/groupTabFeedList'; // 获取帖子列表 API
    const API_VERIFY_URL = 'https://yuba.douyu.com/wgapi/yubanc/api/feed/publishFeedRiskVerify'; // 发帖风险验证 API
    const API_PUBLISH_URL = 'https://yuba.douyu.com/wgapi/yubanc/api/feed/publish'; // 发布帖子 API
    const API_COMMENT_LIST_URL = 'https://yuba.douyu.com/wgapi/yubanc/api/comment/list'; // 获取评论列表 API
    const API_COMMENT_SEND_URL = 'https://yuba.douyu.com/wgapi/yubanc/api/comment/send'; // 发送评论 API
    const API_REPLY_SEND_URL = 'https://yuba.douyu.com/wgapi/yubanc/api/reply/send'; // 发送回复 API
    const API_LIKE_URL = 'https://yuba.douyu.com/wgapi/yubanc/api/user/like'; // 点赞 API
    const API_UNLIKE_URL = 'https://yuba.douyu.com/wgapi/yubanc/api/user/unlike'; // 取消点赞 API
    const TARGET_GROUP_ID = '5496243'; // 目标鱼吧 ID
    const POST_LIMIT = 30; // 每次加载帖子的数量
    const COMMENT_LIMIT = 10; // 每次加载评论的数量
    const CSRF_COOKIE_NAME = 'acf_yb_t'; // CSRF Token 的 Cookie 名称

    // SVG 图标定义
    const ICONS = {
        like: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="currentColor" fill-rule="evenodd" d="M7.987 1.77C6.057-.017 3.17.098 1.369 2.036-.442 3.983-.379 7.159 1.105 9.328c1.507 2.203 3.995 4.385 5.53 5.626.79.639 1.903.627 2.683-.024 1.494-1.247 3.922-3.42 5.54-5.613 1.578-2.136 1.546-5.355-.257-7.289S9.915-.018 7.987 1.771M2.249 2.854c1.355-1.456 3.481-1.535 4.92-.2l.818.757.817-.758c1.438-1.334 3.563-1.258 4.918.196 1.367 1.466 1.44 4.034.17 5.755-1.53 2.071-3.864 4.168-5.345 5.405a.9.9 0 0 1-1.156.012c-1.524-1.233-3.893-3.322-5.294-5.37C.864 6.847.895 4.31 2.249 2.853" clip-rule="evenodd"></path></svg>`,
        liked: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none"><path fill="url(#dzd_svg__a)" d="M9.318 14.93c-.78.651-1.893.663-2.682.024-1.536-1.241-4.024-3.423-5.531-5.626-1.484-2.17-1.547-5.345.264-7.293C3.171.097 6.057-.018 7.987 1.77 9.915-.018 12.799.094 14.6 2.028c1.803 1.934 1.835 5.153.258 7.289-1.62 2.193-4.047 4.366-5.541 5.614"></path><defs><linearGradient id="dzd_svg__a" x1="0" x2="0" y1="0.5" y2="16" gradientUnits="userSpaceOnUse"><stop stop-color="#FF8990"></stop><stop offset="1" stop-color="#FF515B"></stop></linearGradient></defs></svg>`,
        comment: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none"><path fill="currentColor" fill-rule="evenodd" d="M8 1.6a6.4 6.4 0 0 0-5.512 9.654l.142.24-.848 2.435a.294.294 0 0 0 .362.377l2.607-.786.219.118A6.4 6.4 0 1 0 8 1.6M.4 8a7.6 7.6 0 1 1 4.226 6.811l-2.136.644c-1.168.353-2.243-.769-1.842-1.921l.668-1.915A7.6 7.6 0 0 1 .4 7.999" clip-rule="evenodd"></path></svg>`
    };

    // --- 状态变量 ---
    let currentPostOffset = 0; // 当前加载帖子的偏移量
    let isLoadingPosts = false; // 是否正在加载帖子列表
    let isPosting = false; // 是否正在发布新帖
    let isCommenting = false; // 是否正在提交评论/回复
    let isLiking = {}; // 存储每个帖子的点赞操作状态 { feed_id: boolean }
    const commentStates = {}; // 存储每个帖子的评论加载状态 { feed_id: { offset: number, isLoading: boolean, hasMore: boolean, loaded: boolean } }
    let currentReplyTarget = null; // 当前回复的目标 { feedId, commentId, replyId, nickName, isSubReply }

    // --- 帮助函数：获取 CSRF Token (异步) ---
    /**
     * 使用 GM_cookie 异步获取指定名称的 CSRF Token Cookie。
     * @param {string} name Cookie 名称 (e.g., 'acf_yb_t')
     * @returns {Promise<string>} 返回 Promise，解析为 Cookie 值。
     * @rejects {Error} 如果获取失败或找不到 Cookie。
     */
    async function getCsrfTokenFromGmCookie(name) {
        return new Promise((resolve, reject) => {
            GM_cookie.list({
                name: name,
                domain: 'yuba.douyu.com'
            }, (cookies, error) => {
                if (error) {
                    console.error("GM_cookie.list error:", error);
                    reject(new Error('获取 Cookie 时出错 (GM_cookie)'));
                } else if (cookies && cookies.length > 0) {
                    // 优先查找精确匹配 domain 和 name 的 cookie
                    const targetCookie = cookies.find(c => c.domain.includes('yuba.douyu.com') && c.name === name);
                    if (targetCookie) {
                        console.log(`Found cookie '${name}' via GM_cookie:`, targetCookie);
                        resolve(targetCookie.value);
                    } else if (cookies[0].name === name) {
                        // 降级：如果第一个 cookie 名称匹配，也使用它（可能 domain 略有不同）
                        console.log(`Using first found cookie '${name}' as fallback:`, cookies[0]);
                        resolve(cookies[0].value);
                    } else {
                         // 如果没有找到精确匹配或第一个也不匹配
                        console.error(`Precise cookie '${name}' not found in list:`, cookies);
                        reject(new Error(`无法精确找到 Cookie: ${name}`));
                    }
                } else {
                    console.warn(`Cookie '${name}' not found via GM_cookie.`);
                    reject(new Error(`无法获取 CSRF Token (Cookie: ${name})`));
                }
            });
        });
    }

    // --- 帮助函数：创建并发送 API 请求 ---
    /**
     * 封装 GM_xmlhttpRequest 以发送 API 请求。
     * @param {object} details 请求详情，包含 method, url, headers, data, responseType 等。
     * @returns {Promise<object>} 返回 Promise，解析为 API 的 JSON 响应。
     * @rejects {Error} 如果请求失败 (网络错误、HTTP 错误、API 业务错误)。
     */
    function sendApiRequest(details) {
        return new Promise((resolve, reject) => {
            const isFormData = details.data instanceof FormData;
            const headers = { ...details.headers };

            // 如果是 FormData，GM_xmlhttpRequest 会自动设置 Content-Type，无需手动指定
            if (isFormData) {
                delete headers['Content-Type'];
            }

            GM_xmlhttpRequest({
                method: details.method,
                url: details.url,
                headers: headers,
                data: details.data,
                responseType: 'json', // 期望返回 JSON
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        console.log(`API Response (${details.url}):`, response.response);
                        if (response.response) {
                            // 检查 API 返回的业务错误码
                            // 注意: 斗鱼 API 的 error 字段有时为 0 表示成功，有时为 null 或 undefined 也可能表示成功
                            if (typeof response.response.error !== 'undefined' && response.response.error !== 0 && response.response.error !== null) {
                                console.error(`API Business Error (${details.url}):`, response.response);
                                reject(new Error(response.response.msg || `API返回错误码: ${response.response.error}`));
                            } else {
                                resolve(response.response); // API 业务成功
                            }
                        } else {
                            // 处理空响应或非 JSON 响应 (特殊情况，如点赞、回复可能返回空或非标准 JSON)
                            if (details.url.includes('/like') || details.url.includes('/unlike') || details.url.includes('/reply/send') || details.url.includes('/comment/send') ) {
                                console.log(`API Success (potentially empty/non-JSON response) for ${details.url}`);
                                resolve(response.response || {}); // 返回空对象或原始响应
                            } else {
                                console.error(`API Error (${details.url}): Empty or non-JSON response.`);
                                reject(new Error("API未返回有效JSON数据"));
                            }
                        }
                    } else {
                        console.error(`API HTTP Error (${details.url}):`, response.status, response.statusText, response.response);
                        reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
                    }
                },
                onerror: function(error) {
                    console.error(`API Network Error (${details.url}):`, error);
                    reject(new Error('网络错误，无法连接API'));
                },
                ontimeout: function() {
                    console.error(`API Timeout Error (${details.url})`);
                    reject(new Error('API请求超时'));
                }
            });
        });
    }

    // --- HTML 实体解码 和 简化斗鱼标记处理 ---
    /**
     * 格式化帖子或评论内容，解码 HTML 实体并转换斗鱼特定标记。
     * @param {string} text 原始文本内容。
     * @returns {string} 格式化后的 HTML 字符串。
     */
    function formatPostContent(text) {
        if (!text) return '';

        // 1. 解码 HTML 实体 (如 )
        const textarea = document.createElement('textarea');
        textarea.innerHTML = text.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
                                  .replace(/&/g, '&') // 基本实体也要处理一下
                                  .replace(/</g, '<')
                                  .replace(/>/g, '>')
                                  .replace(/"/g, '"')
                                  .replace(/ /g, ' '); // 处理
        let decodedText = textarea.value;

        // 2. 转换斗鱼特定标记为 HTML
        // [topic src="..."]#话题内容[/topic] -> <span class="post-topic">#话题内容#</span>
        decodedText = decodedText.replace(/\[topic src="[^"]*"]#([^\[]+)\[\/topic]/g, '<span class="post-topic">#$1#</span>');
        // [link src="..." url="..."]链接文字[/link] -> <a href="..." ...>链接文字</a>
        decodedText = decodedText.replace(/\[link src="[^"]*" url="([^"]+)"[^\]]*]([^\[]+)\[\/link]/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="post-link">$2</a>');
        // 转换换行符
        decodedText = decodedText.replace(/\n/g, '<br>');

        return decodedText;
    }

    // --- 渲染单个帖子到容器 ---
    /**
     * 创建并渲染单个帖子的 HTML 元素。
     * @param {object} postData 帖子数据对象。
     * @param {HTMLElement} container 要将帖子添加到的父容器元素。
     */
    function renderPost(postData, container) {
        const postElement = document.createElement('div');
        postElement.className = 'yuba-viewer-post-item';
        postElement.dataset.feedId = postData.feed_id; // 存储 feed_id 以供后续操作使用

        const publisher = postData.publisher || {};
        const group = postData.group || {};
        const feedId = postData.feed_id;
        const isLiked = postData.is_liked || false;
        const likeCount = postData.like_count || 0;
        const commentCount = postData.comment_count || 0;

        // 初始化该帖子的评论状态和点赞状态（如果尚未存在）
        if (!commentStates[feedId]) {
            commentStates[feedId] = { offset: 0, isLoading: false, hasMore: true, loaded: false };
        }
        if (typeof isLiking[feedId] === 'undefined') {
            isLiking[feedId] = false;
        }

        // 构建帖子 HTML
        postElement.innerHTML = `
            <div class="post-header">
                <img class="post-avatar" src="${publisher.avatar || ''}" alt="avatar">
                <div class="post-author-info">
                    <span class="post-nickname">${publisher.nickname || '未知用户'}</span>
                    <span class="post-uid">(UID: ${publisher.uid || 'N/A'})</span>
                    ${group.group_level_title ? `<span class="post-level">${group.group_level_title}</span>` : ''}
                </div>
                <span class="post-timestamp">${new Date(postData.ctime * 1000).toLocaleString()}</span>
            </div>
            <div class="post-body">
                <div class="post-text-content">${formatPostContent(postData.text)}</div>
                ${renderImages(postData.image_video_list)}
            </div>
            <div class="post-footer">
                <button class="like-toggle-button icon-button" data-feed-id="${feedId}" data-liked="${isLiked}" title="${isLiked ? '取消点赞' : '点赞'}">
                    ${isLiked ? ICONS.liked : ICONS.like} <span class="like-count-display">${likeCount > 0 ? likeCount : '赞'}</span>
                </button>
                <button class="view-comments-button icon-button" data-feed-id="${feedId}" title="查看/收起评论">
                    ${ICONS.comment} <span class="comment-count-display">${commentCount > 0 ? commentCount : '评论'}</span>
                </button>
                <span class="locality-display"> | 位置: ${postData.locality || '未知'}</span>
                <a href="${postData.share_url || '#'}" target="_blank" class="share-link"> | 查看原帖</a>
                <span class="like-status" data-feed-id="${feedId}"></span> <!-- 用于显示点赞操作状态 -->
            </div>
            <div class="post-comments-list-container" data-feed-id="${feedId}" style="display: none;">
                <div class="comments-list"></div> <!-- 评论列表将插入此处 -->
                <button class="load-more-comments-button" style="display: none;">加载更多评论</button>
                <div class="comments-load-status" style="font-size: 0.9em; color: #888; margin-top: 5px;"></div>
            </div>
            <div class="post-comment-section" data-feed-id="${feedId}">
                <div class="reply-target-indicator" style="display: none; font-size: 0.9em; color: #555; margin-bottom: 5px;">
                    回复 <span class="reply-target-nickname" style="font-weight: bold;"></span>:
                    <button class="cancel-reply-button" style="margin-left: 5px; font-size: 0.8em; padding: 1px 3px;">取消</button>
                </div>
                <textarea class="comment-input" placeholder="添加评论..." rows="2"></textarea>
                <button class="comment-submit-button">评论</button>
                <div class="comment-status"></div> <!-- 用于显示评论/回复操作状态 -->
            </div>
        `;

        container.appendChild(postElement);

        // 绑定事件监听器
        postElement.querySelector('.comment-submit-button').addEventListener('click', handleCommentSubmit);
        postElement.querySelector('.view-comments-button').addEventListener('click', toggleCommentsView);
        postElement.querySelector('.load-more-comments-button').addEventListener('click', handleLoadMoreComments);
        postElement.querySelector('.like-toggle-button').addEventListener('click', handleLikeToggle);
        postElement.querySelector('.cancel-reply-button').addEventListener('click', cancelReply);
    }

    // --- 设置回复目标 ---
    /**
     * 设置当前要回复的目标（评论或楼中楼），并更新 UI。
     * @param {string} feedId 帖子 ID。
     * @param {string} commentId 顶级评论 ID。
     * @param {string|null} replyId 楼中楼回复的 ID (如果回复的是楼中楼)，否则为 null。
     * @param {string} nickName 被回复者的昵称。
     * @param {boolean} isSubReply 是否是回复楼中楼。
     */
    function setReplyTarget(feedId, commentId, replyId, nickName, isSubReply) {
        currentReplyTarget = { feedId, commentId, replyId, nickName, isSubReply };
        const postItem = document.querySelector(`.yuba-viewer-post-item[data-feed-id="${feedId}"]`);
        if (!postItem) return;

        const indicator = postItem.querySelector('.reply-target-indicator');
        const nicknameSpan = indicator.querySelector('.reply-target-nickname');
        const textarea = postItem.querySelector('.comment-input');

        nicknameSpan.textContent = nickName;
        indicator.style.display = 'block';
        textarea.placeholder = `回复 ${nickName}:`;
        textarea.focus(); // 聚焦输入框
    }

    // --- 取消回复 ---
    /**
     * 取消当前的回复状态，并重置 UI。
     * @param {Event} event 点击事件对象。
     */
    function cancelReply(event) {
        currentReplyTarget = null;
        const postItem = event.target.closest('.yuba-viewer-post-item');
        if (!postItem) return;

        const indicator = postItem.querySelector('.reply-target-indicator');
        const textarea = postItem.querySelector('.comment-input');

        indicator.style.display = 'none';
        textarea.placeholder = '添加评论...';
    }

    // --- 处理点赞/取消点赞切换 ---
    /**
     * 处理点赞按钮的点击事件，发送点赞或取消点赞请求。
     * @param {Event} event 点击事件对象。
     */
    async function handleLikeToggle(event) {
        const button = event.currentTarget;
        const feedId = button.dataset.feedId;
        const currentlyLiked = button.dataset.liked === 'true';
        const likeStatusSpan = document.querySelector(`.like-status[data-feed-id="${feedId}"]`);
        const likeCountSpan = button.querySelector('.like-count-display');

        // 防止重复点击
        if (isLiking[feedId]) return;
        isLiking[feedId] = true;
        button.disabled = true;
        if (likeStatusSpan) likeStatusSpan.textContent = '处理中...';

        let csrfToken;
        try {
            csrfToken = await getCsrfTokenFromGmCookie(CSRF_COOKIE_NAME);
            if (!csrfToken) throw new Error(`无法获取 CSRF Token`);

            const targetUrl = currentlyLiked ? API_UNLIKE_URL : API_LIKE_URL;
            const actionName = currentlyLiked ? '取消点赞' : '点赞';
            const requestData = new URLSearchParams({ 'feed_id': feedId }).toString();

            console.log(`${actionName} Request Data for feed ${feedId}:`, requestData);
            await sendApiRequest({
                method: 'POST',
                url: targetUrl,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRF-Token': csrfToken,
                    'Accept': 'application/json'
                },
                data: requestData
            });

            // 更新 UI
            const newLikedState = !currentlyLiked;
            button.dataset.liked = newLikedState;
            button.title = newLikedState ? '取消点赞' : '点赞';
            if (likeStatusSpan) likeStatusSpan.textContent = `${actionName}成功!`;

            // 更新点赞数显示
            if (likeCountSpan) {
                let currentCount = 0;
                const countText = likeCountSpan.textContent.trim();
                 // 尝试从文本中提取数字，如果不是数字（如“赞”），则视为 0
                const countMatch = countText.match(/\d+/);
                if (countMatch) {
                    currentCount = parseInt(countMatch[0], 10);
                }

                currentCount = newLikedState ? currentCount + 1 : Math.max(0, currentCount - 1); // 增加或减少计数
                // 更新按钮内部 HTML，保留图标和新的计数
                 button.innerHTML = `${newLikedState ? ICONS.liked : ICONS.like} <span class="like-count-display">${currentCount > 0 ? currentCount : '赞'}</span>`;
            }

            console.log(`${actionName} successful for feed ${feedId}`);

        } catch (error) {
            console.error(`${currentlyLiked ? '取消点赞' : '点赞'}失败:`, error);
            if (likeStatusSpan) likeStatusSpan.textContent = `${currentlyLiked ? '取消点赞' : '点赞'}失败: ${error.message}`;
            // 失败时 UI 状态回滚可能比较复杂，暂时只显示错误信息
        } finally {
            isLiking[feedId] = false;
            button.disabled = false;
            // 延迟清除状态信息
            setTimeout(() => {
                if (likeStatusSpan) likeStatusSpan.textContent = '';
            }, 3000);
        }
    }

    // --- 切换评论区显示/隐藏 ---
    /**
     * 处理“查看/收起评论”按钮的点击事件。
     * @param {Event} event 点击事件对象。
     */
    function toggleCommentsView(event) {
        const button = event.currentTarget;
        const feedId = button.dataset.feedId;
        const commentsContainer = document.querySelector(`.post-comments-list-container[data-feed-id="${feedId}"]`);
        if (!commentsContainer) return;

        const isVisible = commentsContainer.style.display !== 'none';
        if (isVisible) {
            commentsContainer.style.display = 'none';
            button.title = '查看评论';
        } else {
            commentsContainer.style.display = 'block';
            button.title = '收起评论';
            // 如果评论尚未加载过，则触发加载
            if (!commentStates[feedId].loaded) {
                fetchAndRenderComments(feedId);
            }
        }
    }

    // --- 加载更多评论的处理 ---
    /**
     * 处理“加载更多评论”按钮的点击事件。
     * @param {Event} event 点击事件对象。
     */
    function handleLoadMoreComments(event) {
        const button = event.target;
        const feedId = button.closest('.post-comments-list-container').dataset.feedId;
        fetchAndRenderComments(feedId);
    }

    // --- 渲染图片 ---
    /**
     * 根据 image_video_list 数据生成图片 HTML。
     * @param {Array<object>} imageVideoList 包含图片/视频信息的数组。
     * @returns {string} 包含所有图片 <img> 标签的 HTML 字符串。
     */
    function renderImages(imageVideoList) {
        if (!imageVideoList || imageVideoList.length === 0) return '';
        let imagesHTML = '<div class="post-images-container">';
        imageVideoList.forEach(item => {
            // 只处理图片类型 (type === 1) 且包含有效图片数据
            if (item.type === 1 && item.images && item.images.images && item.images.images.length > 0) {
                item.images.images.forEach(imgData => {
                    // 使用 <a> 标签包裹 <img>，允许点击查看原图
                    imagesHTML += `<a href="${imgData.url}" target="_blank" title="点击查看原图"><img src="${imgData.url}" alt="帖子图片" class="post-image"></a>`;
                });
            }
            // 可以在此添加对视频类型的处理 (if item.type === 2)
        });
        imagesHTML += '</div>';
        return imagesHTML;
    }

    // --- 获取并渲染帖子列表 ---
    /**
     * 异步获取帖子列表数据并渲染到页面。
     */
    async function fetchAndRenderPosts() {
        if (isLoadingPosts) return; // 防止重复加载
        isLoadingPosts = true;
        updateMainStatus('正在加载帖子...');
        setLoadMorePostsButtonState(false, '加载中...'); // 禁用按钮并显示加载中

        const apiUrl = new URL(API_FEED_LIST_URL);
        const params = {
            group_id: TARGET_GROUP_ID,
            group_tab_id: 1, // 通常是默认的帖子列表 tab
            offset: currentPostOffset,
            limit: POST_LIMIT,
            data_type: 3, // 可能是某种数据类型标识
            sink_feeds_status: 0, // 可能与置底/沉帖相关
            sink_offset: 0 // 可能与置底/沉帖相关
        };
        Object.keys(params).forEach(key => apiUrl.searchParams.append(key, params[key]));

        try {
            const response = await sendApiRequest({
                method: 'GET',
                url: apiUrl.toString(),
                headers: { 'Accept': 'application/json' }
            });

            const postContainer = document.getElementById('yuba-viewer-post-list');
            if (!postContainer) return; // 容器不存在则退出

            if (response && response.data && Array.isArray(response.data.feed_list)) {
                const feedList = response.data.feed_list;
                if (feedList.length > 0) {
                    feedList.forEach(post => renderPost(post, postContainer));
                    // 更新下一次请求的偏移量
                    currentPostOffset = response.data.next_offset || (currentPostOffset + feedList.length);
                    updateMainStatus(`已加载 ${postContainer.children.length} 条帖子`);

                    // 检查是否还有更多帖子
                    const hasMore = typeof response.data.has_more !== 'undefined' ? response.data.has_more : (feedList.length === POST_LIMIT);
                    if (hasMore) {
                        setLoadMorePostsButtonState(true, '加载更多帖子'); // 启用按钮
                    } else {
                        updateMainStatus(`已加载全部 ${postContainer.children.length} 条帖子`);
                        setLoadMorePostsButtonState(false, '已加载全部'); // 禁用按钮并提示已全部加载
                    }
                } else {
                    // 没有更多帖子了
                    updateMainStatus(currentPostOffset === 0 ? '该鱼吧没有帖子' : `已加载全部 ${postContainer.children.length} 条帖子`);
                    setLoadMorePostsButtonState(false, '没有更多帖子了');
                }
            } else {
                // API 返回的数据格式不符合预期
                updateMainStatus('未能获取帖子数据或列表为空');
                setLoadMorePostsButtonState(false, '加载失败或无数据');
            }
        } catch (error) {
            updateMainStatus(`加载帖子失败: ${error.message}`);
            setLoadMorePostsButtonState(true, '加载失败，点击重试'); // 允许用户重试
        } finally {
            isLoadingPosts = false; // 请求完成，解除锁定
        }
    }

    // --- 获取并渲染评论列表 ---
    /**
     * 异步获取指定帖子的评论列表并渲染。
     * @param {string} feedId 帖子 ID。
     */
    async function fetchAndRenderComments(feedId) {
        const state = commentStates[feedId];
        // 如果状态不存在、正在加载或没有更多评论，则直接返回
        if (!state || state.isLoading || !state.hasMore) return;

        state.isLoading = true;
        const commentsListDiv = document.querySelector(`.post-comments-list-container[data-feed-id="${feedId}"] .comments-list`);
        const loadMoreButton = document.querySelector(`.post-comments-list-container[data-feed-id="${feedId}"] .load-more-comments-button`);
        const statusDiv = document.querySelector(`.post-comments-list-container[data-feed-id="${feedId}"] .comments-load-status`);

        if (!commentsListDiv || !loadMoreButton || !statusDiv) return; // 确保元素存在

        statusDiv.textContent = '加载评论中...';
        loadMoreButton.style.display = 'none'; // 隐藏加载按钮

        const apiUrl = new URL(API_COMMENT_LIST_URL);
        const params = {
            feed_id: feedId,
            group_id: TARGET_GROUP_ID,
            limit: COMMENT_LIMIT,
            sort: 1, // 排序方式，1 可能表示按时间倒序
            offset: state.offset // 当前评论偏移量
        };
        Object.keys(params).forEach(key => apiUrl.searchParams.append(key, params[key]));

        try {
            const response = await sendApiRequest({
                method: 'GET',
                url: apiUrl.toString(),
                headers: { 'Accept': 'application/json' }
            });

            console.log(`Comment list response for feed ${feedId}:`, JSON.stringify(response, null, 2)); // 详细日志记录

            if (response && response.data && Array.isArray(response.data.comments)) {
                const commentList = response.data.comments;
                if (commentList.length > 0) {
                    commentList.forEach(comment => renderComment(comment, commentsListDiv, feedId));
                    // 更新下一次请求的偏移量
                    state.offset = response.data.next_offset || (state.offset + commentList.length);
                    statusDiv.textContent = ''; // 清除加载状态

                    // 检查是否还有更多评论
                    // 注意：next_offset 为 "0" 或 0 时通常表示没有更多了
                    const hasMore = typeof response.data.has_more !== 'undefined' ? response.data.has_more : (commentList.length === COMMENT_LIMIT && response.data.next_offset !== "0" && response.data.next_offset !== 0);

                    if (hasMore) {
                        state.hasMore = true;
                        loadMoreButton.style.display = 'block'; // 显示加载更多按钮
                        loadMoreButton.disabled = false;
                        loadMoreButton.textContent = '加载更多评论';
                    } else {
                        state.hasMore = false;
                        loadMoreButton.style.display = 'none'; // 隐藏按钮
                        statusDiv.textContent = '已加载全部评论'; // 提示已全部加载
                    }
                } else {
                    // 本次请求没有返回评论
                    state.hasMore = false;
                    loadMoreButton.style.display = 'none';
                    statusDiv.textContent = state.offset === 0 ? '暂无评论' : '已加载全部评论'; // 区分是本来就没评论还是加载完了
                }
                state.loaded = true; // 标记该帖子的评论至少加载过一次
            } else {
                statusDiv.textContent = '未能获取评论数据或列表为空';
                state.hasMore = false; // 标记为没有更多
                loadMoreButton.style.display = 'none';
            }
        } catch (error) {
            statusDiv.textContent = `加载评论失败: ${error.message}`;
            // 允许重试
            if(state.hasMore) { // 只有在理论上还有更多时才显示重试按钮
                 loadMoreButton.style.display = 'block';
                 loadMoreButton.disabled = false;
                 loadMoreButton.textContent = '加载失败，点击重试';
            } else {
                 loadMoreButton.style.display = 'none'; // 如果已经没有更多了，失败了也不显示
            }
        } finally {
            state.isLoading = false; // 请求完成，解除锁定
        }
    }


    // --- 渲染单条评论 (包括楼中楼) ---
    /**
     * 创建并渲染单条顶级评论及其楼中楼回复。
     * @param {object} commentData 评论数据对象。
     * @param {HTMLElement} container 评论列表容器。
     * @param {string} feedId 所属帖子的 ID。
     */
    function renderComment(commentData, container, feedId) {
        console.log(`Rendering comment ID: ${commentData.comment_id || commentData.comment_id_str}`, "Data:", JSON.stringify(commentData, null, 2));

        const commentElement = document.createElement('div');
        commentElement.className = 'yuba-viewer-comment-item';

        // !! 关键: 优先使用 comment_id_str，因为它通常是准确的字符串 ID，comment_id 可能是数字，可能导致精度问题
        const topCommentId = commentData.comment_id_str || String(commentData.comment_id); // 确保是字符串
        commentElement.dataset.commentId = topCommentId; // 用于回复时定位顶级评论
        commentElement.dataset.nickName = commentData.nick_name || '未知用户'; // 存储昵称方便回复时引用
        commentElement.dataset.isSubReply = 'false'; // 标记这是顶级评论

        // 渲染楼中楼回复 (如果存在)
        const subCommentsHTML = commentData.sub_replies && commentData.sub_replies.length > 0
            ? renderSubComments(commentData.sub_replies, feedId, topCommentId) // 传递 feedId 和 topCommentId
            : '';

        // 构建评论 HTML
        commentElement.innerHTML = `
            <div class="comment-header">
                 <img class="comment-avatar" src="${commentData.avatar || ''}" alt="avatar">
                 <span class="comment-nickname">${commentData.nick_name || '未知用户'}</span>
                 <span class="comment-timestamp">${new Date(commentData.created_ts * 1000).toLocaleString()}</span>
                 <span class="comment-locality">${commentData.locality ? ` | ${commentData.locality}` : ''}</span>
                 <button class="reply-button" data-is-sub-reply="false" style="margin-left: 10px; font-size:0.8em; cursor:pointer; color:#888;">回复</button>
            </div>
            <div class="comment-content">${formatPostContent(commentData.content)}</div>
            ${subCommentsHTML} <!-- 插入楼中楼 HTML -->
        `;
        container.appendChild(commentElement);

        // 为这个评论元素内的所有回复按钮（包括楼中楼里的）绑定事件
        bindReplyButtons(commentElement, feedId, topCommentId);
    }

    // --- 渲染楼中楼回复 (子评论) ---
    /**
     * 创建并渲染楼中楼回复的 HTML。
     * @param {Array<object>} subReplies 楼中楼回复数据数组。
     * @param {string} feedId 所属帖子的 ID。
     * @param {string} topCommentId 所属顶级评论的 ID。
     * @returns {string} 包含所有楼中楼回复的 HTML 字符串。
     */
    function renderSubComments(subReplies, feedId, topCommentId) {
        console.log("Rendering sub-comments for top comment:", topCommentId, "Data:", JSON.stringify(subReplies, null, 2));
        let subHTML = '<div class="sub-comments-container">';
        subReplies.forEach(reply => {
            const user = reply; // API 返回结构中，回复者信息直接在顶层
            const targetUser = reply.target_user_info || {}; // 被回复者信息

            // !! 关键: 使用 comment_reply_id 作为楼中楼回复的唯一标识符
            const replyId = reply.comment_reply_id; // replyId 用于回复楼中楼时指定目标

            // 必须要有 replyId 才能进行后续的回复操作
            if (!replyId) {
                console.warn("Sub-reply missing 'comment_reply_id':", reply);
                return; // 跳过没有有效 ID 的回复
            }

            subHTML += `
                 <div class="sub-comment-item" data-reply-id="${replyId}" data-nick-name="${user.nick_name || '?'}"> <!-- 存储 replyId 和昵称 -->
                     <span class="comment-nickname">${user.nick_name || '?'}</span>
                     ${targetUser.uid && targetUser.nick_name ? ` 回复 <span class="comment-nickname">${targetUser.nick_name}</span>` : ''}:
                     <span class="sub-comment-content">${formatPostContent(reply.content)}</span>
                     <button class="reply-button sub-reply-button" data-is-sub-reply="true" style="margin-left: 5px; font-size:0.8em; cursor:pointer; color:#888;">回复</button>
                 </div>
             `;
        });
        subHTML += '</div>';
        return subHTML;
    }


    // --- 统一绑定回复按钮事件 ---
    /**
     * 为指定父元素下的所有回复按钮（顶级评论和楼中楼）绑定点击事件。
     * @param {HTMLElement} parentElement 包含回复按钮的父元素 (通常是 .yuba-viewer-comment-item)。
     * @param {string} feedId 帖子 ID。
     * @param {string} topCommentId 顶级评论 ID。
     */
    function bindReplyButtons(parentElement, feedId, topCommentId) {
        parentElement.querySelectorAll('.reply-button').forEach(button => {
            // 防止重复绑定监听器
            if (button.dataset.listenerAttached) return;

            button.addEventListener('click', (e) => {
                const targetButton = e.currentTarget;
                const isSubReply = targetButton.dataset.isSubReply === 'true'; // 判断是回复顶级评论还是楼中楼

                let replyId = null; // 楼中楼回复的目标 ID
                let nickName = '未知用户';

                if (isSubReply) {
                    // 如果是回复楼中楼，找到对应的 .sub-comment-item 获取 replyId 和 nickName
                    const subItem = targetButton.closest('.sub-comment-item');
                    if (subItem) {
                        replyId = subItem.dataset.replyId; // 获取楼中楼自身的 ID
                        nickName = subItem.dataset.nickName; // 获取这条楼中楼发布者的昵称
                    }
                } else {
                    // 如果是回复顶级评论，找到对应的 .yuba-viewer-comment-item 获取 nickName
                    const topItem = targetButton.closest('.yuba-viewer-comment-item');
                    if (topItem) {
                        nickName = topItem.dataset.nickName; // 获取顶级评论发布者的昵称
                        // replyId 保持为 null
                    }
                }

                console.log("Reply button clicked:", { feedId, topCommentId, replyId, nickName, isSubReply });

                // 验证获取到的 ID 是否有效
                if (isSubReply && !replyId) {
                    console.error("无法获取有效的子评论 replyId！请检查 renderSubComments 或 API 响应。 Sub Item:", targetButton.closest('.sub-comment-item'));
                    alert("无法获取回复目标的 ID (子评论)，请检查脚本或 API 响应。");
                    return;
                }
                if (!topCommentId) {
                    console.error("无法获取有效的顶级评论 commentId！");
                    alert("无法获取顶级评论 ID，请检查脚本或 API 响应。");
                    return;
                }

                // 设置全局回复目标
                setReplyTarget(feedId, topCommentId, replyId, nickName, isSubReply);
            });
            button.dataset.listenerAttached = 'true'; // 标记已绑定
        });
    }


    // --- 处理发新帖 ---
    /**
     * 处理“发布新帖”按钮的点击事件，执行发帖流程。
     */
    async function handlePostSubmit() {
        if (isPosting) return; // 防止重复提交
        const postContentInput = document.getElementById('new-post-content');
        const postButton = document.getElementById('new-post-submit-button');
        const postStatusDiv = document.getElementById('new-post-status');
        const textContent = postContentInput.value.trim();

        if (!textContent) {
            postStatusDiv.textContent = '错误：帖子内容不能为空';
            postStatusDiv.style.color = 'red';
            return;
        }

        isPosting = true;
        postButton.disabled = true;
        postButton.textContent = '发布中...';
        postStatusDiv.textContent = '正在发布...';
        postStatusDiv.style.color = '#888';

        let csrfToken;
        try {
            // --- 步骤 0: 获取 CSRF Token ---
            updateMainStatus('获取 CSRF Token...');
            csrfToken = await getCsrfTokenFromGmCookie(CSRF_COOKIE_NAME);
            if (!csrfToken) throw new Error(`无法获取 CSRF Token`);
            updateMainStatus('CSRF Token 获取成功');

            // --- 步骤 1: 风险验证 (获取 req_id) ---
            let reqId = null;
            try {
                updateMainStatus('发帖步骤 1: 请求风险验证...');
                const verifyData = new URLSearchParams({
                    'text': textContent,
                    'face_names': '[]', // 表情名称，暂时不支持
                    'has_image': 'false', // 是否有图片，暂时不支持
                    'has_video': 'false', // 是否有视频，暂时不支持
                    'feed_scope': '1' // 帖子范围，1 通常表示普通帖
                }).toString();

                console.log("Verify Post Request Data:", verifyData);
                const verifyResponse = await sendApiRequest({
                    method: 'POST',
                    url: API_VERIFY_URL,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-CSRF-Token': csrfToken,
                        'Accept': 'application/json'
                    },
                    data: verifyData
                });

                // 检查验证响应是否包含 req_id
                if (!verifyResponse || !verifyResponse.data || typeof verifyResponse.data.req_id === 'undefined') {
                    throw new Error('发帖验证响应格式错误，未找到 req_id');
                }
                reqId = verifyResponse.data.req_id;
                updateMainStatus(`发帖步骤 1 成功！ req_id: ${reqId}`);
                console.log('Got post req_id:', reqId);
            } catch (error) {
                updateMainStatus(`发帖步骤 1 失败: ${error.message}`);
                throw error; // 抛出错误，中断后续步骤
            }

            // --- 步骤 2: 正式发布帖子 ---
            try {
                updateMainStatus('发帖步骤 2: 发布帖子...');
                const msgId = `${Date.now()}${Math.random()}`; // 生成一个本地唯一的消息 ID
                console.log('Generated post msg_id:', msgId);

                const publishData = new URLSearchParams({
                    'req_id': reqId, // 使用上一步获取的 req_id
                    'msg_id': msgId, // 本地生成的消息 ID
                    'text': textContent,
                    'channel_id': '0', // 频道 ID，通常为 0
                    'group_id': TARGET_GROUP_ID, // 目标鱼吧 ID
                    'feed_scope': '1', // 帖子范围
                    'face_names': '[]' // 表情
                    // 这里可以根据需要添加图片、视频等参数
                }).toString();

                console.log("Publish Post Request Data:", publishData);
                const publishResponse = await sendApiRequest({
                    method: 'POST',
                    url: API_PUBLISH_URL,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-CSRF-Token': csrfToken,
                        'Accept': 'application/json'
                    },
                    data: publishData
                });

                 // 检查发布响应是否成功 (通常会返回 feed_id)
                if (!publishResponse || !publishResponse.data || typeof publishResponse.data.feed_id === 'undefined') {
                    // 有些成功响应可能没有 feed_id，但 error 为 0 或 null
                    if (publishResponse.error !== 0 && publishResponse.error !== null) {
                         throw new Error(publishResponse.msg || '帖子发布响应格式错误，未找到 feed_id 且 error 不为 0/null');
                    }
                    // 如果 error 为 0 或 null 但没有 feed_id，也视为成功，但给个提示
                     postStatusDiv.textContent = `帖子发布成功！(未返回 Feed ID)`;
                     console.log('New post successful (no feed_id returned):', publishResponse);
                } else {
                    postStatusDiv.textContent = `帖子发布成功！Feed ID: ${publishResponse.data.feed_id}`;
                    console.log('New post successful:', publishResponse);
                }

                postStatusDiv.style.color = 'green';
                postContentInput.value = ''; // 清空输入框

                // 发布成功后刷新帖子列表
                currentPostOffset = 0; // 重置偏移量
                document.getElementById('yuba-viewer-post-list').innerHTML = ''; // 清空现有列表
                fetchAndRenderPosts(); // 重新加载第一页
                updateMainStatus('新帖发布成功，刷新列表...');

            } catch (error) {
                updateMainStatus(`发帖步骤 2 失败: ${error.message}`);
                throw error; // 抛出错误
            }

        } catch (error) {
            console.error("发帖失败:", error);
            postStatusDiv.textContent = `发帖失败: ${error.message}`;
            postStatusDiv.style.color = 'red';
        } finally {
            isPosting = false; // 解除锁定
            postButton.disabled = false;
            postButton.textContent = '发布新帖';
            // 延迟清除状态信息
            setTimeout(() => {
                if (postStatusDiv) postStatusDiv.textContent = '';
            }, 5000);
        }
    }


    // --- 处理评论/回复提交 ---
    /**
     * 处理评论/回复按钮的点击事件。
     * @param {Event} event 点击事件对象。
     */
    async function handleCommentSubmit(event) {
        if (isCommenting) return; // 防止重复提交
        const button = event.target;
        const postItem = button.closest('.yuba-viewer-post-item');
        const commentSection = button.closest('.post-comment-section');
        const textarea = commentSection.querySelector('.comment-input');
        const commentStatusDiv = commentSection.querySelector('.comment-status');
        const feedId = postItem.dataset.feedId;
        const content = textarea.value.trim();

        if (!content || !feedId) {
            commentStatusDiv.textContent = '错误：内容或帖子ID无效';
            commentStatusDiv.style.color = 'red';
            return;
        }

        isCommenting = true;
        button.disabled = true;
        button.textContent = '提交中...';
        commentStatusDiv.textContent = '正在提交...';
        commentStatusDiv.style.color = '#888';

        let csrfToken;
        try {
            csrfToken = await getCsrfTokenFromGmCookie(CSRF_COOKIE_NAME);
            if (!csrfToken) throw new Error(`无法获取 CSRF Token`);

            let apiUrl;
            let requestParams = {};
            let actionType = "评论"; // 用于日志

            // 判断是回复还是新评论
            if (currentReplyTarget && currentReplyTarget.feedId === feedId) {
                // --- 是回复 ---
                apiUrl = API_REPLY_SEND_URL;
                actionType = "回复";
                requestParams = {
                    'content_version': '2', // 内容版本，通常是 2
                    'comment_id': currentReplyTarget.commentId, // 必须提供顶级评论 ID
                    'group_id': TARGET_GROUP_ID,
                    'feed_id': feedId,
                    'content': content,
                };
                // 如果是回复楼中楼 (子回复)，需要添加目标回复 ID
                if (currentReplyTarget.isSubReply && currentReplyTarget.replyId) {
                    requestParams['dst_comment_reply_id'] = currentReplyTarget.replyId; // 使用正确的子评论 ID (comment_reply_id)
                }
                console.log("Reply Request Data:", requestParams);
            } else {
                // --- 是新评论 ---
                apiUrl = API_COMMENT_SEND_URL;
                actionType = "评论";
                requestParams = {
                    'group_id': TARGET_GROUP_ID,
                    'feed_id': feedId,
                    'content_version': '2',
                    'content': content,
                    // 可能还需要其他参数，如 source_type 等，根据实际抓包情况调整
                };
                console.log("Comment Request Data:", requestParams);
            }

            // 发送请求
            const requestData = new URLSearchParams(requestParams).toString();
            const response = await sendApiRequest({
                method: 'POST',
                url: apiUrl,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRF-Token': csrfToken,
                    'Accept': 'application/json'
                },
                data: requestData
            });

            console.log(`${actionType} Response:`, response);
            commentStatusDiv.textContent = `${actionType}成功！`;
            commentStatusDiv.style.color = 'green';
            textarea.value = ''; // 清空输入框

            // 如果是回复，则取消回复状态
            if (currentReplyTarget && currentReplyTarget.feedId === feedId) {
                // 手动触发取消回复的逻辑，传入关联的按钮元素
                const cancelButton = commentSection.querySelector('.cancel-reply-button');
                 if (cancelButton) {
                     cancelReply({ target: cancelButton }); // 模拟事件对象传递按钮本身
                 }
            }

            // 更新帖子上的评论数 (如果是新评论)
            // 注意：回复楼中楼通常不直接增加帖子主评论数，所以只在非回复或回复顶级评论时增加？
            // API 设计可能不同，保险起见，提交成功后总是刷新评论列表更可靠
            /*
            if (!currentReplyTarget || (currentReplyTarget && !currentReplyTarget.isSubReply)) {
                 const countSpan = postItem.querySelector('.comment-count-display');
                 if (countSpan) {
                     let currentCount = 0;
                     const countMatch = countSpan.textContent.match(/\d+/);
                     if (countMatch) {
                         currentCount = parseInt(countMatch[0], 10);
                     }
                     // API 可能在后台自己增加计数，前端简单+1可能不准，最好是刷新
                     countSpan.textContent = `${currentCount > 0 ? currentCount + 1 : 1}`;
                 }
            }
            */

            // 刷新评论列表以显示新评论/回复
            const commentsListDiv = postItem.querySelector('.post-comments-list-container .comments-list');
            const commentsContainer = postItem.querySelector('.post-comments-list-container');
            // 只有当评论区可见时才立即刷新
            if (commentsListDiv && commentsContainer && commentsContainer.style.display !== 'none') {
                commentsListDiv.innerHTML = ''; // 清空现有评论
                commentStates[feedId].offset = 0; // 重置评论偏移量
                commentStates[feedId].hasMore = true; // 假设刷新后可能有更多（让加载逻辑重新判断）
                commentStates[feedId].loaded = false; // 标记为未加载，强制重新请求
                fetchAndRenderComments(feedId); // 重新加载评论
                updateMainStatus(`${actionType}成功，刷新评论列表...`);
            } else {
                 // 如果评论区不可见，只需重置状态，下次打开时会刷新
                 commentStates[feedId].offset = 0;
                 commentStates[feedId].hasMore = true;
                 commentStates[feedId].loaded = false;
                 updateMainStatus(`${actionType}成功！`);
                 // 可以考虑更新评论数显示
                 const countSpan = postItem.querySelector('.comment-count-display');
                 if(countSpan) {
                     const currentCountText = countSpan.textContent.trim();
                     let currentCount = 0;
                     const countMatch = currentCountText.match(/\d+/);
                     if(countMatch) currentCount = parseInt(countMatch[0], 10);
                     else if(currentCountText === '评论') currentCount = 0; // 处理初始为“评论”的情况

                     // 简单+1，可能不完全精确，但比不更新好
                     countSpan.textContent = `${currentCount + 1}`;
                 }
            }

        } catch (error) {
            console.error(`${actionType}失败:`, error);
            commentStatusDiv.textContent = `${actionType}失败: ${error.message}`;
            commentStatusDiv.style.color = 'red';
        } finally {
            isCommenting = false; // 解除锁定
            button.disabled = false;
            button.textContent = '评论'; // 恢复按钮文字
            // 延迟清除状态信息
            setTimeout(() => {
                if (commentStatusDiv) commentStatusDiv.textContent = '';
            }, 5000);
        }
    }


    // --- 更新主状态显示 ---
    /**
     * 更新页面顶部的主状态信息。
     * @param {string} message 要显示的状态信息。
     */
    function updateMainStatus(message) {
        const statusDiv = document.getElementById('yuba-viewer-main-status');
        if (statusDiv) {
            statusDiv.textContent = `主状态：${message}`;
        }
        console.log(`Main Status: ${message}`); // 同时在控制台输出
    }

    // --- 设置加载更多帖子按钮状态 ---
    /**
     * 更新“加载更多帖子”按钮的启用状态和文本。
     * @param {boolean} enabled 是否启用按钮。
     * @param {string} text 按钮显示的文本。
     */
    function setLoadMorePostsButtonState(enabled, text) {
        const button = document.getElementById('yuba-viewer-load-more-posts');
        if (button) {
            button.disabled = !enabled;
            button.textContent = text;
            // 控制按钮的显示：启用时显示，或者当文本包含特定状态（如“全部”、“没有”、“失败”）时也显示
            button.style.display = enabled || text.includes('全部') || text.includes('没有') || text.includes('失败') ? 'block' : 'none';
        }
    }

    // --- 创建基础 UI 结构 (发帖区置顶) ---
    /**
     * 初始化脚本的用户界面，包括帖子列表容器、状态显示、发帖区域等。
     */
    function setupUI() {
        // 尝试隐藏原生的“鱼吧已关闭”提示
        const closedNotice = document.querySelector('.YubaClosed') || document.querySelector('.yuba-closed-tip');
        if (closedNotice) {
            closedNotice.style.display = 'none';
            console.log("已隐藏 '鱼吧已关闭' 提示。");
        }

        // 查找合适的父容器来插入我们的 UI
        // 优先尝试 .Main .content_wrap，这是常见的内容区域
        // 如果找不到，尝试 #root .PageLayout (新版斗鱼布局?)
        // 最坏情况插入到 body
        let mainContainer = document.querySelector('.Main .content_wrap');
        if (!mainContainer) {
            console.warn("未能找到 .Main .content_wrap 容器，将尝试其他插入点...");
            mainContainer = document.querySelector('#root .PageLayout'); // 尝试备选容器
            if (!mainContainer) {
                console.warn("备选容器 #root .PageLayout 也未找到，将直接插入到 body。");
                mainContainer = document.body; // 最后选择
            }
        }

        // 创建脚本的主容器
        const viewerContainer = document.createElement('div');
        viewerContainer.id = 'yuba-viewer-container'; // 主容器 ID

        // 定义 UI 的 HTML 结构，将发帖区域放在顶部
        viewerContainer.innerHTML = `
            <h2>6657UPUP</h2>
            <div class="poster-warning" style="text-align:center; color: #d9534f; font-weight: bold; margin-bottom: 15px; font-size: 12px; border: 1px dashed #d9534f; padding: 5px; background-color: #f2dede;">
                ⚠️ 仅供学习研究，请勿滥用，后果自负！
            </div>

            <!-- 发帖区域 -->
            <div id="new-post-section" style="border: 1px solid #ddd; padding: 15px; margin-bottom: 20px; background-color: #f8f8f8; border-radius: 3px;">
                <h3>发布新帖</h3>
                <div>
                    <textarea id="new-post-content" rows="4" placeholder="输入新帖子内容 (暂不支持图片/表情)" style="width: calc(100% - 12px); padding: 5px; border: 1px solid #ccc; border-radius: 3px; font-size: 14px; resize: vertical; min-height: 80px; margin-bottom: 10px;"></textarea>
                </div>
                <button id="new-post-submit-button" style="padding: 8px 15px; background-color: #5cb85c; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 14px; width: 100%; box-sizing: border-box;">发布新帖</button>
                <div id="new-post-status" style="font-size: 0.9em; margin-top: 8px; min-height: 1.2em; color: #888;"></div> <!-- 发帖状态显示 -->
            </div>

            <hr class="section-divider" style="margin: 20px 0; border: 0; border-top: 1px solid #eee;">

            <!-- 帖子列表区域 -->
            <h3>帖子列表</h3>
            <div id="yuba-viewer-main-status">准备加载...</div> <!-- 主状态显示 -->
            <div id="yuba-viewer-post-list"></div> <!-- 帖子列表容器 -->
            <button id="yuba-viewer-load-more-posts" style="display: none;">加载更多帖子</button> <!-- 加载更多按钮 -->
        `;

        // 将脚本 UI 插入到找到的容器的开头
        mainContainer.insertBefore(viewerContainer, mainContainer.firstChild);

        // 绑定顶层按钮的事件监听器
        document.getElementById('yuba-viewer-load-more-posts').addEventListener('click', fetchAndRenderPosts);
        document.getElementById('new-post-submit-button').addEventListener('click', handlePostSubmit);

        console.log("UI setup complete.");
    }

    // --- 添加 CSS 样式 ---
    // GM_addStyle 用于注入 CSS 到页面
    GM_addStyle(`
        /* --- 主容器和基本布局 --- */
        #yuba-viewer-container {
            margin: 20px auto;
            padding: 15px;
            background-color: #fff;
            border: 1px solid #e1e1e1;
            max-width: 800px; /* 限制最大宽度，使其在宽屏上更易读 */
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 使用系统默认字体 */
            font-size: 14px;
            color: #333;
        }
        #yuba-viewer-container h2,
        #yuba-viewer-container h3 {
            text-align: center;
            margin-top: 10px;
            margin-bottom: 15px;
            color: #333;
            font-weight: 500;
        }
        #yuba-viewer-main-status {
            text-align: center;
            margin-bottom: 10px;
            color: #888;
            font-style: italic;
            font-size: 0.9em;
        }

        /* --- 帖子列表和加载更多 --- */
        #yuba-viewer-post-list {
            margin-bottom: 20px;
        }
        #yuba-viewer-load-more-posts {
            display: block;
            margin: 20px auto;
            padding: 10px 20px;
            background-color: #ff6a00; /* 斗鱼橙色 */
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.2s ease;
        }
        #yuba-viewer-load-more-posts:hover:not(:disabled) {
            background-color: #e05a00;
        }
        #yuba-viewer-load-more-posts:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }

        /* --- 单个帖子样式 --- */
        .yuba-viewer-post-item {
            border: 1px solid #eee;
            margin-bottom: 15px;
            padding: 10px 15px;
            background-color: #f9f9f9;
            border-radius: 3px;
            transition: box-shadow 0.2s ease;
        }
        .yuba-viewer-post-item:hover {
            box-shadow: 0 2px 5px rgba(0,0,0,0.08);
        }

        /* 帖子头部 (头像、昵称、时间等) */
        .post-header {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            padding-bottom: 8px;
            border-bottom: 1px dashed #eee;
            flex-wrap: wrap; /* 允许换行 */
        }
        .post-avatar {
            width: 35px;
            height: 35px;
            border-radius: 50%;
            margin-right: 10px;
            flex-shrink: 0; /* 防止头像被压缩 */
        }
        .post-author-info {
            flex-grow: 1; /* 占据剩余空间 */
            min-width: 100px; /* 保证一定宽度 */
        }
        .post-nickname {
            font-weight: bold;
            color: #ff6a00; /* 斗鱼橙色 */
            margin-right: 5px;
        }
        .post-uid {
            font-size: 0.9em;
            color: #999;
        }
        .post-level {
            background-color: #eee;
            color: #777;
            padding: 1px 4px;
            border-radius: 3px;
            font-size: 0.8em;
            margin-left: 5px;
            white-space: nowrap;
        }
        .post-timestamp {
            font-size: 0.85em;
            color: #aaa;
            margin-left: auto; /* 推到最右边 */
            white-space: nowrap; /* 防止时间换行 */
            padding-left: 10px; /* 与左侧内容保持间距 */
        }

        /* 帖子主体 (内容、图片) */
        .post-body {
            margin-bottom: 10px;
            line-height: 1.6;
            word-wrap: break-word; /* 允许长单词换行 */
        }
        .post-text-content {
            margin-bottom: 10px;
        }
        .post-topic { /* 话题样式 */
            color: #007bff;
            font-weight: bold;
            margin-right: 3px;
        }
        .post-link { /* 链接样式 */
            color: #1e90ff;
            text-decoration: underline;
        }
        .post-images-container {
            display: flex;
            flex-wrap: wrap;
            gap: 5px; /* 图片间距 */
        }
        .post-image {
            max-width: 150px; /* 限制图片预览大小 */
            max-height: 150px;
            object-fit: cover; /* 保持图片比例并裁剪 */
            border: 1px solid #ddd;
            cursor: pointer;
            border-radius: 3px;
            transition: opacity 0.2s ease;
        }
        .post-image:hover {
             opacity: 0.8;
        }

        /* 帖子底部 (点赞、评论按钮、位置、原帖链接) */
        .post-footer {
            font-size: 0.9em;
            color: #888;
            border-top: 1px dashed #eee;
            padding-top: 8px;
            margin-top: 10px;
            display: flex;
            align-items: center;
            flex-wrap: wrap; /* 允许换行 */
            gap: 10px; /* 元素间距 */
        }
        .post-footer span, .post-footer a, .post-footer button {
            margin: 0; /* Reset default margins */
            vertical-align: middle; /* 垂直居中对齐 */
        }
        .locality-display, .share-link {
            font-size: inherit;
            color: inherit;
            text-decoration: none;
        }
        .share-link:hover {
            text-decoration: underline;
        }
        .like-status { /* 点赞操作状态提示 */
            font-size: 0.85em;
            margin-left: 5px;
            color: #888;
            font-style: italic;
        }

        /* --- 评论区样式 --- */
        .post-comments-list-container {
            background-color: #fdfdfd; /* 比帖子背景稍浅 */
            padding: 10px;
            border: 1px solid #f0f0f0;
            border-radius: 3px;
            margin-top: 10px;
        }
        .yuba-viewer-comment-item { /* 单条评论 */
            margin-bottom: 10px;
            padding-bottom: 8px;
            border-bottom: 1px dotted #eee;
        }
        .yuba-viewer-comment-item:last-child {
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
        }

        /* 评论头部 (头像、昵称、时间、位置) */
        .comment-header {
            display: flex;
            align-items: center;
            margin-bottom: 5px;
            flex-wrap: wrap; /* 允许换行 */
        }
        .comment-avatar {
            width: 25px;
            height: 25px;
            border-radius: 50%;
            margin-right: 8px;
        }
        .comment-nickname {
            font-weight: bold;
            color: #555;
            margin-right: 8px;
            font-size: 0.95em;
        }
        .comment-timestamp {
            font-size: 0.8em;
            color: #bbb;
            margin-left: auto; /* 推到右边 */
            white-space: nowrap;
            padding-left: 10px;
        }
        .comment-locality {
            font-size: 0.8em;
            color: #bbb;
            white-space: nowrap;
            margin-left: 5px; /* 与昵称或时间保持距离 */
        }

        /* 评论内容 */
        .comment-content {
            font-size: 0.95em;
            line-height: 1.5;
            margin-left: 33px; /* 与头像对齐 (25px + 8px margin) */
            word-wrap: break-word;
        }

        /* 楼中楼 (子评论) */
        .sub-comments-container {
            margin-left: 33px; /* 与评论内容对齐 */
            margin-top: 8px;
            border-left: 2px solid #eee;
            padding-left: 10px;
            font-size: 0.9em;
        }
        .sub-comment-item {
            margin-bottom: 5px;
            line-height: 1.4;
            color: #666;
        }
        .sub-comment-content {
            color: #444; /* 子评论内容颜色稍深 */
            margin-left: 2px; /* 轻微缩进 */
        }

        /* 加载更多评论按钮和状态 */
        .load-more-comments-button {
            display: block;
            margin: 10px auto 0;
            padding: 5px 10px;
            background-color: #eee;
            color: #555;
            border: 1px solid #ddd;
            border-radius: 3px;
            cursor: pointer;
            font-size: 0.9em;
            transition: background-color 0.2s ease;
        }
        .load-more-comments-button:hover:not(:disabled) {
             background-color: #e0e0e0;
        }
        .load-more-comments-button:disabled {
            background-color: #f5f5f5;
            cursor: not-allowed;
            color: #aaa;
        }
        .comments-load-status {
            text-align: center;
            font-size: 0.9em;
            color: #888;
            margin-top: 5px;
        }

        /* --- 评论输入区 --- */
        .post-comment-section {
            margin-top: 15px;
            padding-top: 10px;
            border-top: 1px solid #eee;
        }
        .reply-target-indicator { /* 回复提示 */
            border-left: 3px solid #ff6a00;
            padding-left: 8px;
            margin-bottom: 8px;
            background-color: #fff3e0; /* 淡橙色背景 */
            border-radius: 2px;
            padding-top: 3px;
            padding-bottom: 3px;
        }
        .cancel-reply-button { /* 取消回复按钮 */
            background: #eee;
            border: 1px solid #ccc;
            border-radius: 3px;
            cursor: pointer;
            padding: 1px 4px;
            font-size: 0.8em;
            margin-left: 5px;
            vertical-align: middle;
        }
        .cancel-reply-button:hover {
            background: #ddd;
        }
        .comment-input { /* 评论输入框 */
            width: calc(100% - 12px); /* 考虑 padding */
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 3px;
            font-size: 13px;
            margin-bottom: 5px;
            resize: vertical; /* 允许垂直调整大小 */
            min-height: 40px;
            box-sizing: border-box;
        }
        .comment-submit-button { /* 评论/回复提交按钮 */
            padding: 5px 12px;
            background-color: #ff6a00;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 13px;
            float: right; /* 右对齐 */
            transition: background-color 0.2s ease;
        }
        .comment-submit-button:hover:not(:disabled) {
            background-color: #e05a00;
        }
        .comment-submit-button:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }
        .comment-status { /* 评论/回复操作状态 */
            font-size: 0.9em;
            margin-top: 5px;
            padding-left: 2px;
            min-height: 1.2em; /* 避免状态消失时跳动 */
            clear: both; /* 清除浮动 */
            color: #888;
        }

        /* --- 图标按钮通用样式 --- */
        .icon-button {
            background: none;
            border: none;
            padding: 0;
            cursor: pointer;
            display: inline-flex; /* 使图标和文字在同一行 */
            align-items: center; /* 垂直居中对齐 */
            font-size: inherit; /* 继承父元素字体大小 */
            color: #888; /* 默认图标颜色 */
            vertical-align: middle;
            transition: color 0.2s ease;
        }
        .icon-button:hover:not(:disabled) {
            color: #ff6a00; /* 悬停时变橙色 */
        }
        .icon-button:disabled {
            cursor: not-allowed;
            opacity: 0.7;
        }
        .icon-button svg {
            width: 16px;
            height: 16px;
            margin-right: 4px; /* 图标和文字间距 */
            vertical-align: middle; /* 确保 SVG 垂直居中 */
            fill: currentColor; /* SVG 颜色继承按钮颜色 */
        }

        /* 点赞按钮特殊样式 */
        .like-toggle-button[data-liked="true"] {
            color: rgb(255, 93, 103); /* 已点赞时的颜色 */
        }
        /* 已点赞时，确保 SVG 使用定义的渐变色 */
        .like-toggle-button[data-liked="true"] svg path {
             fill: url(#dzd_svg__a); /* 应用 SVG 内定义的渐变 */
        }

        /* 点赞数/评论数显示 */
        .like-count-display, .comment-count-display {
            margin-left: 0; /* 移除可能的默认边距 */
            font-size: inherit;
            color: inherit;
        }

        /* 回复按钮 */
        .reply-button {
            background: none;
            border: none;
            color: #888;
            cursor: pointer;
            font-size: 0.8em; /* 回复按钮小一点 */
            padding: 0 3px;
            vertical-align: middle;
            transition: color 0.2s ease;
        }
        .reply-button:hover {
            color: #ff6a00;
            text-decoration: underline;
        }
        .sub-reply-button { /* 楼中楼回复按钮的微调 */
             margin-left: 5px;
        }
    `);

    // --- 脚本入口 ---
    // 使用 'load' 事件确保页面基本结构加载完毕后再执行脚本
    window.addEventListener('load', () => {
        console.log("斗鱼指定鱼吧全能助手 v1.12.1 尝试初始化...");
        try {
            setupUI(); // 创建 UI 界面
            fetchAndRenderPosts(); // 开始加载第一页帖子
            console.log("斗鱼指定鱼吧全能助手 v1.12.1 已成功加载并运行");
        } catch (e) {
            console.error("脚本初始化或 UI 创建失败:", e);
            // 在页面上显示错误信息，方便调试
            const errorDiv = document.createElement('div');
            errorDiv.style.cssText = 'position:fixed; bottom:10px; left:10px; background:red; color:white; padding:10px; z-index:10000; border-radius: 5px; font-family: sans-serif; font-size: 12px;';
            errorDiv.textContent = `[鱼吧助手脚本错误] ${e.message}. 按 F12 查看控制台获取详细信息。`;
            document.body.appendChild(errorDiv);
        }
    });

})(); // 立即执行函数结束