// ==UserScript==
// @name         Bilibili专栏自动回到旧版
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  Bilibili专栏自动重定向至旧版页面（www.bilibili.com/opus/* -> www.bilibili.com/read/cv*/?opus_fallback=1）
// @author       Xyc1596
// @license      MIT
// @match        *://www.bilibili.com/opus/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546547/Bilibili%E4%B8%93%E6%A0%8F%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%88%B0%E6%97%A7%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/546547/Bilibili%E4%B8%93%E6%A0%8F%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%88%B0%E6%97%A7%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.location.href.includes("bilibili.com/opus")) {
        console.log(window.__INITIAL_STATE__);
        const basic = window.__INITIAL_STATE__.detail.basic;
        if (basic.comment_type == 12) {
            let new_href = `https://www.bilibili.com/read/cv${basic.rid_str}/?opus_fallback=1`;
            window.location.href = new_href;
        }
    }
})();