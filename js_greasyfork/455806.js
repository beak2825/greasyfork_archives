// ==UserScript==
// @name         去他妈的黑白滤镜
// @icon         https://ftp.bmp.ovh/imgs/2021/04/827c720b3f24eaf6.jpg
// @namespace    saltfish
// @version      1.0
// @description  去掉全局黑白滤镜
// @author       一条咸鱼
// @match        *://*.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455806/%E5%8E%BB%E4%BB%96%E5%A6%88%E7%9A%84%E9%BB%91%E7%99%BD%E6%BB%A4%E9%95%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/455806/%E5%8E%BB%E4%BB%96%E5%A6%88%E7%9A%84%E9%BB%91%E7%99%BD%E6%BB%A4%E9%95%9C.meta.js
// ==/UserScript==

(function() {
    'use strict'

     // Your code here...
    var html= document.querySelector('html') // 这里的“html”可以换成设置了filter的class
    var filter = window.getComputedStyle(html).filter
    if(filter.indexOf('grayscale') != -1){
      html.setAttribute("style", "filter:none !important;-webkit-filter:none !important;-moz-filter:none !important;-ms-filter:none !important;-o-filter:none !important;-webkit-filter:none !important;");
    }
})();