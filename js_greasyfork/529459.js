// ==UserScript==
// @name         油管用户屏蔽
// @namespace    http://tampermonkey.net/
// @version      5.2
// @description  允许通过右键菜单屏蔽 YouTube 用户视频或评论，支持动态加载内容，预先隐藏被屏蔽元素
// @author       Grok (xAI)
// @match        https://www.youtube.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/529459/%E6%B2%B9%E7%AE%A1%E7%94%A8%E6%88%B7%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/529459/%E6%B2%B9%E7%AE%A1%E7%94%A8%E6%88%B7%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 从视频渲染器中提取用户名
    function getUsernameTextFromRenderer(renderer) {
        let usernameElements = renderer.querySelectorAll("ytd-channel-name a.yt-simple-endpoint yt-formatted-string");
        for (let elem of usernameElements) {
            if (elem.textContent.trim()) {
                return elem.textContent.trim().replace(/^@/, '');
            }
        }
        let channelNameElement = renderer.querySelector("ytd-channel-name yt-formatted-string#text");
        if (channelNameElement) {
            return channelNameElement.textContent.trim().replace(/^@/, '');
        }
        return null;
    }

    // 从评论元素中提取用户名（主评论和回复）
    function getUsernameTextFromCommentElement(element) {
        let usernameElement = element.querySelector("h3 span.style-scope.ytd-comment-view-model");
        if (usernameElement) {
            return usernameElement.textContent.trim().replace(/^@/, '').replace(/\n/g, '');
        }
        let fallbackElement = element.querySelector("h3 a.yt-simple-endpoint");
        if (fallbackElement) {
            return fallbackElement.textContent.trim().replace(/^@/, '').replace(/\n/g, '');
        }
        return null;
    }

    // 隐藏被屏蔽用户内容
    function hideBlockedUserContent(rootNode) {
        let blockedUsers = GM_getValue("blockedUsers", []).map(user => user.replace(/\n/g, '').trim().replace(/^@/, ''));
        let blockedCommentUsers = GM_getValue("blockedCommentUsers", []).map(user => user.replace(/\n/g, '').trim().replace(/^@/, ''));

        // 处理视频渲染器（将 ytd-rich-grid-media 替换为 ytd-rich-item-renderer）
        ["ytd-video-renderer", "ytd-compact-video-renderer", "ytd-grid-video-renderer", "ytd-rich-item-renderer"].forEach(rendererType => {
            rootNode.querySelectorAll(rendererType).forEach(renderer => {
                let usernameText = getUsernameTextFromRenderer(renderer);
                if (usernameText && blockedUsers.includes(usernameText)) {
                    renderer.style.display = "none";
                }
            });
        });

        // 处理主评论和回复
        rootNode.querySelectorAll("ytd-comment-thread-renderer").forEach(thread => {
            let mainCommentViewModel = thread.querySelector("ytd-comment-view-model");
            let mainUsernameText = getUsernameTextFromCommentElement(mainCommentViewModel);
            if (mainUsernameText && blockedCommentUsers.includes(mainUsernameText)) {
                thread.remove(); // 立即移除整个评论线程
            } else {
                thread.querySelectorAll("ytd-comment-replies-renderer ytd-comment-view-model[is-reply]").forEach(reply => {
                    let replyUsernameText = getUsernameTextFromCommentElement(reply);
                    if (replyUsernameText && blockedCommentUsers.includes(replyUsernameText)) {
                        reply.remove(); // 立即移除回复
                    }
                });
            }
        });
    }

    // 右键菜单监听器，用于屏蔽用户
    document.addEventListener("contextmenu", function(e) {
        let oldMenu = document.getElementById("custom-block-menu");
        if (oldMenu) oldMenu.remove();

        let menu = document.createElement("div");
        menu.id = "custom-block-menu";
        menu.style.position = "fixed";
        menu.style.background = "#fff";
        menu.style.border = "1px solid #ccc";
        menu.style.padding = "5px";
        menu.style.boxShadow = "2px 2px 5px rgba(0,0,0,0.2)";
        menu.style.zIndex = "10000";
        menu.style.borderRadius = "3px";
        menu.style.fontSize = "14px";
        menu.onmouseover = () => menu.style.background = "pink";
        menu.onmouseout = () => menu.style.background = "#fff";

        let blockVideoButton = document.createElement("div");
        blockVideoButton.textContent = "屏蔽该用户视频";
        blockVideoButton.style.padding = "5px";
        blockVideoButton.style.cursor = "pointer";
        blockVideoButton.style.textAlign = "left";

        let blockCommentButton = document.createElement("div");
        blockCommentButton.textContent = "屏蔽该用户评论";
        blockCommentButton.style.padding = "5px";
        blockCommentButton.style.cursor = "pointer";
        blockCommentButton.style.textAlign = "left";

        // 检查视频区域
        let videoTarget = e.target.closest("ytd-video-renderer, ytd-rich-item-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer, ytd-rich-grid-media");
        if (videoTarget) {
            let usernameText = getUsernameTextFromRenderer(videoTarget);
            if (usernameText) {
                menu.appendChild(blockVideoButton);
                blockVideoButton.onclick = function() {
                    let blockedUsers = GM_getValue("blockedUsers", []);
                    if (!blockedUsers.includes(usernameText)) {
                        blockedUsers.push(usernameText);
                        GM_setValue("blockedUsers", blockedUsers);
                        hideBlockedUserContent(document.body); // 立即隐藏
                    }
                    menu.remove();
                };
            }
        }

        // 检查评论区域（主评论和回复）
        let commentTarget = e.target.closest("ytd-comment-thread-renderer, ytd-comment-view-model[is-reply]");
        if (commentTarget) {
            let usernameText;
            if (commentTarget.tagName === "YTD-COMMENT-THREAD-RENDERER") {
                let mainCommentViewModel = commentTarget.querySelector("ytd-comment-view-model");
                usernameText = getUsernameTextFromCommentElement(mainCommentViewModel);
            } else if (commentTarget.tagName === "YTD-COMMENT-VIEW-MODEL") {
                usernameText = getUsernameTextFromCommentElement(commentTarget);
            }
            if (usernameText) {
                menu.appendChild(blockCommentButton);
                blockCommentButton.onclick = function() {
                    let blockedCommentUsers = GM_getValue("blockedCommentUsers", []);
                    if (!blockedCommentUsers.includes(usernameText)) {
                        blockedCommentUsers.push(usernameText);
                        GM_setValue("blockedCommentUsers", blockedCommentUsers);
                        hideBlockedUserContent(document.body); // 立即隐藏
                    }
                    menu.remove();
                };
            }
        }

        if (menu.children.length > 0) {
            e.preventDefault();
            document.body.appendChild(menu);
            menu.style.left = e.clientX + "px";
            menu.style.top = e.clientY + "px";

            document.addEventListener("click", function closeMenu(event) {
                if (!menu.contains(event.target)) {
                    menu.remove();
                    document.removeEventListener("click", closeMenu);
                }
            }, { once: true });
        }
    });

    // 使用 MutationObserver 监控 DOM 变化并立即隐藏元素
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        hideBlockedUserContent(node);
                    }
                });
            }
        });
    });

    // 观察整个文档的变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 在 DOMContentLoaded 事件后隐藏内容
    if (document.readyState === "complete" || document.readyState === "interactive") {
        hideBlockedUserContent(document.body);
    } else {
        document.addEventListener("DOMContentLoaded", () => hideBlockedUserContent(document.body));
    }

    // 作为备用，设置一个定时器每隔 0.5 秒检查一次
    setInterval(() => hideBlockedUserContent(document.body), 500);
})();