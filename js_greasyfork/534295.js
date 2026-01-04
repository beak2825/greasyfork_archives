// ==UserScript==
// @name         优学院讨论区匿名替换真实姓名 v0.1
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  让我看看都是谁在评论！
// @author       青柍kk
// @match        https://discussion.ulearning.cn/pc.html*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      discussion.ulearning.cn
// @connect courseapi.ulearning.cn
// @connect      api.ulearning.cn
// @connect      www.ulearning.cn
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534295/%E4%BC%98%E5%AD%A6%E9%99%A2%E8%AE%A8%E8%AE%BA%E5%8C%BA%E5%8C%BF%E5%90%8D%E6%9B%BF%E6%8D%A2%E7%9C%9F%E5%AE%9E%E5%A7%93%E5%90%8D%20v01.user.js
// @updateURL https://update.greasyfork.org/scripts/534295/%E4%BC%98%E5%AD%A6%E9%99%A2%E8%AE%A8%E8%AE%BA%E5%8C%BA%E5%8C%BF%E5%90%8D%E6%9B%BF%E6%8D%A2%E7%9C%9F%E5%AE%9E%E5%A7%93%E5%90%8D%20v01.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- --- 配置区 (根据提供信息填写) --- ---

    // 1. 成员列表 API 的完整 URL (获取全班/全课程用户名单的分页接口基础URL)
    const MEMBER_API_URL = 'https://courseapi.ulearning.cn/student/list?ocId=147496&isDesc=1&pn=1&ps=10&lang=zh'; // 成员列表API基础URL

    // 1a. 成员列表 API 分页相关字段名确认
    const MEMBER_API_PAGE_PARAM = 'pn';// 页码参数名 (来自 URL)
    const MEMBER_API_PAGESIZE_PARAM = 'ps';// 页面大小参数名 (来自 URL)
    const MEMBER_API_TOTAL_FIELD = 'total';// 返回JSON中总数字段 (来自成员列表JSON)
    const MEMBER_API_PAGESIZE_FIELD = 'pageSize';// 返回JSON中页面大小字段 (来自成员列表JSON)
    const MEMBER_API_LIST_FIELD = 'list';// 返回JSON中用户数字段 (来自成员列表JSON)
    const MEMBER_API_USERID_FIELD = 'userId';// 用户对象中用户ID字段 (来自成员列表JSON)
    const MEMBER_API_USERNAME_FIELD = 'name';// 用户对象中姓名字段 (来自成员列表JSON)

    // 1b. **尝试** 成员列表 API 页面大小 (尝试一次性获取更多，减少请求次数, API可能有限制)
    const MEMBER_API_PREFERRED_PAGESIZE = 200; // 尝试每页获取200个，如果不行API会按自己的限制来

    // 2. 讨论帖子列表 API 的 URL 模板 (获取当前讨论页面帖子内容的接口模板)
    const TOPIC_INFO_API_TEMPLATE = 'https://courseapi.ulearning.cn/topic/topicInfo?pn={pageNum}&ps={pageSize}&ocId={ocId}&discussionId={discussionId}&teacherId=&classId=&orderType=&mine=false&keyword='; // 讨论帖子API模板

    // 2a. 讨论帖子 API 结果解析确认
    const TOPIC_INFO_LIST_PATH = ['result', 'pageInfo', 'list']; // 帖子列表在JSON中的路径
    const TOPIC_INFO_USERID_FIELD = 'userID';// 帖子对象中用户ID字段

    // 3. 评论区容器的 CSS 选择器 (包含所有评论和分页控件)
    const COMMENT_CONTAINER_SELECTOR = '.contentDetails'; // 包含所有评论和分页的容器

    // 4. 单个评论项/块的 CSS 选择器
    const COMMENT_ITEM_SELECTOR = '.infoText'; // 单个评论块

    // 5. 用户名元素相对于单个评论项的 CSS 选择器 (显示"匿名"的地方)
    const USERNAME_SELECTOR = '.teacherTipsTop .span1'; // 显示用户名的元素

    // 6. 当前页码的 CSS 选择器 (分页控件中高亮的页码)
    const PAGINATION_CURRENT_PAGE_SELECTOR = '.pagination-wrap .active'; // 分页控件当前页码

    // 7. 讨论区每页帖子数量 (必须与 topicInfo API 的 ps 参数一致)
    const DISCUSSION_PAGE_SIZE = 20; // 讨论区每页帖子数

    // --- --- 配置区结束 --- ---


    let userIdToNameMap = null; // userID -> 真实姓名的映射
    let isFetchingUserMap = false; // 是否正在获取用户映射的标记
    let userMapPromise = null; // 保存获取用户映射的 Promise
    let currentOcId = null; // 当前课程/组织 ID
    let currentDiscussionId = null; // 当前讨论 ID
    let authToken = null; // 认证 Token
    let lastProcessedPage = -1; // 记录上次处理的页码，防止重复处理

    // --- 样式 ---
    GM_addStyle(`
        .real-name-revealed {
            color: #007bff !important; /* 蓝色 */
            font-weight: bold !important;
            cursor: help; /* 添加一个鼠标悬停提示 */
            position: relative;
            background-color: rgba(0, 123, 255, 0.08); /* 更淡的蓝色背景 */
            padding: 0px 3px;
            border-radius: 3px;
            border: 1px solid rgba(0, 123, 255, 0.2); /* 浅蓝色边框 */
        }
        /* 可选：在名字后面加个标记 */
        .real-name-revealed::after {
            content: ' (R)'; /* R = Revealed / Real */
            font-size: 0.8em;
            color: #6c757d; /* 灰色 */
            margin-left: 3px;
            font-weight: normal; /* 标记不需要加粗 */
        }
        /* 可选: 鼠标悬停显示原始 UserID */
        .real-name-revealed:hover::before {
            content: "ID:" attr(data-original-userid); /* 显示 "ID:xxxx" */
            position: absolute;
            bottom: 105%; /* 稍微向上一点 */
            left: 50%;
            transform: translateX(-50%);
            background-color: #444; /* 深灰色背景 */
            color: white;
            padding: 3px 6px;
            border-radius: 4px;
            font-size: 10px; /* 稍小一点 */
            line-height: 1.2;
            white-space: nowrap;
            z-index: 1000; /* 确保在顶层 */
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
    `);

    // --- 工具函数 ---

    function getParamsFromUrl() {
        const params = {};
        const hash = window.location.hash;
        if (hash.includes('?')) {
            const urlParams = new URLSearchParams(hash.substring(hash.indexOf('?')));
            params.ocId = urlParams.get('ocId');
            params.discussionId = urlParams.get('discussionId');
        }
        return params;
    }

    function getTokenFromCookie() {
        const cookies = document.cookie;
        const tokenMatch = /token=([^;]+)/.exec(cookies);
        if (tokenMatch && tokenMatch[1]) {
            return tokenMatch[1];
        }
        console.error("未能从 Cookie 中找到 token!");
        return null;
    }

    function getCurrentPageNumber() {
        try {
            const activePageElement = document.querySelector(PAGINATION_CURRENT_PAGE_SELECTOR);
            if (activePageElement) {
                const pageNum = parseInt(activePageElement.textContent.trim(), 10);
                return (isNaN(pageNum) || pageNum < 1) ? 1 : pageNum;
            }
        } catch (e) {
            console.error("获取当前页码时出错:", e);
        }
        console.warn(`无法找到当前页码元素 (${PAGINATION_CURRENT_PAGE_SELECTOR})，默认返回页码 1`);
        return 1;
    }

     // 安全地从嵌套对象获取值
    function getNestedValue(obj, pathArray) {
        return pathArray.reduce((currentValue, key) => {
            return (currentValue && typeof currentValue === 'object' && key in currentValue) ? currentValue[key] : undefined;
        }, obj);
    }


    // --- API 请求函数 ---

    // 获取 *所有* 成员列表 (处理分页)
    function fetchAllUsers() {
        if (isFetchingUserMap) return userMapPromise;
        if (userIdToNameMap) return Promise.resolve(userIdToNameMap);
        if (!authToken) return Promise.reject("缺少认证 Token (fetchAllUsers)");

        isFetchingUserMap = true;
        userIdToNameMap = {};
        console.log("[成员列表] 开始获取所有成员数据...");

        function fetchPage(pageNumber) {
            return new Promise((resolvePage) => { // 改为只 resolve，在 Promise.all 外处理失败
                let pageUrl;
                try {
                    pageUrl = new URL(MEMBER_API_URL);
                    pageUrl.searchParams.set(MEMBER_API_PAGE_PARAM, pageNumber);
                    pageUrl.searchParams.set(MEMBER_API_PAGESIZE_PARAM, MEMBER_API_PREFERRED_PAGESIZE); // 尝试设置期望的页面大小
                } catch (e) {
                    console.error("[成员列表] 处理 URL 时出错:", e);
                    resolvePage({ success: false, error: "URL 处理错误" }); return;
                }
                const urlForPage = pageUrl.toString();
                console.log(`  [成员列表] 获取第 ${pageNumber} 页 (尝试 ps=${MEMBER_API_PREFERRED_PAGESIZE})...`);

                GM_xmlhttpRequest({
                    method: 'GET', url: urlForPage, responseType: 'json', timeout: 30000,
                    headers: { 'AUTHORIZATION': authToken },
                    onload: function(response) {
                        if (response.status >= 200 && response.status < 300 && response.response) {
                            const data = response.response;
                            const userList = getNestedValue(data, [MEMBER_API_LIST_FIELD]); // 使用确认的字段名
                            if (userList && Array.isArray(userList)) {
                                userList.forEach(user => {
                                    const userId = getNestedValue(user, [MEMBER_API_USERID_FIELD]);
                                    const userName = getNestedValue(user, [MEMBER_API_USERNAME_FIELD]);
                                    if (userId && userName) {
                                        userIdToNameMap[userId] = userName.trim();
                                    }
                                });
                                resolvePage({ success: true, data: data }); // 传递原始数据
                            } else {
                                console.error(`  [成员列表] 第 ${pageNumber} 页数据结构不符 (${MEMBER_API_LIST_FIELD} 路径错误):`, data);
                                resolvePage({ success: false, error: "数据结构错误" });
                            }
                        } else {
                            console.error(`  [成员列表] 获取第 ${pageNumber} 页失败，状态码: ${response.status}`);
                            resolvePage({ success: false, error: `HTTP ${response.status}` });
                        }
                    },
                    onerror: (error) => { console.error(`  [成员列表] 第 ${pageNumber} 页网络错误:`, error); resolvePage({ success: false, error: "网络错误" }); },
                    ontimeout: () => { console.error(`  [成员列表] 第 ${pageNumber} 页请求超时`); resolvePage({ success: false, error: "请求超时" }); }
                });
            });
        }

        userMapPromise = new Promise(async (resolve, reject) => {
            try {
                console.log("  [成员列表] 获取第一页以确定总页数...");
                const firstPageResult = await fetchPage(1);

                if (!firstPageResult.success || !firstPageResult.data) {
                     reject(`获取第一页成员列表失败: ${firstPageResult.error || '未知错误'}`);
                     isFetchingUserMap = false; return;
                }

                const firstPageData = firstPageResult.data;
                const totalUsers = parseInt(getNestedValue(firstPageData, [MEMBER_API_TOTAL_FIELD]), 10);
                const actualPageSize = parseInt(getNestedValue(firstPageData, [MEMBER_API_PAGESIZE_FIELD]), 10);

                if (isNaN(totalUsers) || isNaN(actualPageSize) || actualPageSize <= 0) {
                    console.error("  [成员列表] 无法从第一页获取有效分页信息。", firstPageData);
                    if (Object.keys(userIdToNameMap).length > 0) {
                        console.warn("  [成员列表] 将仅使用第一页数据。"); resolve(userIdToNameMap);
                    } else { reject("分页信息无效"); }
                    isFetchingUserMap = false; return;
                }

                const totalPages = Math.ceil(totalUsers / actualPageSize); // 使用API返回的实际页面大小计算总页数
                console.log(`  [成员列表] 总用户数: ${totalUsers}, 实际每页大小: ${actualPageSize}, 总页数: ${totalPages}`);

                if (totalPages > 1) {
                    const pagePromises = [];
                    for (let i = 2; i <= totalPages; i++) {
                        pagePromises.push(fetchPage(i));
                    }
                    console.log(`  [成员列表] 并发获取第 2 页到第 ${totalPages} 页...`);
                    const results = await Promise.all(pagePromises); // 等待所有请求完成
                    // 检查是否有失败的请求
                    const failedPages = results.filter(r => !r.success).length;
                    if (failedPages > 0) {
                        console.warn(`  [成员列表] ${failedPages} 个页面获取失败或处理出错。`);
                    }
                    console.log("  [成员列表] 所有页面请求完成。");
                }

                console.log(`[成员列表] 最终处理了 ${Object.keys(userIdToNameMap).length} 个用户映射 (API报告总数 ${totalUsers})。`);
                isFetchingUserMap = false;
                resolve(userIdToNameMap);

            } catch (error) {
                console.error("[成员列表] 获取所有分页数据时出错:", error);
                isFetchingUserMap = false;
                if (Object.keys(userIdToNameMap).length > 0) {
                    console.warn("[成员列表] 过程出错，将仅使用部分数据。"); resolve(userIdToNameMap);
                } else { reject(error); }
            }
        });
        return userMapPromise;
    }

    // 获取 *指定页* 的讨论帖子列表数据
    function fetchTopicInfoPageData(ocId, discussionId, pageNum, pageSize) {
         if (!authToken) return Promise.reject("缺少认证 Token (fetchTopicInfoPageData)");
         if (!ocId || !discussionId) return Promise.reject("缺少 ocId 或 discussionId");

        let apiUrl = TOPIC_INFO_API_TEMPLATE
            .replace('{ocId}', encodeURIComponent(ocId))
            .replace('{discussionId}', encodeURIComponent(discussionId))
            .replace('{pageNum}', encodeURIComponent(pageNum))
            .replace('{pageSize}', encodeURIComponent(pageSize));

        console.log(`[讨论帖子] 获取第 ${pageNum} 页 (ps=${pageSize})...`);

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET', url: apiUrl, responseType: 'json', timeout: 15000,
                headers: { 'AUTHORIZATION': authToken },
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300 && response.response) {
                        const data = response.response;
                        // 使用确认的路径和字段名解析
                        const postList = getNestedValue(data, TOPIC_INFO_LIST_PATH);
                        if (data && data.code === 1 && postList && Array.isArray(postList)) {
                             console.log(`  [讨论帖子] 第 ${pageNum} 页获取成功，帖子数: ${postList.length}`);
                             resolve(postList); // 返回帖子列表数组
                        } else {
                             console.error(`  [讨论帖子] 第 ${pageNum} 页数据结构不符或 code 不为 1:`, data);
                             reject(`讨论帖子API数据错误 (code:${data?.code})`);
                        }
                    } else {
                         console.error(`  [讨论帖子] 获取第 ${pageNum} 页失败，状态码: ${response.status}`);
                         reject(`获取讨论帖子失败，状态码: ${response.status}`);
                    }
                },
                onerror: (error) => { console.error(`  [讨论帖子] 第 ${pageNum} 页网络错误:`, error); reject("网络错误"); },
                ontimeout: () => { console.error(`  [讨论帖子] 第 ${pageNum} 页请求超时`); reject("请求超时"); }
            });
        });
    }


    // --- 核心处理逻辑 ---

    // 处理当前可见的评论及其回复
    function processVisibleComments(topicInfoPageData, userMap) {
         if (!topicInfoPageData || topicInfoPageData.length === 0) {
             console.log("没有当前页的讨论帖子数据可供处理。"); return;
         }
         if (!userMap) {
             console.warn("用户映射数据尚未准备好，无法进行名称替换。");
         }

         console.log(`准备使用 ${topicInfoPageData.length} 条主帖子数据处理页面元素...`);
         const commentElements = document.querySelectorAll(COMMENT_ITEM_SELECTOR); // 获取所有主评论元素
         console.log(`在页面上找到 ${commentElements.length} 个主评论元素 (${COMMENT_ITEM_SELECTOR})。`);

         const processLength = Math.min(topicInfoPageData.length, commentElements.length);
         if (processLength === 0) { console.log("没有可匹配的主帖子数据和 DOM 元素。"); return; }
         if (topicInfoPageData.length !== commentElements.length) {
              console.warn(`警告：API主帖子数 (${topicInfoPageData.length}) 与页面元素数 (${commentElements.length}) 不匹配！将只处理前 ${processLength} 个。`);
         }

         let totalReplaced = 0;
         for (let i = 0; i < processLength; i++) {
             const mainPostData = topicInfoPageData[i];       // 当前主帖的 API 数据
             const mainCommentElement = commentElements[i]; // 页面上对应的主评论元素

             // 1. 处理主评论作者
             try {
                 const usernameElement = mainCommentElement.querySelector(USERNAME_SELECTOR); // 主评论用户名元素的选择器
                 if (usernameElement && usernameElement.textContent.trim() === '匿名') {
                     const userId = getNestedValue(mainPostData, [TOPIC_INFO_USERID_FIELD]); // 主帖的用户 ID
                     if (userId && userMap && userMap[userId]) {
                         const realName = userMap[userId];
                         usernameElement.textContent = realName;
                         usernameElement.classList.add('real-name-revealed');
                         usernameElement.setAttribute('data-original-userid', userId);
                         totalReplaced++;
                     }
                 } else if (usernameElement && usernameElement.textContent.trim() !== '匿名' && !usernameElement.classList.contains('real-name-revealed')) {
                      const userId = getNestedValue(mainPostData, [TOPIC_INFO_USERID_FIELD]);
                      if (userId) {
                           usernameElement.classList.add('real-name-revealed');
                           usernameElement.setAttribute('data-original-userid', userId);
                      }
                 }
             } catch (e) {
                  console.error(`处理第 ${i} 个主评论作者时出错:`, e, mainCommentElement);
             }

             // 2. 处理该主评论下的回复 (二级评论)
             const subListData = getNestedValue(mainPostData, ['subList', 'list']); // 从主帖数据获取回复列表
             if (subListData && Array.isArray(subListData) && subListData.length > 0) {
                 // 查找当前主评论元素下的所有回复元素
                 const replyElements = mainCommentElement.querySelectorAll('.secondText'); // 选择器是 .secondText
                 console.log(`  主帖 #${i + 1}: 找到 ${subListData.length} 条回复数据 和 ${replyElements.length} 个回复元素。`);

                 const replyProcessLength = Math.min(subListData.length, replyElements.length);
                 if (subListData.length !== replyElements.length) {
                      console.warn(`  主帖 #${i + 1}: 回复数据数 (${subListData.length}) 与回复元素数 (${replyElements.length}) 不匹配！将只处理前 ${replyProcessLength} 个。`);
                 }

                 for (let j = 0; j < replyProcessLength; j++) {
                     const replyData = subListData[j];// 当前回复的 API 数据
                     const replyElement = replyElements[j];// 页面上对应的回复元素

                     try {
                         // 查找回复元素中的名字 span
                         const replyNameElement = replyElement.querySelector('.name'); // 回复名字的选择器是 .name
                         if (replyNameElement && replyNameElement.textContent.trim() === '匿名') {
                             const replyUserId = getNestedValue(replyData, [TOPIC_INFO_USERID_FIELD]); // 回复者的 UserID
                             if (replyUserId && userMap && userMap[replyUserId]) {
                                 const realName = userMap[replyUserId];
                                 // console.log(`    回复 #${j + 1}: UserID ${replyUserId} -> ${realName}`);
                                 replyNameElement.textContent = realName;
                                 replyNameElement.classList.add('real-name-revealed');
                                 replyNameElement.setAttribute('data-original-userid', replyUserId);
                                 totalReplaced++;
                             } else if (replyUserId && !userMap) {
                                 // 等待映射加载
                             } else if (replyUserId) {
                                 // console.log(`    回复 #${j + 1}: 未在映射中找到 UserID ${replyUserId}`);
                             }
                         } else if (replyNameElement && replyNameElement.textContent.trim() !== '匿名' && !replyNameElement.classList.contains('real-name-revealed')) {
                              const replyUserId = getNestedValue(replyData, [TOPIC_INFO_USERID_FIELD]);
                              if (replyUserId) {
                                  replyNameElement.classList.add('real-name-revealed');
                                  replyNameElement.setAttribute('data-original-userid', replyUserId);
                              }
                         }
                     } catch (e) {
                           console.error(`处理主帖 #${i + 1} 的第 ${j} 条回复时出错:`, e, replyElement);
                     }
                 }
             }
         }
         console.log(`名称替换完成，本轮共替换了 ${totalReplaced} 个"匿名"（包括主评论和回复）。`);
    }

    // --- 主执行函数和监听器 ---
    let processingScheduled = false; // 防抖标记

    async function runReplacement() {
        const currentPage = getCurrentPageNumber();
        // 如果页面和上次处理的相同，则不执行，除非用户映射尚未加载
        if (currentPage === lastProcessedPage && userIdToNameMap) {
            // console.log(`页面 ${currentPage} 已处理过，跳过。`);
            return;
        }

        if (processingScheduled) { console.log("任务已在计划中，跳过本次触发。"); return; }
        processingScheduled = true;
        console.log(`--- 开始执行第 ${currentPage} 页名称替换流程 ---`);

        const params = getParamsFromUrl();
        if (!params.ocId || !params.discussionId) {
            console.error("无法从 URL 获取 ocId 或 discussionId。");
            processingScheduled = false; return;
        }
        currentOcId = params.ocId; currentDiscussionId = params.discussionId;
        if (!authToken) authToken = getTokenFromCookie();
        if (!authToken) { console.error("无法获取 Token。"); processingScheduled = false; return; }

        try {
             // 确保用户映射已加载或正在加载
             const userMap = await fetchAllUsers(); // 获取或等待用户映射 Promise

             // 获取当前页的帖子数据
             const topicInfoPageData = await fetchTopicInfoPageData(currentOcId, currentDiscussionId, currentPage, DISCUSSION_PAGE_SIZE);

             // 处理可见评论
             processVisibleComments(topicInfoPageData, userMap);
             lastProcessedPage = currentPage; // 记录已成功处理的页码

        } catch (error) {
            console.error(`执行第 ${currentPage} 页替换时发生错误:`, error);
            // 出错时不清空 lastProcessedPage，允许下次重试
        } finally {
             console.log(`--- 第 ${currentPage} 页名称替换流程结束 ---`);
             setTimeout(() => { processingScheduled = false; }, 300); // 300ms 防抖
        }
    }

    // --- 启动与监听 ---

    console.log("优学院匿名替换脚本 (v0.5) 启动...");

    // 1. 获取初始 Token
    authToken = getTokenFromCookie();
    if (!authToken) {
        console.warn("脚本启动时未获取到 Token，请确保已登录。");
    }

    // 2. 监听 DOM 变化 (用于处理翻页或动态加载)
    function observeContentChanges() {
        const targetNode = document.querySelector(COMMENT_CONTAINER_SELECTOR);
        if (!targetNode) {
            console.error(`无法找到评论容器 ${COMMENT_CONTAINER_SELECTOR} 进行监听，1秒后重试...`);
            setTimeout(observeContentChanges, 1000);
            return;
        }

        console.log(`开始监听 ${COMMENT_CONTAINER_SELECTOR} 的 DOM 变化以触发更新...`);
        const observer = new MutationObserver((mutationsList) => {
            let relevantChange = false;
            for (const mutation of mutationsList) {
                // 主要检测子节点变化（评论列表更新）或分页控件激活状态变化
                if (mutation.type === 'childList' ||
                    (mutation.type === 'attributes' && mutation.attributeName === 'class' && mutation.target.matches && mutation.target.matches(PAGINATION_CURRENT_PAGE_SELECTOR)))
                {
                     // 如果检测到分页控件的 active class 变化，强制重置上次处理页码
                     if (mutation.type === 'attributes' && mutation.target.matches(PAGINATION_CURRENT_PAGE_SELECTOR)) {
                         const newPageNum = getCurrentPageNumber();
                         if (newPageNum !== lastProcessedPage) {
                             console.log(`检测到分页控件活动页码变化为: ${newPageNum}`);
                             lastProcessedPage = -1; // 强制重新处理
                             relevantChange = true;
                             break;
                         }
                     } else if (mutation.type === 'childList') {
                          // 更宽松的检测：只要有子节点变化就认为可能需要更新
                          relevantChange = true;
                          break;
                     }
                }
            }

            if (relevantChange) {
                 console.log("检测到相关 DOM 变化，计划运行名称替换...");
                 runReplacement(); // 调用主替换函数（内部有防抖）
            }
        });

        observer.observe(targetNode, {
            childList: true, subtree: true, attributes: true, attributeFilter: ['class']
        });
    }

    // 3. 延迟启动首次运行和监听器，给页面足够时间加载初始内容
    setTimeout(() => {
        runReplacement(); // 首次运行
        observeContentChanges(); // 启动监听器
    }, 1500); // 延迟 1.5 秒启动

})();