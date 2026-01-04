// ==UserScript==
// @name         bilibili remove links
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      0.51
// @description  自动去除阿B视频评论区中AI生成的搜索链接。
// @author       Bilibili @显卡厨师
// @match        www.bilibili.com/video/*
// @match        www.bilibili.com/bangumi/*
// @match        t.bilibili.com/*
// @icon         none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453273/bilibili%20remove%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/453273/bilibili%20remove%20links.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function handler() {
        document.querySelectorAll('.search-word').forEach(link => {
            //移除无用的类与属性
            link.classList.remove('jump-link', 'search-word');
            link.removeAttribute('data-url');
            link.removeAttribute('data-search-key');

            //恢复普通文本样式
            link.style.color = 'var(--text1)';
            link.style.cursor = 'text';

            //阻止点击事件
            link.onclick = eventObj => eventObj.preventDefault();

            //移除搜索图标
            document.querySelectorAll('i.search-word').forEach(icon => {
                icon.remove();
            })
        });
    }
    var observer = new MutationObserver(handler);
    let container;
    if (window.location.hostname === "t.bilibili.com") container = document.body;
    else container = document.querySelector("#comment, .comment-container");
    observer.observe(container, {
        childList: true,
        subtree: true
    });
})();