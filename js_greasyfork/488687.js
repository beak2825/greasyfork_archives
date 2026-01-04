// ==UserScript==
// @name         ngabbs 脚本
// @namespace    https://ngabbs.com/
// @version      0.1
// @description  ngabbs脚本
// @author       reggiepy
// @match        https://ngabbs.com/*
// @icon         https://ngabbs.com/favicon.ico
// @grant        none
// @require      http://code.jquery.com/jquery-3.x-git.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488687/ngabbs%20%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/488687/ngabbs%20%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */
(function() {
    'use strict';

    // Your code here...

    // 用GitHub的图标替换
    let fake_title = 'Hub'
    // 修改标题
    let fake_icon = 'https://github.githubassets.com/favicon.ico'
    fake_icon = "https://gitee.com/assets/favicon.ico"
    let link = document.querySelector("link[rel*='icon']") || document.createElement('link')

    // 调整正文样式（居中显示）
    window.onload = function () {
        document.title = fake_title + " - " + "ngabbs.com"
        link.type = 'image/x-icon'
        link.rel = 'shortcut icon'
        link.href = fake_icon
        document.getElementsByTagName('head')[0].appendChild(link)
    }
})();