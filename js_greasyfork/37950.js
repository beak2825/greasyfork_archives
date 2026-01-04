// ==UserScript==
// @name                空格之王 自动为中英文之间添加一个空格
// @name:zh-TW          空格之王 自動為中英文之間添加一個空格
// @description         自动替你在网页中所有的中文字和半形的英文、数字、符号之间插入空白，让文字变得美观好看。
// @description:zh-TW   自動替你在網頁中所有的中文字和半形的英文、數字、符號之間插入空白，讓文字變得美觀好看。

// @author              Moshel
// @namespace           https://hzy.pw
// @homepageURL         https://hzy.pw/
// @supportURL          https://github.com/h2y/link-fix
// @icon                https://g.alicdn.com/mm/mm-brand/0.2.2/ico/favicon.ico
// @license             GPL-3.0

// @include             *
// @exclude             /^https://www.google\..+tbm=isch/
// @exclude             https://translate.google.*
// @exclude             https://www.bilibili.com/video/*

// @require             https://cdn.jsdelivr.net/npm/pangu@4.0.7/dist/browser/pangu.min.js
// @grant               none
// *run-at              document-start
// @version             4.0.7
// @modified            07/11/2019
// @downloadURL https://update.greasyfork.org/scripts/37950/%E7%A9%BA%E6%A0%BC%E4%B9%8B%E7%8E%8B%20%E8%87%AA%E5%8A%A8%E4%B8%BA%E4%B8%AD%E8%8B%B1%E6%96%87%E4%B9%8B%E9%97%B4%E6%B7%BB%E5%8A%A0%E4%B8%80%E4%B8%AA%E7%A9%BA%E6%A0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/37950/%E7%A9%BA%E6%A0%BC%E4%B9%8B%E7%8E%8B%20%E8%87%AA%E5%8A%A8%E4%B8%BA%E4%B8%AD%E8%8B%B1%E6%96%87%E4%B9%8B%E9%97%B4%E6%B7%BB%E5%8A%A0%E4%B8%80%E4%B8%AA%E7%A9%BA%E6%A0%BC.meta.js
// ==/UserScript==


{
    let is_spacing = false;

    is_spacing = true;
    pangu.spacingPage();
    is_spacing = false;


    document.addEventListener('DOMNodeInserted', function (e) {
        if (!is_spacing) {
            is_spacing = true;
            pangu.spacingNode(e.target);
            is_spacing = false;
        }
    }, false);
}
