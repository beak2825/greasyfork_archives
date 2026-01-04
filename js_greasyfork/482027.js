// ==UserScript==
// @name         Remove shopee tracker
// @name:zh-TW   移除蝦皮追蹤器
// @name:zh-CN   移除虾皮追踪器
// @namespace    https://greasyfork.org
// @version      0.0.5
// @description  Efficiently clean Shopee product URLs.
// @description:zh-TW 高效的清理蝦皮商品網址
// @description:zh-CN 高效的清理虾皮商品网址
// @author       Pixmi
// @match        *://shopee.tw/*
// @match        *://shopee.ph/*
// @match        *://shopee.sg/*
// @match        *://shopee.com.my/*
// @icon         https://icons.duckduckgo.com/ip2/shopee.com.ico
// @grant        none
// @license      GPL-3.0
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/482027/Remove%20shopee%20tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/482027/Remove%20shopee%20tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const reg = new RegExp(/\-i\.([\d]+)\.([\d]+)/);
    const cleanURL = (url) => {
        const match = url.match(reg);
        if (!match) return url;
        return `/product/${match[1]}/${match[2]}`;
    };
    if (reg.test(window.location.href)) {
        window.location.replace(`${window.location.origin}${cleanURL(window.location.href)}`);
    }
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(state, title, url) {
        if (url) { url = cleanURL(url); }
        return originalPushState.call(this, state, title, url);
    };

    history.replaceState = function(state, title, url) {
        if (url) { url = cleanURL(url); }
        return originalReplaceState.call(this, state, title, url);
    };
})();