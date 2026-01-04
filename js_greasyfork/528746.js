// ==UserScript==
// @name         哔哩哔哩视频自动点赞/区分视频是否看过
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description   哔哩哔哩自动点赞, bilibili 自动点赞, B站自动点赞, b站自动点赞。支持视频、番剧。增加已点赞检测功能。支持仅为已关注UP主点赞。
// @author       happylittle
// @copyright    2025, happylittle (https://github.com/happylittle2010)
// @license      MIT
// @match        *://www.bilibili.com/video/av*
// @match        *://www.bilibili.com/video/BV*
// @match         *://www.bilibili.com/list/*
// @match         *://www.bilibili.com/bangumi/play/ep*
// @match         *://www.bilibili.com/bangumi/play/ss*
// @match         *://www.bilibili.com/cheese/play/ep*
// @match         *://www.bilibili.com/cheese/play/ss*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/528746/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%E5%8C%BA%E5%88%86%E8%A7%86%E9%A2%91%E6%98%AF%E5%90%A6%E7%9C%8B%E8%BF%87.user.js
// @updateURL https://update.greasyfork.org/scripts/528746/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%E5%8C%BA%E5%88%86%E8%A7%86%E9%A2%91%E6%98%AF%E5%90%A6%E7%9C%8B%E8%BF%87.meta.js
// ==/UserScript==

(function () {
    const likeButtonSelectors = ["div.video-like", "#like_info"];
    const likedClassSelectors = [".on", ".liked"]; // 点赞后的CSS类
    const followButtonSelectors = [".already-btn.van-popover__reference", ".follow-btn.following"]; // 关注按钮选择器
    const LOG_PREFIX = "[BiliAutoLike] "; // 日志前缀

    // 设置默认值
    let timeThreshold = GM_getValue('timeThreshold', 30000);
    let onlyLikeFollowed = GM_getValue('onlyLikeFollowed', true); // 是否仅为已关注的UP主点赞

    // 日志函数
    function log(message) {
        console.log(LOG_PREFIX + message);
    }

    // 添加设置菜单
    GM_registerMenuCommand("设置点赞时间阈值", function() {
        const inputTime = prompt('请输入点赞时间阈值（单位：毫秒）:', timeThreshold);
        if (inputTime !== null) {
            timeThreshold = parseInt(inputTime);
            GM_setValue('timeThreshold', timeThreshold);
            log(`点赞时间阈值已更新为: ${timeThreshold}ms`);
        }
    });

    // 添加仅为已关注UP主点赞的设置菜单
    GM_registerMenuCommand("设置是否仅为已关注UP主点赞", function() {
        const options = onlyLikeFollowed ? "1" : "0";
        const input = prompt('请选择是否仅为已关注UP主点赞:\n0 - 为所有视频点赞\n1 - 仅为已关注UP主的视频点赞', options);

        if (input !== null) {
            const newValue = input === "1";
            if (newValue !== onlyLikeFollowed) {
                onlyLikeFollowed = newValue;
                GM_setValue('onlyLikeFollowed', onlyLikeFollowed);
                log(`仅为已关注UP主点赞: ${onlyLikeFollowed ? '已启用' : '已禁用'}`);
            }
        }
    });

    function triggerMouseEvent(node, eventType) {
        var clickEvent = document.createEvent('MouseEvents');
        clickEvent.initEvent(eventType, true, true);
        node.dispatchEvent(clickEvent);
    }

    function isAlreadyLiked(likeButton) {
        // 检查是否已经点赞
        for (const likedClass of likedClassSelectors) {
            if (likeButton.classList.contains(likedClass.replace('.', '')) ||
                likeButton.querySelector(likedClass)) {
                log(`检测到已点赞状态: ${likedClass}`);
                return true;
            }
        }
        log("未检测到点赞状态，将尝试点赞");
        return false;
    }

    // 检查是否已关注UP主
    function isFollowingAuthor() {
        for (const selector of followButtonSelectors) {
            const followButton = document.querySelector(selector);
            if (followButton) {
                // 检查关注按钮的文本或类名是否表示已关注
                if (followButton.innerText && followButton.innerText.includes("已关注") ||
                    followButton.classList.contains("following")) {
                    log("检测到已关注UP主");
                    return true;
                }
            }
        }
        log("未检测到已关注UP主");
        return false;
    }

    function observeAndLike(likeButton) {
        if (likeButton) {
            log("找到点赞按钮");
            // 检查是否已经点赞
            if (isAlreadyLiked(likeButton)) {
                log('已经点过赞了，无需再次点赞');
                return;
            }

            // 如果设置了仅为已关注UP主点赞，则检查是否已关注
            if (onlyLikeFollowed) {
                if (!isFollowingAuthor()) {
                    log('未关注该UP主，根据设置不进行点赞');
                    return;
                }
                log('已关注该UP主，将进行点赞');
            }

            const observer = new MutationObserver(() => {
                log('点赞成功，按钮状态已变化');
                observer.disconnect();
            });

            // 监听点赞按钮的变化
            observer.observe(likeButton, { attributes: true, childList: true, subtree: true });

            // 触发点赞事件
            log("开始触发点赞事件");
            triggerMouseEvent(likeButton, "mouseover");
            triggerMouseEvent(likeButton, "mousedown");
            triggerMouseEvent(likeButton, "mouseup");
            triggerMouseEvent(likeButton, "click");
            log("点赞事件已触发");
        } else {
            log("未找到点赞按钮");
        }
    }

    function findAndObserveLikeButton() {
        log("开始查找点赞按钮");
        let found = false;
        for (const selector of likeButtonSelectors) {
            const likeButton = document.querySelector(selector);
            if (likeButton) {
                log(`找到点赞按钮: ${selector}`);
                observeAndLike(likeButton);
                found = true;
                break;
            }
        }
        if (!found) {
            log("未找到任何点赞按钮，可能需要更新选择器");
        }
    }

    // 添加视频切换监听
    function addVideoChangeListener() {
        log("初始化视频切换监听");
        // 监听URL变化，用于处理视频切换
        let lastUrl = location.href;
        log(`当前URL: ${lastUrl}`);

        const urlObserver = new MutationObserver(() => {
            if (location.href !== lastUrl) {
                log(`URL变化: ${lastUrl} -> ${location.href}`);
                lastUrl = location.href;
                log(`将在 ${timeThreshold}ms 后尝试点赞`);
                setTimeout(findAndObserveLikeButton, timeThreshold);
            }
        });

        urlObserver.observe(document, { subtree: true, childList: true });
        log("视频切换监听已启动");
    }

    // 初始化
    log(`脚本已启动，将在 ${timeThreshold}ms 后尝试点赞`);
    log(`仅为已关注UP主点赞: ${onlyLikeFollowed ? '已启用' : '已禁用'}`);
    setTimeout(findAndObserveLikeButton, timeThreshold);
    addVideoChangeListener();
})();