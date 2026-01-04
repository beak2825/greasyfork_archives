// ==UserScript==
// @name         Bilibili 笔记小助手
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  提取笔记专栏的手机可点链接，和B站自动生成的评论说再见
// @author       as042971
// @include      *://www.bilibili.com/read/cv*
// @include      *://www.bilibili.com/read/preview/*
// @license MIT
// @grant        none
// @esversion    8
// @downloadURL https://update.greasyfork.org/scripts/439398/Bilibili%20%E7%AC%94%E8%AE%B0%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/439398/Bilibili%20%E7%AC%94%E8%AE%B0%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let toolbar = document.querySelector('.side-toolbar');
    let copyLinkBtn = null;

    if (toolbar) {
        // 已过审文章
        copyLinkBtn = document.createElement('div');
        copyLinkBtn.setAttribute('class', 'toolbar-item');
        copyLinkBtn.setAttribute('data-v-79113dbb', '');
        copyLinkBtn.innerHTML = '<i data-v-79113dbb="" class="iconfont icon-tag"></i><span class="toolbar-item__num" data-v-79113dbb="">评论链接</span>';
        toolbar.insertBefore(copyLinkBtn, toolbar.childNodes[0]);
    } else {
        // 未过审文章预览页
        copyLinkBtn = document.createElement('button');
        copyLinkBtn.setAttribute('style', 'margin-left: 10px;');
        copyLinkBtn.innerHTML = '评论链接';
        let navBar = document.querySelector('.bili-nav-bar');
        navBar.appendChild(copyLinkBtn);
    }

    copyLinkBtn.onclick = () => {
        let rawPath = window.location.pathname;
        if (rawPath.charAt(rawPath.length-1) == '/') {
            rawPath = rawPath.substr(0, rawPath.length - 1);
        }
        let url = 'https://www.bilibili.com/h5/note-app/view?cvid=' + rawPath.substr(rawPath.length - 8, 8) + '&pagefrom=comment';

        let aux = document.createElement("input");
        aux.setAttribute("value", url);
        document.body.appendChild(aux);
        aux.select();
        document.execCommand("copy");
        document.body.removeChild(aux);
    };
})();