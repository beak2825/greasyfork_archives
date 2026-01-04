// ==UserScript==
// @name         Patreon / Fanbox 自動跳轉 Kemono 搜尋
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  自動在 Kemono 搜尋 Patreon / Pixiv Fanbox 創作者
// @match        *://www.patreon.com/*
// @match        *://*.fanbox.cc/*
// @author       h1n1zn9
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527276/Patreon%20%20Fanbox%20%E8%87%AA%E5%8B%95%E8%B7%B3%E8%BD%89%20Kemono%20%E6%90%9C%E5%B0%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/527276/Patreon%20%20Fanbox%20%E8%87%AA%E5%8B%95%E8%B7%B3%E8%BD%89%20Kemono%20%E6%90%9C%E5%B0%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getCreatorUsername() {
        let username = null;

        // 🚀 **Fanbox 直接從子網域獲取 ID**
        if (location.hostname.includes("fanbox.cc")) {
            let match = location.hostname.match(/^([^.]+)\.fanbox\.cc$/);
            if (match) username = match[1];
        }

        // 🚀 **Patreon: /c/ 創作者專區解析**
        else if (location.hostname.includes("patreon.com")) {
            let pathParts = window.location.pathname.split("/").filter(p => p);
            if (pathParts.length >= 2 && pathParts[0] === "c") {
                username = pathParts[1]; // Patreon 創作者 ID 來自 `/c/`
            }
        }

        return username;
    }

    function openKemonoSearch(url) {
        if (!sessionStorage.getItem(`kemono-search-${location.host}`)) {
            sessionStorage.setItem(`kemono-search-${location.host}`, "true");
            window.open(url, '_blank');
        }
    }

    function handleSite() {
        let username = getCreatorUsername();
        if (!username) {
            console.log("❌ 無法獲取創作者 ID");
            return;
        }

        let searchUrl = `https://kemono.su/artists?q=${username}&service=&sort_by=favorited&order=desc`;
        setTimeout(() => openKemonoSearch(searchUrl), 2000);
    }

    // 監聽 URL 變化 (SPA 頁面支援)
    let lastUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            setTimeout(handleSite, 2000);
        }
    }).observe(document, { subtree: true, childList: true });

    // 初始執行
    setTimeout(handleSite, 3000);
})();
