// ==UserScript==
// @name         抖音黑名单
// @namespace    http://tampermonkey.net/
// @version      5.7
// @description  右键点击抖音搜索结果页视频或者评论区用户进行拉黑
// @author       ChatGPT
// @match        *://www.douyin.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/529432/%E6%8A%96%E9%9F%B3%E9%BB%91%E5%90%8D%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/529432/%E6%8A%96%E9%9F%B3%E9%BB%91%E5%90%8D%E5%8D%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = "blocked_douyin_users";
    let blockedUsersSet = new Set(GM_getValue(STORAGE_KEY, []));
    let isHiding = true;

    function saveBlockedUsers() {
        GM_setValue(STORAGE_KEY, Array.from(blockedUsersSet));
    }

    function addBlockedUser(username) {
        if (username && !blockedUsersSet.has(username)) {
            blockedUsersSet.add(username);
            saveBlockedUsers();
            hideBlockedContent();
        }
    }

    // 提取用户名，确保不依赖全局 event
    function extractUsername(element) {
        if (!element) return null;

        // 1. 搜索结果：查找 <li> 内的用户名
        let li = element.closest("li");
        if (li) {
            let usernameElement = li.querySelector("span:nth-of-type(2), img[alt]");
            if (usernameElement) return usernameElement.innerText || usernameElement.alt;
        }

        // 2. 评论区
        let commentWrap = element.closest('[data-e2e="comment-item"]');
        if (commentWrap) {
            let usernameElement = commentWrap.querySelector(".comment-item-info-wrap a[href*='douyin.com/user/']");
            if (usernameElement) return usernameElement.innerText || usernameElement.querySelector("img[alt]")?.alt;
        }

        // 3. 视频容器
        let waterfallContainer = element.closest('div[id^="waterfall_item_"]');
        if (waterfallContainer) {
            let match = waterfallContainer.innerText.match(/@(.+?)\s*·/);
            if (match) return match[1];
        }

        // 4. 直接查找用户链接
        let userLink = element.closest("a[href*='douyin.com/user/']");
        if (userLink) return userLink.innerText || userLink.querySelector("img[alt]")?.alt;

        return null;
    }

    function hideBlockedContent() {
        document.querySelectorAll("li, [data-e2e='comment-item'], div[id^='waterfall_item_']").forEach(item => {
            let username = extractUsername(item);
            if (username && blockedUsersSet.has(username)) {
                item.style.display = isHiding ? "none" : "";
            }
        });
    }

    let menu = document.createElement("div");
    menu.style = "position:absolute; background:#fff; border:1px solid #ccc; padding:5px 10px; display:none; z-index:10000; cursor:pointer; border-radius:4px; box-shadow:2px 2px 6px rgba(0,0,0,0.2);";
    menu.innerText = "🚫 屏蔽该用户";
    document.body.appendChild(menu);

    let currentUsername = null;

    document.addEventListener("contextmenu", function (event) {
        let target = event.target;
        currentUsername = extractUsername(target);
        if (currentUsername) {
            event.preventDefault();
            menu.style.left = `${event.pageX}px`;
            menu.style.top = `${event.pageY}px`;
            menu.style.display = "block";
        } else {
            menu.style.display = "none";
        }
    }, true);

    menu.addEventListener("click", function (event) {
        if (currentUsername) {
            addBlockedUser(currentUsername);
            menu.style.display = "none";
            event.stopPropagation();
        }
    });

    document.addEventListener("click", function () {
        menu.style.display = "none";
    });

    hideBlockedContent();

    const observer = new MutationObserver(() => hideBlockedContent());
    observer.observe(document.body, { childList: true, subtree: true });
})();