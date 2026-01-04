// ==UserScript==
// @name         去TM的avif文件后缀
// @namespace    http://tampermonkey.net/
// @version      V1.0
// @description  自动删除B站动态和IT之家在新标签页查看avif格式图片时的后缀
// @author       You
// @match        https://img.ithome.com/*
// @match        https://i0.hdslb.com/*
// @match        https://album.biliimg.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484137/%E5%8E%BBTM%E7%9A%84avif%E6%96%87%E4%BB%B6%E5%90%8E%E7%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/484137/%E5%8E%BBTM%E7%9A%84avif%E6%96%87%E4%BB%B6%E5%90%8E%E7%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前网址
    var currentUrl = window.location.href;

    // 去除参数
    var newUrl = currentUrl.split('?')[0];

    // 如果包含@!web-comment-note.avif，去除它
    newUrl = newUrl.split('@!web-comment-note.avif')[0];

    // 重定向到新的URL
    if (newUrl !== currentUrl) {
        window.location.href = newUrl;
    }
})();