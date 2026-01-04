// ==UserScript==
// @name         世图增加已下载的红色链接
// @namespace    http://tampermonkey.net/
// @version      2025-07-08-001
// @description  为世图科研助手增加已下载的红色链接，增加已下载的红色链接-世图科研助手,学科服务群
// @author       You
// @match        https://research.worldlib.site/result_query.aspx
// @match        https://research.worldlib.site/index.aspx
// @match        https://research.worldlib.site/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=worldlib.site
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529407/%E4%B8%96%E5%9B%BE%E5%A2%9E%E5%8A%A0%E5%B7%B2%E4%B8%8B%E8%BD%BD%E7%9A%84%E7%BA%A2%E8%89%B2%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/529407/%E4%B8%96%E5%9B%BE%E5%A2%9E%E5%8A%A0%E5%B7%B2%E4%B8%8B%E8%BD%BD%E7%9A%84%E7%BA%A2%E8%89%B2%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

// https://greasyfork.org/zh-CN/scripts/529407-%E4%B8%96%E5%9B%BE%E5%A2%9E%E5%8A%A0%E5%B7%B2%E4%B8%8B%E8%BD%BD%E7%9A%84%E7%BA%A2%E8%89%B2%E9%93%BE%E6%8E%A5
(function () {
    'use strict';
    // 添加访问过的链接样式
    function addVisitedStyle() {
        if (!document.querySelector('style[data-visited-style]')) {
            const style = document.createElement('style');
            style.setAttribute('data-visited-style', '');
            style.textContent = `a.icon-xiazai:visited { color: #e233eb !important; }`;
            document.head.appendChild(style);
        }
    }

    // 添加下载链接
    function addDownloadLinks() {
        document.querySelectorAll('a[data-url],button[data-url]').forEach(link => {
            if (!link.nextElementSibling) {
                const newA = document.createElement('a');
                newA.textContent = "下载";
                newA.href = link.getAttribute('data-url');
                newA.className="open_url icon_btn iconfont icon-xiazai btn btn-default"
                newA.target = '_blank';
                link.parentNode.appendChild(newA);
            }
        });
    }

    // 初始化
    addVisitedStyle();
    setInterval(addDownloadLinks, 1000);
})();