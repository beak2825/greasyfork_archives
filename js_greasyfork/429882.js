// ==UserScript==
// @name         MDN Toc Bar 中英文快速切换和序号目录
// @description  MDN 网站中英文快速切换和新标签页打开对比，需要先安装Toc Bar脚本
// @namespace    http://tampermonkey.net/
// @version      0.35
// @description  try to take over the world!
// @author       You
// @match        *://developer.mozilla.org/*/docs/*
// @icon         https://developer.mozilla.org/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429882/MDN%20Toc%20Bar%20%E4%B8%AD%E8%8B%B1%E6%96%87%E5%BF%AB%E9%80%9F%E5%88%87%E6%8D%A2%E5%92%8C%E5%BA%8F%E5%8F%B7%E7%9B%AE%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/429882/MDN%20Toc%20Bar%20%E4%B8%AD%E8%8B%B1%E6%96%87%E5%BF%AB%E9%80%9F%E5%88%87%E6%8D%A2%E5%92%8C%E5%BA%8F%E5%8F%B7%E7%9B%AE%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function change() {
        var tocbarheader = document.querySelector("#toc-bar > div.toc-bar__header > div.flex.toc-bar__header-left > div.toc-bar__title.hidden-when-collapsed")
            //document.querySelector("#toc-bar > div.toc-bar__header > div.flex.toc-bar__header-left");
        var url = window.location.href.includes('en-US') ? window.location.href.replace('en-US', 'zh-CN') : window.location.href.replace('zh-CN', 'en-US');
        tocbarheader.innerHTML = tocbarheader.innerHTML + '    <a href="' + url + '"  style="padding-left:10px">中英文转换</a><a href="' + url + '"  target="_blank">/新页</a>';
        var tocbarbody = document.querySelector("#toc-bar > div.toc-bar__toc");
        var s = document.styleSheets[document.styleSheets.length - 1];
        s.insertRule('#toc-bar {z-index: 2147483647;}');
s.insertRule('.simpread-font.simpread-theme-root {color: #ebebeb!important;}');
        s.insertRule('.toc-bar__toc > .toc-list {padding-left: 18px!important;}');
        s.insertRule('.toc-bar__toc>.toc-list>li li {list-style: decimal!important;padding-left: 0;}');
        s.insertRule('.toc-bar__toc>.toc-list>li ol {padding-left: 8px;}');
        var nav = document.querySelector("#root > div.page-wrapper.document-page > div.breadcrumb-locale-container.eye-protector-processed > nav");
        if (!nav) {
            return;
        }
        tocbarbody.innerHTML = nav.outerHTML + tocbarbody.innerHTML;
        s.insertRule('#toc-bar > div.toc-bar__toc > ol > li > a {display:none;}');
    }
    setTimeout(change, 200);
    //window.addEventListener("hashchange",change);
})();