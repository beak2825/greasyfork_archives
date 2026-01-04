// ==UserScript==
// @name         Bilibili旧版首页
// @namespace    http://tampermonkey.net/
// @version      0.1.8
// @description  阻止b站修改buvid3以退回旧版2023/09/14
// @author       飘过的风
// @license      MIT
// @match        *://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473929/Bilibili%E6%97%A7%E7%89%88%E9%A6%96%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/473929/Bilibili%E6%97%A7%E7%89%88%E9%A6%96%E9%A1%B5.meta.js
// ==/UserScript==

(function () {
    'use strict';

    document.cookie = `go_back_dyn=1; domain=.bilibili.com; expires=Wed, 31 Dec 2025 00:00:00 GMT; path=/`;
    document.cookie = `go-back-dyn=1; domain=.bilibili.com; expires=Wed, 31 Dec 2025 00:00:00 GMT; path=/`;
    document.cookie = `go_old_video=1; domain=.bilibili.com; expires=Wed, 31 Dec 2025 00:00:00 GMT; path=/`;
    document.cookie = `nostalgia_conf=2; domain=.bilibili.com; expires=Wed, 31 Dec 2025 00:00:00 GMT; path=/`;
    document.cookie = `i-wanna-go-back=1; domain=.bilibili.com; expires=Wed, 31 Dec 2025 00:00:00 GMT; path=/`;
    document.cookie = `i-wanna-go-feeds=-1; domain=.bilibili.com; expires=Wed, 31 Dec 2025 00:00:00 GMT; path=/`;
    const blockedCookieNames = ['buvid3', 'buvid4', 'otherCookieYouWantToBlock']; // Add or remove cookie names from this lista as needed

    // Delete the cookies if they're already set
    blockedCookieNames.forEach((cookieName) => {
        if (document.cookie.includes(cookieName + '=')) {
            document.cookie = `${cookieName}=; domain=.bilibili.com; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        }
    });

    // Override document.cookie to prevent setting blocked cookies
    const originalDocumentCookie =
        Object.getOwnPropertyDescriptor(Document.prototype, 'cookie') ||
        Object.getOwnPropertyDescriptor(HTMLDocument.prototype, 'cookie');

    Object.defineProperty(document, 'cookie', {
        get: function () {
            return originalDocumentCookie.get.call(document);
        },
        set: function (value) {
            const cookieNameBeingSet = value.split('=')[0].trim();
            if (!blockedCookieNames.includes(cookieNameBeingSet)) {
                originalDocumentCookie.set.call(document, value);
            }
        },
    });
})();
