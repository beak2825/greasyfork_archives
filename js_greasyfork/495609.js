// ==UserScript==
// @name         隐藏帖子自动点赞（特定的人）
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动追踪并点赞某个用户最近的发帖
// @author       嘉心糖
// @match        https://linux.do/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495609/%E9%9A%90%E8%97%8F%E5%B8%96%E5%AD%90%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%EF%BC%88%E7%89%B9%E5%AE%9A%E7%9A%84%E4%BA%BA%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/495609/%E9%9A%90%E8%97%8F%E5%B8%96%E5%AD%90%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%EF%BC%88%E7%89%B9%E5%AE%9A%E7%9A%84%E4%BA%BA%EF%BC%89.meta.js
// ==/UserScript==
(async function () {
    "use strict";

    // 要点赞的用户名
    const username = "LessIsMore";
    // 要搜索的帖子
    const hidePost = "63489";

    let continueLiking = true;
    const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute("content");

    // 获取或初始化已处理的帖子ID集合
    function initializeProcessedPostIds(username) {
        const key = `${username}_liked`;
        const storedIds = JSON.parse(localStorage.getItem(key) || "[]");
        const processedPostIds = new Set(storedIds);
        return { key, processedPostIds };
    }

    const { key, processedPostIds } = initializeProcessedPostIds(username);

    async function sendHeartReaction(postId) {
        try {
            const response = await fetch(
                `/discourse-reactions/posts/${postId}/custom-reactions/heart/toggle.json`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "*/*",
                        "Accept-Encoding": "gzip, deflate, br, zstd",
                        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
                        "X-Csrf-Token": csrfToken,
                        "X-Requested-With": "XMLHttpRequest",
                    },
                    credentials: "include",
                }
            );
            if (response.status === 429) {
                console.error("点赞已经达到上限，脚本停止");
                continueLiking = false; // 设置标志为false来停止进一步的请求
                return;
            }

            const data = await response.json();
            if (data.error_type) {
                console.error("点赞失败，帖子ID:", postId, data.errors.join("; "));
            } else {
                const postNumber = data.post_number;
                const topicId = data.topic_id;
                const url = `https://linux.do/t/topic/${topicId}/${postNumber}`;
                console.log("点赞成功, 帖子ID:", postId, "url:", url);
                processedPostIds.add(postId);
                localStorage.setItem(key, JSON.stringify(Array.from(processedPostIds)));
            }
        } catch (error) {
            console.error("点赞失败，帖子ID:", postId, error);
        }
    }

    async function fetchPostDetails(postId) {
        const response = await fetch(`https://linux.do/posts/${postId}.json`);
        if (!response.ok) throw new Error(`无法获取帖子ID ${postId} 的详细信息`);
        return await response.json();
    }

    async function fetchUserActions(username, hidePost) {
        const response = await fetch(
            `https://linux.do/t/${hidePost}.json?username_filters=${username}`
      );
    if (!response.ok) throw new Error(`无法获取用户 ${username} 的活动`);
    const data = await response.json();
    return data.post_stream.stream;
}

    // 调用 fetchUserActions 函数并输出返回的数据
    const userActions = await fetchUserActions(username, hidePost);
    console.log("获取的帖子ID列表:", userActions);

    while (continueLiking) {
        if (!continueLiking) break; // 检查是否应停止

        const postIds = [];
        console.log(`检查当前列表中，请等待......`);
        // 并发请求帖子详细信息并检查是否已点赞
        for (const postId of userActions) {
            if (!processedPostIds.has(postId)) {
                try {
                    const postDetails = await fetchPostDetails(postId);
                    const userReacted =
                          postDetails.current_user_reaction &&
                          postDetails.current_user_reaction.id === "heart";
                    if (!userReacted) {
                        postIds.push(postId);
                        console.log(`帖子ID ${postId} 加入点赞队列`);
                    } else {
                        processedPostIds.add(postId);
                        localStorage.setItem(
                            key,
                            JSON.stringify(Array.from(processedPostIds))
                        );
                        console.log(`帖子ID ${postId} 已点赞，数据更新:`);
                    }
                    await new Promise((resolve) => setTimeout(resolve, 500)); // 测试发现没有限制，网速好的话可以删掉这一行（不推荐）
                } catch (error) {
                    console.error(`处理帖子ID ${postId} 失败`, error);
                }
            } else {
                console.log(`帖子ID ${postId} 已点赞，跳过`);
            }
        }

        // 发送点赞请求
        for (const postId of postIds) {
            if (!continueLiking) break;
            await sendHeartReaction(postId);
            await new Promise((resolve) => setTimeout(resolve, 1000)); // 控制点赞请求间隔
        }
    }
})();
