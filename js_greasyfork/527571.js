// ==UserScript==
// @name         有道云笔记无广告
// @namespace    noteyoudaonoad
// @homepage     https://zhengkai.blog.csdn.net/
// @version      20250222.6
// @description  删除指定的广告组件 , 适用于： ✅有道云笔记网页版https://note.youdao.com/
// @author       Moshow郑锴
// @license      MIT
// @match        https://note.youdao.com/web/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527571/%E6%9C%89%E9%81%93%E4%BA%91%E7%AC%94%E8%AE%B0%E6%97%A0%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/527571/%E6%9C%89%E9%81%93%E4%BA%91%E7%AC%94%E8%AE%B0%E6%97%A0%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 公共方法：删除所有匹配选择器的元素
    function removeElements(selector) {
        document.querySelectorAll(selector).forEach(function(element) {
            element.remove();
        });
    }

    // 公共方法：移除所有匹配选择器的元素的特定 class
    function removeClass(selector, className) {
        document.querySelectorAll(selector).forEach(function(element) {
            element.classList.remove(className);
        });
    }

    // 观察DOM的变化
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                removeElements('#flexible-list-left > div:nth-child(2) > div > ad-component');
                removeClass('#file-outer', 'adListTag');
                removeClass('.list-bd.adList', 'adList');
                removeClass('.list-bd.noItemNum.adList', 'adList');
                removeClass('#file-outer.list-bd.adList', 'adList');
            }
        });
    });

    // 配置观察选项
    const config = { childList: true, subtree: true };

    // 开始观察body元素
    observer.observe(document.body, config);

    // 在DOM加载完成后执行一次函数
    document.addEventListener('DOMContentLoaded', function() {
        removeElements('#flexible-list-left > div:nth-child(2) > div > ad-component');
        removeClass('#file-outer', 'adListTag');
        removeClass('.list-bd.noItemNum.adList', 'adList');
        removeClass('.list-bd.adList', 'adList');
        removeClass('#file-outer.list-bd.adList', 'adList');
    });
})();