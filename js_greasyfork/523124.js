// ==UserScript==
// @name         Sage Journals Redirect
// @version      0.3
// @description  将Sage期刊请求重定向至中国镜像站
// @namespace    https://greasyfork.org/en/users/30-opsomh
// @match        *://journals.sagepub.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523124/Sage%20Journals%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/523124/Sage%20Journals%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentUrl = new URL(location.href);

    // 仅处理主站请求
    if (currentUrl.hostname !== 'journals.sagepub.com') return;

    // 提取DOI编号（支持多种URL结构）
    const doiPathRegex = /^\/(?:doi|loi)\/(?:abs|full|pdf|epub)\/(.+)/;
    const match = currentUrl.pathname.match(doiPathRegex);

    if (match) {
        window.stop(); // 立即停止加载

        const doi = match[1].replace(/\/$/, ''); // 去除可能存在的末尾斜杠
        const newUrl = new URL(`https://sage.cnpereading.com/paragraph/article/`);

        // 构建查询参数
        newUrl.searchParams.set('doi', doi);

        // 保留原始锚点（如有）
        newUrl.hash = currentUrl.hash;

        // 执行重定向
        location.replace(newUrl.href);
    }
})();