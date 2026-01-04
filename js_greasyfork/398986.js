// ==UserScript==
// @name         iview 文档辅助工具
// @namespace    https://yungehuo.com
// @version      1.0.1
// @description  iview 文档辅助工具，用于方便查看文档
// @author       steven
// @match        *://*.iviewui.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/398986/iview%20%E6%96%87%E6%A1%A3%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/398986/iview%20%E6%96%87%E6%A1%A3%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
var scrollTopParam=0;
;(function () {
    'use strict'
    var style = document.createElement('style')
    style.textContent = [
        '.ivu-col-span-4{position:sticky;top:66px;height:calc(100vh - 66px);overflow:auto;}',
        'a.wrapper-aside,.wrapper-aside-ask,.ivu-carousel-list,.asd{display:none !important;}'
    ].join('');
    document.head.appendChild(style);
    var loop = setInterval(function () {
        $(".wrapper-navigate").scrollTop(scrollTopParam)
        $(".wrapper-navigate").scroll(function (){
            scrollTopParam=$(".wrapper-navigate").scrollTop();
        })
    }, 500);
})()
