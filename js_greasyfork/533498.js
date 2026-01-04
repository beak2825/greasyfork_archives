// ==UserScript==
// @name         YouTube Premium 自動指定多帳號（支援搜尋）
// @name:en      YouTube Premium Auto Authuser Switch (With Search Page Support)
// @namespace    https://twitch.tv/Ladell
// @version      3.5
// @description  自動切換至指定的 Google 帳號（authuser），在 YouTube 首頁與搜尋頁靜默處理，不重整、不循環。
// @description:zh-TW 自動切換至指定的 Google 帳號（authuser），在 YouTube 首頁與搜尋頁靜默處理，不重整、不循環。
// @description:en Automatically switch to specified Google account (authuser) on YouTube homepage and search, silently and without reload.
// @author       ChatGPT + Twitch.tv/Ladell
// @match        *://www.youtube.com/*
// @icon         https://www.youtube.com/s/desktop/6e55fb3d/img/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533501/YouTube%20Premium%20%E8%87%AA%E5%8B%95%E6%8C%87%E5%AE%9A%E5%A4%9A%E5%B8%B3%E8%99%9F%EF%BC%88%E6%94%AF%E6%8F%B4%E6%90%9C%E5%B0%8B%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/533501/YouTube%20Premium%20%E8%87%AA%E5%8B%95%E6%8C%87%E5%AE%9A%E5%A4%9A%E5%B8%B3%E8%99%9F%EF%BC%88%E6%94%AF%E6%8F%B4%E6%90%9C%E5%B0%8B%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const desiredUser = "1"; // 想要切換到的 Google 帳號（authuser=1）
    const redirectFlag = "authuser_redirected"; // 防止重複轉向

    // 判斷是否需要處理此頁面：首頁或搜尋頁
    function shouldHandlePage() {
        const url = new URL(window.location.href);
        const pathname = url.pathname;
        return pathname === "/" || (pathname === "/results" && url.searchParams.has("search_query"));
    }

    function maybeSwitchAccount() {
        const url = new URL(window.location.href);
        const currentUser = url.searchParams.get("authuser");
        const alreadyRedirected = url.searchParams.get(redirectFlag);

        if (shouldHandlePage() && currentUser !== desiredUser && !alreadyRedirected) {
            console.log("[YouTube Auto Authuser] 靜默切換到 authuser=" + desiredUser);

            url.searchParams.set("authuser", desiredUser);
            url.searchParams.set(redirectFlag, "1");
            window.history.replaceState({}, '', url.toString());
        } else if (alreadyRedirected) {
            url.searchParams.delete(redirectFlag);
            window.history.replaceState({}, '', url.toString());
        }
    }

    maybeSwitchAccount();

    // 偵測 YouTube 為 SPA，使用 MutationObserver 監聽網址變化
    let lastHref = location.href;
    new MutationObserver(() => {
        if (location.href !== lastHref) {
            lastHref = location.href;
            maybeSwitchAccount();
        }
    }).observe(document, {subtree: true, childList: true});
})();
