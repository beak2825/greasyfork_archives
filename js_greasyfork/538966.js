// ==UserScript==
// @name         防社死
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  为任意网站提供视频快捷键(支持iframe), 自动搜索字幕, 并在切换标签页时自动更换安全标题, 防止社死。
// @author       x
// @match        https://sextb.net/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_openInTab
// @grant        window.focus
// @connect      api-shoulei-ssl.xunlei.com
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538966/%E9%98%B2%E7%A4%BE%E6%AD%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/538966/%E9%98%B2%E7%A4%BE%E6%AD%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let storedOriginalTitle = document.title;
    const safeTitle = "SUP DO - 新的理想型社区";

    function handleVisibilityChange() {
        if (document.hidden) {
            storedOriginalTitle = document.title;
            document.title = safeTitle;
        } else {
            document.title = storedOriginalTitle;
        }
    }

    function initializeAntiSocialDeath() {
        if (window.self !== window.top) {
            return;
        }
        document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    initializeAntiSocialDeath();

})();