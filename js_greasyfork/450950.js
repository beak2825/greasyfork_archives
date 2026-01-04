// ==UserScript==
// @name        🚀学习通章节学习次数🚀
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  打开学习通任意章节，实现章节学习次数自动增加
// @author       信阳学院晋先生
// @match        *://*.chaoxing.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450950/%F0%9F%9A%80%E5%AD%A6%E4%B9%A0%E9%80%9A%E7%AB%A0%E8%8A%82%E5%AD%A6%E4%B9%A0%E6%AC%A1%E6%95%B0%F0%9F%9A%80.user.js
// @updateURL https://update.greasyfork.org/scripts/450950/%F0%9F%9A%80%E5%AD%A6%E4%B9%A0%E9%80%9A%E7%AB%A0%E8%8A%82%E5%AD%A6%E4%B9%A0%E6%AC%A1%E6%95%B0%F0%9F%9A%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(() => {
        window.location.reload(true)
    }, 16000) // 16000表示刷新时间为16000毫秒
})();
