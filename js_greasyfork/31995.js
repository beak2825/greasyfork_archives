// ==UserScript==
// @name         Html5plus_link_color
// @namespace    undefined
// @version      0.3
// @description  重置html5plus.org文档中的链接文字颜色
// @author       Jack.Chan
// @match        *://*.html5plus.org/*
// @run-at       document-start
// @home-url     https://greasyfork.org/zh-CN/scripts/31995-html5plus-link-color
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31995/Html5plus_link_color.user.js
// @updateURL https://update.greasyfork.org/scripts/31995/Html5plus_link_color.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var style = document.createElement('style');
    style.id = 'fucking-style';
    style.innerHTML = '.article a[href]{color:mediumblue !important}';
    style.innerHTML+= '.article a[href]:hover, .aside>ul>li>a[href]:hover{text-decoration:underline !important}';
    style.innerHTML+= '.aside>ul>li>a[href][style]{color:red !important}';
    document.head.appendChild(style);
})();