// ==UserScript==
// @name         隐藏哔哩哔哩动态中的侧边显示“体验新版”的组件
// @namespace    XNEternal
// @version      0.1
// @description  自动隐藏哔哩哔哩动态中的侧边显示“体验新版”的组件
// @author       XNEternal
// @match        *://*.bilibili.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537187/%E9%9A%90%E8%97%8F%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%8A%A8%E6%80%81%E4%B8%AD%E7%9A%84%E4%BE%A7%E8%BE%B9%E6%98%BE%E7%A4%BA%E2%80%9C%E4%BD%93%E9%AA%8C%E6%96%B0%E7%89%88%E2%80%9D%E7%9A%84%E7%BB%84%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/537187/%E9%9A%90%E8%97%8F%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%8A%A8%E6%80%81%E4%B8%AD%E7%9A%84%E4%BE%A7%E8%BE%B9%E6%98%BE%E7%A4%BA%E2%80%9C%E4%BD%93%E9%AA%8C%E6%96%B0%E7%89%88%E2%80%9D%E7%9A%84%E7%BB%84%E4%BB%B6.meta.js
// ==/UserScript==

//针对<div class="bili-dyn-version-control"><div class="bili-dyn-version-control__btn">体验新版</div> <div class="bili-dyn-version-control__reminding" style="display: none;"></div></div>

(function() {
    'use strict';

    // 创建一个 MutationObserver 实例来监听DOM变化
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // 检查新增的节点
            if (mutation.addedNodes.length) {
                hideVersionControlDiv();
            }
        });
    });

    // 开始观察目标节点
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始检查
    hideVersionControlDiv();

    function hideVersionControlDiv() {
        const divs = document.querySelectorAll('.bili-dyn-version-control');
        divs.forEach(div => {
            div.style.display = 'none';
        });
    }
})();