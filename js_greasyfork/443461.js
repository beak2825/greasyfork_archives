// ==UserScript==
// @name         链接自动跳转助手
// @namespace    https://github.com/CheckCoder
// @version      0.0.1
// @description  在知乎、掘金的跳转提示页面中自动跳转。
// @author       check
// @match        https://link.juejin.cn/*
// @match        https://link.zhihu.com/*
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/443461/%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/443461/%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const href = window.location.href;

    const reg = /https:\/\/.*(com|cn)\/\?target=/;
    const matchList = href.match(reg);

    if (!matchList) return;

    window.location.href = decodeURIComponent(href.substring(matchList[0].length));
})();