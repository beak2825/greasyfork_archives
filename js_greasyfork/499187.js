// ==UserScript==
// @license MIT
// @name         修改 bad.news 网站
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  修改标题并删除特定DOM节点
// @match        *://*.bad.news/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499187/%E4%BF%AE%E6%94%B9%20badnews%20%E7%BD%91%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/499187/%E4%BF%AE%E6%94%B9%20badnews%20%E7%BD%91%E7%AB%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 修改 <title> 内容
    document.title = "百度搜索";

    // 删除 id="sr-header-area" 的DOM节点
    let headerArea = document.getElementById('sr-header-area');
    if (headerArea) {
        headerArea.remove();
    }

    // 删除 class="side" 的DOM节点
    let sideElements = document.getElementsByClassName('side');
    while (sideElements.length > 0) {
        sideElements[0].remove();
    }
    // 修改 .coverimg img 的 max-width 为默认值
    let style = document.createElement('style');
    style.textContent = `
        .coverimg img {
            max-height: initial !important;
        }
    `;
    document.head.appendChild(style);
    // 修改网站图标(favicon)
    let icon = document.querySelector('link[rel="shortcut icon"]');
    if (icon) {
        icon.href = 'https://raw.githubusercontent.com/userElaina/this-is-the-China-website/main/wikipedia/baidu.ico';
    } else {
        icon = document.createElement('link');
        icon.rel = 'shortcut icon';
        icon.href = 'https://raw.githubusercontent.com/userElaina/this-is-the-China-website/main/wikipedia/baidu.ico';
        document.head.appendChild(icon);
    }
})();