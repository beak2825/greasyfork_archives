// ==UserScript==
// @name         油管黑名单
// @namespace    http://tampermonkey.net/
// @version      1.12
// @description  屏蔽用户视频并添加data-yt-block="true"标记；屏蔽用户评论；通过直接DOM操作、事件监听和滚动监控确保隐藏；恢复非黑名单视频显示
// @author       GROK
// @match        https://www.youtube.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/532383/%E6%B2%B9%E7%AE%A1%E9%BB%91%E5%90%8D%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/532383/%E6%B2%B9%E7%AE%A1%E9%BB%91%E5%90%8D%E5%8D%95.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    const videoSelectors = 'ytd-video-renderer, ytd-compact-video-renderer, ytd-rich-item-renderer, ytd-grid-video-renderer';
    const commentSelectors = 'ytd-comment-thread-renderer, ytd-comment-view-model';
    const BLOCK_FLAG = 'data-yt-block';
    let pendingProcess = false;
    const usernameCache = new WeakMap();
 
    function getUsernameTextFromRenderer(renderer) {
        if (usernameCache.has(renderer)) {
            return usernameCache.get(renderer);
        }
        const selectors = [
            "ytd-channel-name a.yt-simple-endpoint yt-formatted-string",
            "#channel-name yt-formatted-string",
            "ytd-channel-name yt-formatted-string",
            "#text-container yt-formatted-string",
            "ytd-channel-name [id='text']",
            ".yt-formatted-string[title]",
            "ytd-channel-name a[href*='/@']",
            "#channel-name a[href*='/@']",
            "a.yt-simple-endpoint[href*='/@']",
            "ytd-channel-name a[href*='/channel/']"
        ];
        for (let selector of selectors) {
            const elements = renderer.querySelectorAll(selector);
            for (let elem of elements) {
                const text = elem.textContent.trim();
                if (text) {
                    usernameCache.set(renderer, text.replace(/^@/, ''));
                    return text.replace(/^@/, '');
                }
            }
        }
        const linkSelectors = [
            "ytd-channel-name a[href*='/@']",
            "#channel-name a[href*='/@']",
            "a.yt-simple-endpoint[href*='/@']",
            "ytd-channel-name a[href*='/channel/']"
        ];
        for (let selector of linkSelectors) {
            const links = renderer.querySelectorAll(selector);
            for (let link of links) {
                const href = link.getAttribute('href') || '';
                let username;
                const atMatch = href.match(/\/@([^\/?]+)/);
                const channelMatch = href.match(/\/channel\/([^\/?]+)/);
                if (atMatch && atMatch[1]) {
                    username = atMatch[1];
                } else if (channelMatch && channelMatch[1]) {
                    username = channelMatch[1];
                }
                if (username) {
                    usernameCache.set(renderer, username);
                    return username;
                }
            }
        }
        return null;
    }
 
    function getUsernameTextFromCommentElement(element) {
        let usernameElement = element.querySelector("#author-text");
        if (usernameElement) {
            return usernameElement.textContent.trim().replace(/^@/, '').replace(/\n/g, '');
        }
        usernameElement = element.querySelector("h3 span.style-scope.ytd-comment-view-model");
        if (usernameElement) {
            return usernameElement.textContent.trim().replace(/^@/, '').replace(/\n/g, '');
        }
        return null;
    }
 
    function shouldHideVideo(video) {
        const blockedUsers = GM_getValue("blockedUsers", []).map(user => user.trim().replace(/^@/, '').toLowerCase());
        const username = getUsernameTextFromRenderer(video);
        return username && blockedUsers.includes(username.toLowerCase());
    }
 
    function processVideoNode(video) {
        if (video.hasAttribute(BLOCK_FLAG) && video.getAttribute(BLOCK_FLAG) === 'true') {
            video.style.display = 'none';
            return;
        }
        if (shouldHideVideo(video)) {
            video.style.display = 'none';
            video.setAttribute(BLOCK_FLAG, 'true');
        } else {
            video.style.display = '';
            if (video.hasAttribute(BLOCK_FLAG)) {
                video.removeAttribute(BLOCK_FLAG);
            }
        }
    }
 
    function processVideos(nodes = document.querySelectorAll(videoSelectors)) {
        nodes.forEach(processVideoNode);
    }
 
    function processCommentNode(thread) {
        if (thread.hasAttribute(BLOCK_FLAG)) return;
        const username = getUsernameTextFromCommentElement(thread);
        const blockedCommentUsers = GM_getValue("blockedCommentUsers", []).map(user => user.trim().replace(/^@/, '').toLowerCase());
        if (username && blockedCommentUsers.includes(username.toLowerCase())) {
            thread.style.display = 'none';
            thread.setAttribute(BLOCK_FLAG, 'true');
        }
    }
 
    function processComments(nodes = document.querySelectorAll(commentSelectors)) {
        nodes.forEach(processCommentNode);
    }
 
    function scheduleProcessDOM(nodes) {
        if (!pendingProcess) {
            pendingProcess = true;
            requestAnimationFrame(() => {
                processVideos(nodes);
                processComments(nodes);
                pendingProcess = false;
            });
        }
    }
 
    function enforceBlockedVideoHiding() {
        const checkAndHide = (event) => {
            const video = event.target.closest(videoSelectors);
            if (video && video.getAttribute(BLOCK_FLAG) === 'true') {
                video.style.display = 'none';
            }
        };
    }
 
    document.addEventListener("contextmenu", function(e) {
        const oldMenu = document.getElementById("custom-block-menu");
        if (oldMenu) oldMenu.remove();
 
        const menu = document.createElement("div");
        Object.assign(menu.style, {
            position: 'fixed', background: '#fff', border: '1px solid #ccc', padding: '5px',
            boxShadow: '2px 2px 5px rgba(0,0,0,.2)', zIndex: '10000', borderRadius: '3px', fontSize: '14px'
        });
        menu.id = "custom-block-menu";
        menu.onmouseover = () => menu.style.background = "pink";
        menu.onmouseout = () => menu.style.background = "#fff";
 
        const videoTarget = e.target.closest(videoSelectors);
        if (videoTarget) {
            const usernameText = getUsernameTextFromRenderer(videoTarget);
            if (usernameText) {
                const blockVideoButton = document.createElement("div");
                blockVideoButton.textContent = "屏蔽该用户视频";
                blockVideoButton.style.cssText = "padding: 5px; cursor: pointer;";
                blockVideoButton.addEventListener("click", () => {
                    const blockedUsers = GM_getValue("blockedUsers", []);
                    if (!blockedUsers.includes(usernameText)) {
                        blockedUsers.push(usernameText);
                        GM_setValue("blockedUsers", blockedUsers);
                        scheduleProcessDOM(document.querySelectorAll(videoSelectors));
                    }
                    menu.remove();
                });
                menu.appendChild(blockVideoButton);
            }
        }
 
        const commentTarget = e.target.closest(commentSelectors);
        if (commentTarget) {
            const usernameText = getUsernameTextFromCommentElement(commentTarget);
            if (usernameText) {
                const blockCommentButton = document.createElement("div");
                blockCommentButton.textContent = "屏蔽该用户评论";
                blockCommentButton.style.cssText = "padding: 5px; cursor: pointer;";
                blockCommentButton.addEventListener("click", () => {
                    const blockedCommentUsers = GM_getValue("blockedCommentUsers", []);
                    if (!blockedCommentUsers.includes(usernameText)) {
                        blockedCommentUsers.push(usernameText);
                        GM_setValue("blockedCommentUsers", blockedCommentUsers);
                        scheduleProcessDOM(document.querySelectorAll(commentSelectors));
                    }
                    menu.remove();
                });
                menu.appendChild(blockCommentButton);
            }
        }
 
        if (menu.children.length > 0) {
            e.preventDefault();
            document.body.appendChild(menu);
            menu.style.left = `${e.clientX}px`;
            menu.style.top = `${e.clientY}px`;
            document.addEventListener("click", function closeMenu(event) {
                if (!menu.contains(event.target)) {
                    menu.remove();
                    document.removeEventListener("click", closeMenu);
                }
            }, { once: true });
        }
    });
 
    enforceBlockedVideoHiding();
    scheduleProcessDOM();
 
    const observer = new MutationObserver((mutations) => {
        const nodesToProcess = new Set();
        mutations.forEach(mut => {
            if (mut.addedNodes.length) {
                mut.addedNodes.forEach(node => {
                    if (node.nodeType !== 1) return;
                    if (node.matches(videoSelectors) || node.matches(commentSelectors) ||
                        node.querySelector(videoSelectors) || node.querySelector(commentSelectors)) {
                        nodesToProcess.add(node);
                        node.querySelectorAll(videoSelectors + ',' + commentSelectors)
                            .forEach(n => nodesToProcess.add(n));
                    }
                });
            }
        });
        if (nodesToProcess.size) {
            scheduleProcessDOM(nodesToProcess);
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
 
    let isScrolling;
    window.addEventListener('scroll', () => {
        clearTimeout(isScrolling);
        isScrolling = setTimeout(() => scheduleProcessDOM(), 200);
    });
 
    window.addEventListener('load', () => scheduleProcessDOM());
    window.addEventListener('yt-navigate-finish', () => scheduleProcessDOM());
 
    window.addEventListener('unload', () => observer.disconnect());
})();