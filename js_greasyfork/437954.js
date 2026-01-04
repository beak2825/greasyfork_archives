// ==UserScript==
// @name         BiliSearch as BiliHome | 将B站搜索作为B站首页
// @namespace    none
// @version      0.4
// @description  访问Bilibili首页时自动跳转到Bilibili搜索页，避免看到其它干扰内容
// @author       CDN
// @match        https://bilibili.com
// @match        https://www.bilibili.com
// @icon         https://static.hdslb.com/images/favicon.ico
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437954/BiliSearch%20as%20BiliHome%20%7C%20%E5%B0%86B%E7%AB%99%E6%90%9C%E7%B4%A2%E4%BD%9C%E4%B8%BAB%E7%AB%99%E9%A6%96%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/437954/BiliSearch%20as%20BiliHome%20%7C%20%E5%B0%86B%E7%AB%99%E6%90%9C%E7%B4%A2%E4%BD%9C%E4%B8%BAB%E7%AB%99%E9%A6%96%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 中止加载
    window.stop ? window.stop() : document.execCommand("Stop");
    // 自动跳转
    window.location = "https://search.bilibili.com";
})();