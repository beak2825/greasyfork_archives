// ==UserScript==
// @name         一行代码微博知乎跳转
// @namespace    http://tampermonkey.net/
// @version      3.1.0
// @description  try to take over the world!
// @license GPL
// @author       zycat
// @match        *://*.sinaurl.cn/*
// @match        *://*.weibo.cn/*
// @match        *://*.t.cn/*
// @match        *://link.zhihu.com/*
// @run-at document-ide
// @downloadURL https://update.greasyfork.org/scripts/408836/%E4%B8%80%E8%A1%8C%E4%BB%A3%E7%A0%81%E5%BE%AE%E5%8D%9A%E7%9F%A5%E4%B9%8E%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/408836/%E4%B8%80%E8%A1%8C%E4%BB%A3%E7%A0%81%E5%BE%AE%E5%8D%9A%E7%9F%A5%E4%B9%8E%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {

    'use strict';
    if(window.location.href.indexOf("zhihu")!=-1){
         window.location.href=document.getElementsByClassName('link')[0].textContent
    }else {
    document.getElementsByClassName('m-btn m-btn-block m-btn-orange ')[0].click()}
   
 
})();