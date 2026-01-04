// ==UserScript==
// @name         极度科技-免费版AI自动微博监控最新帖子并可选自动点赞、评论、转发
// @namespace    http://123.249.32.20/
// @version      1.18
// @description  免费版AI自动微博监控最新帖子并可选自动点赞、评论、转发
// @author       土豆：@rjdz123
// @match        https://weibo.com/u/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weibo.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      weibo.com
// @connect      dashscope.aliyuncs.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512886/%E6%9E%81%E5%BA%A6%E7%A7%91%E6%8A%80-%E5%85%8D%E8%B4%B9%E7%89%88AI%E8%87%AA%E5%8A%A8%E5%BE%AE%E5%8D%9A%E7%9B%91%E6%8E%A7%E6%9C%80%E6%96%B0%E5%B8%96%E5%AD%90%E5%B9%B6%E5%8F%AF%E9%80%89%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%E3%80%81%E8%AF%84%E8%AE%BA%E3%80%81%E8%BD%AC%E5%8F%91.user.js
// @updateURL https://update.greasyfork.org/scripts/512886/%E6%9E%81%E5%BA%A6%E7%A7%91%E6%8A%80-%E5%85%8D%E8%B4%B9%E7%89%88AI%E8%87%AA%E5%8A%A8%E5%BE%AE%E5%8D%9A%E7%9B%91%E6%8E%A7%E6%9C%80%E6%96%B0%E5%B8%96%E5%AD%90%E5%B9%B6%E5%8F%AF%E9%80%89%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%E3%80%81%E8%AF%84%E8%AE%BA%E3%80%81%E8%BD%AC%E5%8F%91.meta.js
// ==/UserScript==

/*
MIT License

版权所有 (c) 2024 极度科技

特此授予任何获得本软件及相关文档文件（“软件”）副本的人，免费许可使用本软件，无论是出于使用、复制、修改、合并、出版、发布、分发、再许可及/或销售软件的权利，并允许被授予此权利的人在符合以下条件的情况下这样做：

上述版权声明和本许可声明应包含在软件的所有副本或主要部分中。

本软件按“原样”提供，不附带任何明示或暗示的担保，包括但不限于对适销性、特定用途的适用性及非侵权的担保。无论在何种情况下，作者或版权持有者均不对因软件或软件的使用或其他交易产生或与之相关的任何索赔、损害或其他责任承担责任。
*/

(function() {
    'use strict';

    console.log("Weibo Latest Post Monitor with Auto-Like, Comment, Repost 脚本已加载。");

    // 初始化设置
    const DEFAULT_INTERVAL = 60000; // 默认60秒
    const SETTING_KEY = 'weibo_monitor_settings';
    const LIKED_MIDS_KEY = 'weibo_liked_mids';
    const COMMENTED_MIDS_KEY = 'weibo_commented_mids';
    const REPOSTED_MIDS_KEY = 'weibo_reposted_mids';
    const LIKE_RETRIES_KEY = 'weibo_like_retries';
    const COMMENT_RETRIES_KEY = 'weibo_comment_retries';
    const REPOST_RETRIES_KEY = 'weibo_repost_retries';

    // 获取或设置默认配置
    let settings = GM_getValue(SETTING_KEY, {
        interval: DEFAULT_INTERVAL,
        autoLike: false,
        autoComment: false,
        autoRepost: false,
        aiApiKey: '',
        defaultReply: "极度科技-免费版AI自动监控微博最新帖子并可选自动点赞、评论、转发联系157574701(备注免费js脚本)[功能：1.自动获取登录账号的Cookie2.自动筛选判断最新帖子3.可设置是否点赞、是否评论、是否转发4.可对接AI自动生成回复内容和转发内容]"
    });

    // 如果默认回复内容未设置或为空，则设置为默认字符串
    if (!settings.defaultReply || settings.defaultReply.trim() === "") {
        settings.defaultReply = "极度科技-免费版AI自动监控微博最新帖子并可选自动点赞、评论、转发联系157574701(备注免费js脚本)[功能：1.自动获取登录账号的Cookie2.自动筛选判断最新帖子3.可设置是否点赞、是否评论、是否转发4.可对接AI自动生成回复内容和转发内容]";
        GM_setValue(SETTING_KEY, settings);
        console.log("默认回复内容已设置为预定义字符串。");
    }

    // 获取已执行的操作列表
    let likedMids = GM_getValue(LIKED_MIDS_KEY, []);
    let commentedMids = GM_getValue(COMMENTED_MIDS_KEY, []);
    let repostedMids = GM_getValue(REPOSTED_MIDS_KEY, []);

    // 获取操作重试次数
    let likeRetries = GM_getValue(LIKE_RETRIES_KEY, {});
    let commentRetries = GM_getValue(COMMENT_RETRIES_KEY, {});
    let repostRetries = GM_getValue(REPOST_RETRIES_KEY, {});

    // 1. 自动提取UID
    const url = window.location.href;
    const uidMatch = url.match(/https:\/\/weibo\.com\/u\/(\d+)/);
    if (!uidMatch || uidMatch.length < 2) {
        alert("无法从URL中提取UID，请确保URL格式为 https://weibo.com/u/UID");
        console.error("URL不匹配或未找到UID:", url);
        return;
    }
    const uid = uidMatch[1];
    console.log("提取到的UID:", uid);

    // 2. 获取当前页面的Cookie
    const cookie = document.cookie;
    if (!cookie) {
        alert("无法获取Cookie，请确保已登录微博并重试。");
        console.error("未获取到Cookie。");
        return;
    }

    // 3. 从Cookie中解析XSRF-TOKEN
    const xsrfMatch = cookie.match(/XSRF-TOKEN=([^;]+)/);
    if (!xsrfMatch) {
        alert("未找到XSRF-TOKEN，请检查Cookie是否包含该项。");
        console.error("未找到XSRF-TOKEN:", cookie);
        return;
    }
    const xsrfToken = decodeURIComponent(xsrfMatch[1]);
    console.log("提取到的XSRF-TOKEN:", xsrfToken);

    // 4. 创建配置面板
    function createConfigPanel() {
        // 检查是否已存在配置面板
        if (document.getElementById('weibo-config-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'weibo-config-panel';
        panel.style.position = 'fixed';
        panel.style.top = '10px';
        panel.style.right = '10px';
        panel.style.padding = '25px';
        panel.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        panel.style.color = '#333';
        panel.style.borderRadius = '12px';
        panel.style.zIndex = '10000';
        panel.style.fontSize = '15px';
        panel.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
        panel.style.maxWidth = '500px';
        panel.style.fontFamily = 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif';
        panel.style.transition = 'all 0.3s ease';
        panel.style.overflowY = 'auto';
        panel.style.maxHeight = '90vh';

        panel.innerHTML = `
            <h3 style="margin-top:0; text-align:center; color:#4CAF50;">微博监控设置</h3>
            <div style="display: flex; align-items: center; margin-bottom: 15px; justify-content: space-between;">
                <label style="flex: 1; margin-right: 10px;">
                    <input type="checkbox" id="auto-like" ${settings.autoLike ? 'checked' : ''} style="margin-right: 5px;">
                    自动点赞
                </label>
                <label style="flex: 1; margin-right: 10px;">
                    <input type="checkbox" id="auto-comment" ${settings.autoComment ? 'checked' : ''} style="margin-right: 5px;">
                    自动评论
                </label>
                <label style="flex: 1;">
                    <input type="checkbox" id="auto-repost" ${settings.autoRepost ? 'checked' : ''} style="margin-right: 5px;">
                    自动转发
                </label>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <label style="flex: 1;">
                    千义通问 API Key:
                    <input type="text" id="ai-api-key" value="${settings.aiApiKey}" placeholder="请输入千义通问 API Key" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; margin-top: 5px;">
                </label>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 20px;">
                <label style="flex: 1;">
                    默认回复内容(未输入千义通问Key的这里就必须要输入默认回复内容):
                    <input type="text" id="default-reply" value="${settings.defaultReply}" placeholder="请输入默认回复内容" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; margin-top: 5px;">
                </label>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <label style="flex: 1; margin-right: 10px;">
                    监控间隔 (秒):
                    <input type="number" id="monitor-interval" min="1" value="${settings.interval / 1000}" style="width: 80px; margin-left: 10px; padding: 5px; border: 1px solid #ccc; border-radius: 4px;">
                </label>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                <button id="save-settings-button" style="padding: 8px 16px; background-color: #4CAF50; color: #fff; border: none; border-radius: 4px; cursor: pointer; flex: 1; margin-right: 10px;">保存设置</button>
                <button id="close-panel" style="padding: 8px 16px; background-color: #f44336; color: #fff; border: none; border-radius: 4px; cursor: pointer; flex: 1;">关闭</button>
            </div>
            <div style="font-size: 13px; color: #666; line-height: 1.5; text-align: center;">
                联系作者QQ157574701 wx:jdwl06001(备注免费js脚本)
                <br>
                <p style="color:#CC6666;">使用教程：</p>
                第一步：如访问地址：https://weibo.com/u/5648401674
                <br>
                第二步：设置检测时间、是否点赞、是否评论、是否转发，输入千义通问 API Key（输入后使用AI生成回复内容,不输入使用默认回复内容）
                <br>
                第三步：保存配置自动刷新页面，如需更换检测博主需主动刷新页面确认更换检测博主
                <br>
                <a href="https://bailian.console.aliyun.com/?apiKey=1#/api-key" target="_blank" style="color: #4CAF50; text-decoration: underline;">千义通问 API Key申请地址</a>
                <br>
                （需登录阿里云且实名账号，赠送100万Token 免费额度有效期为180天）
            </div>
        `;

        document.body.appendChild(panel);

        // 绑定保存设置按钮事件
        document.getElementById('save-settings-button').addEventListener('click', () => {
            const autoLikeInput = document.getElementById('auto-like').checked;
            const autoCommentInput = document.getElementById('auto-comment').checked;
            const autoRepostInput = document.getElementById('auto-repost').checked;
            const aiApiKeyInput = document.getElementById('ai-api-key').value.trim();
            const defaultReplyInput = document.getElementById('default-reply').value.trim();
            const intervalInput = document.getElementById('monitor-interval').value.trim();

            // 如果监控间隔输入无效，使用默认值
            let parsedInterval = parseInt(intervalInput) * 1000;
            if (isNaN(parsedInterval) || parsedInterval < 1000) {
                alert("监控间隔输入无效，使用默认值60秒。");
                parsedInterval = DEFAULT_INTERVAL;
            }

            const newSettings = {
                interval: parsedInterval, // 转换为毫秒
                autoLike: autoLikeInput,
                autoComment: autoCommentInput,
                autoRepost: autoRepostInput,
                aiApiKey: aiApiKeyInput,
                defaultReply: defaultReplyInput || "极度科技-免费版AI自动监控微博最新帖子并可选自动点赞、评论、转发联系157574701(备注免费js脚本)[功能：1.自动获取登录账号的Cookie2.自动筛选判断最新帖子3.可设置是否点赞、是否评论、是否转发4.可对接AI自动生成回复内容和转发内容]"
            };

            // 更新设置
            GM_setValue(SETTING_KEY, newSettings);
            settings = newSettings;
            console.log("设置已保存:", settings);

            alert("设置已保存，页面即将刷新以应用新设置。");
            window.location.reload();
        });

        // 绑定关闭按钮事件
        document.getElementById('close-panel').addEventListener('click', () => {
            panel.style.display = 'none';
        });
    }

    // 5. 创建信息显示区域
    function createInfoDisplay() {
        let infoDiv = document.getElementById('latest-post-info');
        if (!infoDiv) {
            infoDiv = document.createElement('div');
            infoDiv.id = 'latest-post-info';
            infoDiv.style.position = 'fixed';
            infoDiv.style.bottom = '20px';
            infoDiv.style.right = '20px';
            infoDiv.style.padding = '20px';
            infoDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            infoDiv.style.color = '#333';
            infoDiv.style.borderRadius = '12px';
            infoDiv.style.zIndex = '10000';
            infoDiv.style.fontSize = '15px';
            infoDiv.style.maxWidth = '350px';
            infoDiv.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
            infoDiv.style.fontFamily = 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif';
            infoDiv.style.overflowY = 'auto';
            infoDiv.style.maxHeight = '300px';
            document.body.appendChild(infoDiv);
        }
        return infoDiv;
    }

    // 6. 转换时间格式
    function convertTime(createdAt) {
        const date = new Date(createdAt);
        return date.toLocaleString();
    }

    // 7. 发送点赞请求
    function sendLike(mid) {
        const likeUrl = `https://weibo.com/ajax/statuses/setLike`;

        const likePayload = JSON.stringify({ id: mid });

        GM_xmlhttpRequest({
            method: "POST",
            url: likeUrl,
            headers: {
                "Content-Type": "application/json",
                "X-XSRF-TOKEN": xsrfToken,
                "Referer": `https://weibo.com/u/${uid}`,
                "Origin": "https://weibo.com"
            },
            data: likePayload,
            onload: function(response) {
                if (response.status !== 200) {
                    console.error(`点赞请求失败，状态码：${response.status}`);
                    infoDiv.insertAdjacentHTML('beforeend', `<br>❌ 点赞失败 MID: ${mid}`);
                    return;
                }

                try {
                    const json = JSON.parse(response.responseText);
                    if (json.ok === 1) {
                        console.log(`点赞成功，MID: ${mid}`);
                        // 记录已点赞的mid
                        if (!likedMids.includes(mid)) {
                            likedMids.push(mid);
                            GM_setValue(LIKED_MIDS_KEY, likedMids);
                        }
                        // 更新显示信息
                        infoDiv.insertAdjacentHTML('beforeend', `<br>👍 已点赞`);
                    } else {
                        console.warn(`点赞失败，MID: ${mid}`);
                        infoDiv.insertAdjacentHTML('beforeend', `<br>❌ 点赞失败 MID: ${mid}，原因：${json.message}`);
                    }
                } catch (e) {
                    console.error("解析点赞响应数据时发生错误:", e);
                }
            },
            onerror: function(error) {
                console.error("点赞请求过程中发生错误:", error);
                infoDiv.insertAdjacentHTML('beforeend', `<br>❌ 点赞请求错误 MID: ${mid}`);
            }
        });
    }

    // 8. 发送评论请求
    function sendComment(mid, commentContent) {
        const retryCount = commentRetries[mid] || 0;
        if (retryCount >= 3) {
            console.warn(`评论已达到最大重试次数，MID: ${mid}`);
            return;
        }

        const commentUrl = `https://weibo.com/ajax/comments/create`;

        const commentPayload = `id=${mid}&comment=${encodeURIComponent(commentContent)}&pic_id=&is_repost=0&comment_ori=0&is_comment=0`;

        GM_xmlhttpRequest({
            method: "POST",
            url: commentUrl,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "X-XSRF-TOKEN": xsrfToken,
                "Referer": `https://weibo.com/u/${uid}`,
                "Origin": "https://weibo.com"
            },
            data: commentPayload,
            onload: function(response) {
                if (response.status !== 200) {
                    console.error(`评论请求失败，状态码：${response.status}`);
                    commentRetries[mid] = retryCount + 1;
                    GM_setValue(COMMENT_RETRIES_KEY, commentRetries);
                    infoDiv.insertAdjacentHTML('beforeend', `<br>❌ 评论失败 MID: ${mid}，重试次数：${commentRetries[mid]}`);
                    return;
                }

                try {
                    const json = JSON.parse(response.responseText);
                    if (json.ok === 1) {
                        console.log(`评论成功，MID: ${mid}`);
                        // 记录已评论的mid
                        if (!commentedMids.includes(mid)) {
                            commentedMids.push(mid);
                            GM_setValue(COMMENTED_MIDS_KEY, commentedMids);
                        }
                        // 清除重试次数
                        delete commentRetries[mid];
                        GM_setValue(COMMENT_RETRIES_KEY, commentRetries);
                        // 更新显示信息
                        infoDiv.insertAdjacentHTML('beforeend', `<br>💬 已评论`);
                    } else {
                        console.warn(`评论失败，MID: ${mid}，原因: ${json.message}`);
                        commentRetries[mid] = retryCount + 1;
                        GM_setValue(COMMENT_RETRIES_KEY, commentRetries);
                        infoDiv.insertAdjacentHTML('beforeend', `<br>❌ 评论失败 MID: ${mid}，原因：${json.message}，重试次数：${commentRetries[mid]}`);
                    }
                } catch (e) {
                    console.error("解析评论响应数据时发生错误:", e);
                    commentRetries[mid] = retryCount + 1;
                    GM_setValue(COMMENT_RETRIES_KEY, commentRetries);
                    infoDiv.insertAdjacentHTML('beforeend', `<br>❌ 评论失败 MID: ${mid}，解析错误，重试次数：${commentRetries[mid]}`);
                }
            },
            onerror: function(error) {
                console.error("评论请求过程中发生错误:", error);
                commentRetries[mid] = retryCount + 1;
                GM_setValue(COMMENT_RETRIES_KEY, commentRetries);
                infoDiv.insertAdjacentHTML('beforeend', `<br>❌ 评论请求错误 MID: ${mid}，重试次数：${commentRetries[mid]}`);
            }
        });
    }

    // 9. 发送转发请求
    function sendRepost(mid, repostContent) {
        const retryCount = repostRetries[mid] || 0;
        if (retryCount >= 3) {
            console.warn(`转发已达到最大重试次数，MID: ${mid}`);
            return;
        }

        const repostUrl = `https://weibo.com/ajax/statuses/normal_repost`;

        const repostPayload = `id=${mid}&comment=${encodeURIComponent(repostContent)}&pic_id=&is_repost=0&comment_ori=0&is_comment=0&visible=0&share_id=`;

        GM_xmlhttpRequest({
            method: "POST",
            url: repostUrl,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "X-XSRF-TOKEN": xsrfToken,
                "Referer": `https://weibo.com/u/${uid}`,
                "Origin": "https://weibo.com"
            },
            data: repostPayload,
            onload: function(response) {
                if (response.status !== 200) {
                    console.error(`转发请求失败，状态码：${response.status}`);
                    repostRetries[mid] = retryCount + 1;
                    GM_setValue(REPOST_RETRIES_KEY, repostRetries);
                    infoDiv.insertAdjacentHTML('beforeend', `<br>❌ 转发失败 MID: ${mid}，重试次数：${repostRetries[mid]}`);
                    return;
                }

                try {
                    const json = JSON.parse(response.responseText);
                    if (json.ok === 1) {
                        console.log(`转发成功，MID: ${mid}`);
                        // 记录已转发的mid
                        if (!repostedMids.includes(mid)) {
                            repostedMids.push(mid);
                            GM_setValue(REPOSTED_MIDS_KEY, repostedMids);
                        }
                        // 清除重试次数
                        delete repostRetries[mid];
                        GM_setValue(REPOST_RETRIES_KEY, repostRetries);
                        // 更新显示信息
                        infoDiv.insertAdjacentHTML('beforeend', `<br>🔁 已转发`);
                    } else {
                        console.warn(`转发失败，MID: ${mid}，原因: ${json.message}`);
                        repostRetries[mid] = retryCount + 1;
                        GM_setValue(REPOST_RETRIES_KEY, repostRetries);
                        infoDiv.insertAdjacentHTML('beforeend', `<br>❌ 转发失败 MID: ${mid}，原因：${json.message}，重试次数：${repostRetries[mid]}`);
                    }
                } catch (e) {
                    console.error("解析转发响应数据时发生错误:", e);
                    repostRetries[mid] = retryCount + 1;
                    GM_setValue(REPOST_RETRIES_KEY, repostRetries);
                    infoDiv.insertAdjacentHTML('beforeend', `<br>❌ 转发失败 MID: ${mid}，解析错误，重试次数：${repostRetries[mid]}`);
                }
            },
            onerror: function(error) {
                console.error("转发请求过程中发生错误:", error);
                repostRetries[mid] = retryCount + 1;
                GM_setValue(REPOST_RETRIES_KEY, repostRetries);
                infoDiv.insertAdjacentHTML('beforeend', `<br>❌ 转发请求错误 MID: ${mid}，重试次数：${repostRetries[mid]}`);
            }
        });
    }

    // 10. 使用AI生成评论内容
    async function generateAIComment(postText) {
        if (!settings.aiApiKey) {
            console.warn("未提供AI API Key，使用默认评论。");
            return settings.defaultReply;
        }

        try {
            const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${settings.aiApiKey}`
                },
                body: JSON.stringify({
                    model: "qwen-turbo",
                    messages: [
                        { role: 'system', content: '你是一个评论大师，按照这个帖子内容给我写一条十字左右的评论' },
                        { role: 'user', content: postText }
                    ]
                })
            });

            if (!response.ok) {
                console.error(`AI 请求失败，状态码：${response.status}`);
                return settings.defaultReply;
            }

            const data = await response.json();
            const aiComment = data.choices && data.choices[0].message.content.trim();
            if (aiComment) {
                console.log(`AI生成的评论: ${aiComment}`);
                return aiComment;
            } else {
                console.warn("AI 未生成有效的评论，使用默认评论。");
                return settings.defaultReply;
            }
        } catch (error) {
            console.error("AI生成评论时发生错误:", error);
            return settings.defaultReply;
        }
    }

    // 11. 使用AI生成转发内容
    async function generateAIRepost(postText) {
        if (!settings.aiApiKey) {
            console.warn("未提供AI API Key，使用默认转发内容。");
            return settings.defaultReply;
        }

        try {
            const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${settings.aiApiKey}`
                },
                body: JSON.stringify({
                    model: "qwen-turbo",
                    messages: [
                        { role: 'system', content: '你是一个评论大师，按照这个帖子内容给我写一条十字左右的转发内容' },
                        { role: 'user', content: postText }
                    ]
                })
            });

            if (!response.ok) {
                console.error(`AI 请求失败，状态码：${response.status}`);
                return settings.defaultReply;
            }

            const data = await response.json();
            const aiRepost = data.choices && data.choices[0].message.content.trim();
            if (aiRepost) {
                console.log(`AI生成的转发内容: ${aiRepost}`);
                return aiRepost;
            } else {
                console.warn("AI 未生成有效的转发内容，使用默认转发内容。");
                return settings.defaultReply;
            }
        } catch (error) {
            console.error("AI生成转发内容时发生错误:", error);
            return settings.defaultReply;
        }
    }

    // 12. 获取并处理最新帖子
    let lastProcessedMid = null;
    async function fetchLatestPost() {
        const apiUrl = `https://weibo.com/ajax/statuses/mymblog?uid=${uid}&page=1&feature=0`;
        console.log("请求URL:", apiUrl);

        GM_xmlhttpRequest({
            method: "GET",
            url: apiUrl,
            headers: {
                "X-XSRF-TOKEN": xsrfToken,
                "Referer": `https://weibo.com/u/${uid}`
            },
            onload: async function(response) {
                console.log("请求完成，状态码:", response.status);
                if (response.status !== 200) {
                    console.error(`请求失败，状态码：${response.status}`, response.responseText);
                    infoDiv.innerHTML = `请求失败，状态码：${response.status}`;
                    return;
                }

                try {
                    const json = JSON.parse(response.responseText);
                    console.log("响应JSON数据:", json);
                    if (!json.data || !json.data.list || json.data.list.length === 0) {
                        console.warn("未找到微博数据。");
                        infoDiv.innerHTML = `未找到微博数据。`;
                        return;
                    }

                    const posts = json.data.list;
                    let latestPost = null;
                    let latestDate = null;

                    // 遍历所有帖子，找出最新的
                    posts.forEach(post => {
                        const mid = post.mid;
                        const createdAt = post.created_at;
                        const date = new Date(createdAt);
                        console.log(`帖子 MID: ${mid}, 发布时间: ${createdAt}`);
                        if (!latestDate || date > latestDate) {
                            latestDate = date;
                            latestPost = post;
                        }
                    });

                    if (latestPost) {
                        const latestMid = latestPost.mid;

                        // 如果是新帖子，清除之前的重试次数
                        if (lastProcessedMid && lastProcessedMid !== latestMid) {
                            likeRetries = {};
                            commentRetries = {};
                            repostRetries = {};
                            GM_setValue(LIKE_RETRIES_KEY, likeRetries);
                            GM_setValue(COMMENT_RETRIES_KEY, commentRetries);
                            GM_setValue(REPOST_RETRIES_KEY, repostRetries);
                        }

                        lastProcessedMid = latestMid;

                        const latestCreatedAt = convertTime(latestPost.created_at);
                        let postText = latestPost.text || '';
                        // 处理文本，去除HTML标签
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = postText;
                        postText = tempDiv.textContent || tempDiv.innerText || '';

                        // 截取前10个字符
                        const displayText = postText.substring(0, 10);

                        // 检查是否已点赞、评论、转发
                        const alreadyLiked = likedMids.includes(latestMid);
                        const alreadyCommented = commentedMids.includes(latestMid);
                        const alreadyReposted = repostedMids.includes(latestMid);

                        // 状态信息
                        let statusInfo = '';

                        infoDiv.innerHTML = `<strong>最新微博:</strong><br>内容: ${displayText}...<br>MID: ${latestMid}`;

                        // 自动点赞
                        if (settings.autoLike) {
                            if (alreadyLiked) {
                                statusInfo += `<br>👍 已点赞`;
                            } else if ((likeRetries[latestMid] || 0) < 3) {
                                sendLike(latestMid);
                            } else {
                                statusInfo += `<br>❌ 点赞失败，已达到最大重试次数`;
                            }
                        }

                        // 自动评论
                        if (settings.autoComment) {
                            if (alreadyCommented) {
                                statusInfo += `<br>💬 已评论`;
                            } else if ((commentRetries[latestMid] || 0) < 3) {
                                const commentContent = await generateAIComment(postText) || settings.defaultReply;
                                sendComment(latestMid, commentContent);
                            } else {
                                statusInfo += `<br>❌ 评论失败，已达到最大重试次数`;
                            }
                        }

                        // 自动转发
                        if (settings.autoRepost) {
                            if (alreadyReposted) {
                                statusInfo += `<br>🔁 已转发`;
                            } else if ((repostRetries[latestMid] || 0) < 3) {
                                const repostContent = await generateAIRepost(postText) || settings.defaultReply;
                                sendRepost(latestMid, repostContent);
                            } else {
                                statusInfo += `<br>❌ 转发失败，已达到最大重试次数`;
                            }
                        }

                        // 更新状态信息
                        infoDiv.insertAdjacentHTML('beforeend', statusInfo);

                    } else {
                        console.warn("未找到最新的帖子。");
                        infoDiv.innerHTML = `未找到最新的帖子。`;
                    }

                } catch (e) {
                    console.error("解析响应数据时发生错误:", e);
                    infoDiv.innerHTML = `解析响应数据时发生错误。`;
                }
            },
            onerror: function(error) {
                console.error("请求过程中发生错误:", error);
                infoDiv.innerHTML = `请求过程中发生错误。`;
            }
        });
    }

    // 13. 创建配置按钮
    function createConfigButton() {
        let button = document.getElementById('weibo-config-button');
        if (!button) {
            button = document.createElement('button');
            button.id = 'weibo-config-button';
            button.innerText = '微博监控设置';
            button.style.position = 'fixed';
            button.style.top = '20px';
            button.style.right = '20px'; // 固定在最右侧
            button.style.padding = '10px 20px';
            button.style.backgroundColor = '#4CAF50';
            button.style.color = '#fff';
            button.style.border = 'none';
            button.style.borderRadius = '5px';
            button.style.cursor = 'pointer';
            button.style.zIndex = '10000';
            button.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
            button.style.fontSize = '16px';
            button.style.fontFamily = 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif';
            button.style.transition = 'background-color 0.3s ease, transform 0.2s ease';

            document.body.appendChild(button);

            button.addEventListener('click', () => {
                createConfigPanel();
            });

            // 添加悬停效果
            button.addEventListener('mouseover', () => {
                button.style.backgroundColor = '#45a049';
                button.style.transform = 'scale(1.05)';
            });
            button.addEventListener('mouseout', () => {
                button.style.backgroundColor = '#4CAF50';
                button.style.transform = 'scale(1)';
            });
        }
    }

    // 14. 创建信息显示区域
    const infoDiv = createInfoDisplay();

    // 15. 创建配置按钮
    createConfigButton();

    // 16. 初始调用
    fetchLatestPost();

    // 17. 设置定时任务
    function startMonitor() {
        // 清现有的定时器（如果有）
        if (window.monitorIntervalId) {
            clearInterval(window.monitorIntervalId);
        }
        window.monitorIntervalId = setInterval(() => {
            console.log("定时任务：获取最新帖子");
            fetchLatestPost();
        }, settings.interval);
    }

    // 启动监控
    startMonitor();

})();
