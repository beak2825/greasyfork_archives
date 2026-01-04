// ==UserScript==
// @name         Linux.do 帖子阅读修改器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  从头开始阅读
// @match        https://linux.do/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520728/Linuxdo%20%E5%B8%96%E5%AD%90%E9%98%85%E8%AF%BB%E4%BF%AE%E6%94%B9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/520728/Linuxdo%20%E5%B8%96%E5%AD%90%E9%98%85%E8%AF%BB%E4%BF%AE%E6%94%B9%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.body.addEventListener('mousedown', (event) => {
        // 只处理左键和中键点击
        if (event.button !== 0 && event.button !== 1) return;

        const link = event.target.closest('a[href*="/t/topic/"]');
        if (!link) return;

        const match = link.href.match(/\/t\/topic\/(\d+)\/\d+/);
        if (!match) return;

        // 确认是帖子链接后才阻止默认行为
        event.preventDefault();

        const newUrl = `/t/topic/${match[1]}`;
        event.button === 1 ? window.open(newUrl, '_blank') : window.location.replace(newUrl);
    }, true);
})();