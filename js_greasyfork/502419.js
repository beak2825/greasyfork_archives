// ==UserScript==
// @name         移除文心一言搜索结果
// @icon         https://www.baidu.com/favicon.ico
// @namespace    http://tampermonkey.net/
// @home-url     https://greasyfork.org/zh-CN/scripts/375240
// @description  删除百度搜索结果的文心一言
// @version      0.0.1
// @include      http://www.baidu.com/*
// @include      https://www.baidu.com/*
// @require      http://code.jquery.com/jquery-1.8.2.js
// @author       zylvip 阿乐
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502419/%E7%A7%BB%E9%99%A4%E6%96%87%E5%BF%83%E4%B8%80%E8%A8%80%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/502419/%E7%A7%BB%E9%99%A4%E6%96%87%E5%BF%83%E4%B8%80%E8%A8%80%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C.meta.js
// ==/UserScript==

(function () {
    'use strict';


    dealContent();
document.getElementById("wrapper_wrapper").addEventListener('DOMSubtreeModified',function(){
    setTimeout(dealContent, 500);
}, false);
    function dealContent() {
         $('.result-op.c-container.new-pmd')?.[0]?.remove()
    }
window.onload = function () {
   setTimeout(dealContent, 500);
};
window.onscroll = function(){
  setTimeout(dealContent, 0);
}
document.body.onmousemove = function(){
  setTimeout(dealContent, 0);
}

})();
