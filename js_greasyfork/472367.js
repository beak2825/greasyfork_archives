// ==UserScript==
// @name         南+自动跳转
// @version      0.3
// @description  自动跳转到你常用的南+域名
// @author       People11
// @icon         https://level-plus.net/favicon.ico
// @match        *.soul-plus.net/*
// @match        *.east-plus.net/*
// @match        *.blue-plus.net/*
// @match        *.north-plus.net/*
// @match        *.white-plus.net/*
// @match        *.snow-plus.net/*
// @match        *.south-plus.net/*
// @match        *.spring-plus.net/*
// @match        *.summer-plus.net/*
// @match        *.level-plus.net/*
// @match        *.soul-plus.com/*
// @match        *.east-plus.com/*
// @match        *.blue-plus.com/*
// @match        *.north-plus.com/*
// @match        *.white-plus.com/*
// @match        *.snow-plus.com/*
// @match        *.south-plus.com/*
// @match        *.spring-plus.com/*
// @match        *.summer-plus.com/*
// @match        *.level-plus.com/*
// @match        *.soul-plus.org/*
// @match        *.east-plus.org/*
// @match        *.blue-plus.org/*
// @match        *.north-plus.org/*
// @match        *.white-plus.org/*
// @match        *.snow-plus.org/*
// @match        *.south-plus.org/*
// @match        *.spring-plus.org/*
// @match        *.summer-plus.org/*
// @match        *.level-plus.org/*
// @match        *.bbs.imoutolove.me/*
// @run-at       document-start
// @namespace https://greasyfork.org/users/1143233
// @downloadURL https://update.greasyfork.org/scripts/472367/%E5%8D%97%2B%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/472367/%E5%8D%97%2B%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 将"level-plus.net"替换为你常用的域名
    const targetDomain = "level-plus.net";

    // 获取当前页面的URL
    const currentURL = window.location.href;

    // 获取当前页面所在的域名
    const currentDomain = window.location.hostname;

    // 判断当前页面是否在指定的域名，且不包含"simple"
    if (currentDomain === targetDomain && !currentURL.includes("/simple")) {
        return; // 不执行跳转
    }

    // 构建新URL
    let newURL = currentURL.replace(/^https?:\/\/[^/]+/, `https://${targetDomain}`);

    // Simple不ao
    newURL = newURL.replace(/\/simple\//, '/');
    newURL = newURL.replace(`/index.php?t`, `/read.php?tid=`);

    // 跳转到新的URL
    window.location.href = newURL;
})();

// 垃圾代码，将就用吧，上面的正则我也不知道怎么写