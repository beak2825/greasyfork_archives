// ==UserScript==
// @name         f4ck csdn,自动点击更多，看博客不需登录，去剪切板的尾巴
// @namespace    http://tampermonkey.net/
// @version      0.1.1.3
// @description  f4ck csdn：自动点击更多，看博客不需登录，去剪切板的尾巴
// @author       Linfree
// @match        *://blog.csdn.net/*
// @downloadURL https://update.greasyfork.org/scripts/374897/f4ck%20csdn%2C%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E6%9B%B4%E5%A4%9A%EF%BC%8C%E7%9C%8B%E5%8D%9A%E5%AE%A2%E4%B8%8D%E9%9C%80%E7%99%BB%E5%BD%95%EF%BC%8C%E5%8E%BB%E5%89%AA%E5%88%87%E6%9D%BF%E7%9A%84%E5%B0%BE%E5%B7%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/374897/f4ck%20csdn%2C%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E6%9B%B4%E5%A4%9A%EF%BC%8C%E7%9C%8B%E5%8D%9A%E5%AE%A2%E4%B8%8D%E9%9C%80%E7%99%BB%E5%BD%95%EF%BC%8C%E5%8E%BB%E5%89%AA%E5%88%87%E6%9D%BF%E7%9A%84%E5%B0%BE%E5%B7%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    //清除要求登陆
    localStorage.clear();
    //自动展开
    if (document.getElementById("btn-readmore")){
        document.getElementById("btn-readmore").click();
    } 
    //删除剪切板尾巴
    function addLink(e) {
        e.preventDefault();
        var pagelink = '\nRead more: ' + document.location.href,
            copytext = window.getSelection();
        var clipdata = e.clipboardData || window.clipboardData;
        if (clipdata) {
            clipdata.setData('Text', copytext);
        }
    }
    document.addEventListener('copy', addLink);
    ////////////////
})();