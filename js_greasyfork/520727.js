// ==UserScript==
// @name         Linux.do 帖子（从头阅读）
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  修改帖子阅读请求URL
// @match        https://linux.do/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520727/Linuxdo%20%E5%B8%96%E5%AD%90%EF%BC%88%E4%BB%8E%E5%A4%B4%E9%98%85%E8%AF%BB%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/520727/Linuxdo%20%E5%B8%96%E5%AD%90%EF%BC%88%E4%BB%8E%E5%A4%B4%E9%98%85%E8%AF%BB%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 预处理所有帖子链接
    function processLinks() {
        document.querySelectorAll('a[href*="/t/topic/"]').forEach(link => {
            const match = link.href.match(/\/t\/topic\/(\d+)\/\d+/);
            if (match) {
                link.href = `/t/topic/${match[1]}`;
            }
        });
    }

    // 监听DOM变化，处理新添加的链接
    const observer = new MutationObserver(processLinks);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始处理
    processLinks();
})();