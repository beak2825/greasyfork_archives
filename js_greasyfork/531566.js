// ==UserScript==
// @name         自动将arXiv的HTML页面重定向原版页面
// @namespace    dev
// @version      1.1
// @description  自动将arXiv的HTML页面重定向原版页面arXiv HTML to Abs Redirect
// @author       dev
// @match        https://arxiv.org/html/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531566/%E8%87%AA%E5%8A%A8%E5%B0%86arXiv%E7%9A%84HTML%E9%A1%B5%E9%9D%A2%E9%87%8D%E5%AE%9A%E5%90%91%E5%8E%9F%E7%89%88%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/531566/%E8%87%AA%E5%8A%A8%E5%B0%86arXiv%E7%9A%84HTML%E9%A1%B5%E9%9D%A2%E9%87%8D%E5%AE%9A%E5%90%91%E5%8E%9F%E7%89%88%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前路径中的论文ID（包含可能的版本号）
    const pathSegments = window.location.pathname.split('/');
    const paperId = pathSegments[2];  // 路径格式为 /html/xxxxx

    // 只有当路径有效时才执行跳转
    if (paperId) {
        // 保留所有查询参数
        const queryString = window.location.search;
        // 构建新的abs链接
        const absUrl = `https://arxiv.org/abs/${paperId}${queryString}`;
        // 立即跳转（替换当前历史记录）
        window.location.replace(absUrl);
    }
})();
