// ==UserScript==
// @name         Bing 链接颜色修复（自用修改版）
// @namespace    https://blog.csdn.net/qq_32917155
// @author       neelife
// @version      0.3
// @description  修复Bing 搜索结果全部变为紫色的问题, 使未访问链接重新恢复为蓝色
// @license MIT
// @match        https://*.bing.com/*
// @downloadURL https://update.greasyfork.org/scripts/543512/Bing%20%E9%93%BE%E6%8E%A5%E9%A2%9C%E8%89%B2%E4%BF%AE%E5%A4%8D%EF%BC%88%E8%87%AA%E7%94%A8%E4%BF%AE%E6%94%B9%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/543512/Bing%20%E9%93%BE%E6%8E%A5%E9%A2%9C%E8%89%B2%E4%BF%AE%E5%A4%8D%EF%BC%88%E8%87%AA%E7%94%A8%E4%BF%AE%E6%94%B9%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

// 修改下面的RGB值改变未访问链接的颜色
var unvisitcolor = "#4773e0";

(function() {
    'use strict';

    // 创建更广泛的CSS规则
    var css = `
        /* 搜索结果页面链接 */
        #b_results a:link,
        .b_algo a:link,
        .b_title a:link,
        .b_searchboxForm a:link,
        h2 a:link {
            color: ${unvisitcolor} !important;
        }

        /* 确保已访问的链接仍然保持紫色 */
        #b_results a:visited,
        .b_algo a:visited,
        .b_title a:visited,
        .b_searchboxForm a:visited,
        h2 a:visited {
            color: #68217a !important;
        }
    `;

    // 创建样式元素并添加到文档
    var style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    // 为动态加载的内容设置MutationObserver
    const observer = new MutationObserver(function() {
        // 重新应用样式
        var existingStyle = document.head.querySelector('style[data-bing-links-fix]');
        if (!existingStyle) {
            var refreshStyle = document.createElement('style');
            refreshStyle.setAttribute('data-bing-links-fix', 'true');
            refreshStyle.textContent = css;
            document.head.appendChild(refreshStyle);
        }
    });

    // 开始观察文档变化
    observer.observe(document.body, { childList: true, subtree: true });
})();