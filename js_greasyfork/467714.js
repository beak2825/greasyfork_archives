// ==UserScript==
// @name         B站自动回到旧版
// @namespace    http://new.longz7z8.com.cn
// @supportURL   https://github.com/longz7z8/BiliBili-Go-Old-18/issues
// @version      0.68
// @description  很简单的小脚本，自动让B站界面回到旧版（18年版）
// @author       Han121010, ChatGPT（辅助）
// @match        *://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467714/B%E7%AB%99%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%88%B0%E6%97%A7%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/467714/B%E7%AB%99%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%88%B0%E6%97%A7%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.cookie = "i-wanna-go-back=2; domain=.bilibili.com; expires=Fri, 31 Dec 2024 23:59:59 GMT; path=/";
    document.cookie = "go_old_video=1; domain=.bilibili.com; expires=Fri, 31 Dec 2024 23:59:59 GMT; path=/";
    document.cookie = "nostalgia_conf=2; domain=.bilibili.com; expires=Fri, 31 Dec 2024 23:59:59 GMT; path=/";
    document.cookie = "go-back-dyn=1; domain=.bilibili.com; expires=Fri, 31 Dec 2024 23:59:59 GMT; path=/";
    document.cookie = "i-wanna-go-channel-back=1; domain=.bilibili.com; expires=Fri, 31 Dec 2024 23:59:59 GMT; path=/";
})();

//本脚本由Github上的longz7z8制作！