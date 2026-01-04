// ==UserScript==
// @name         关闭百度搜索热词cnm
// @namespace    http://tampermonkey.net/
// @version      2025-03-09
// @description  傻逼百度，滚吧
// @author       Dragon Wind
// @match        https://www.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484236/%E5%85%B3%E9%97%AD%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%83%AD%E8%AF%8Dcnm.user.js
// @updateURL https://update.greasyfork.org/scripts/484236/%E5%85%B3%E9%97%AD%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%83%AD%E8%AF%8Dcnm.meta.js
// ==/UserScript==

/* globals sentinel */
(function() {
    'use strict';
    var hide=false;
    var tryCount = 0;
    var maxTryCount = 100;
    // 等待 3 秒后执行
    var r=setInterval(function() {
        tryCount++;
        if(hide && tryCount>maxTryCount){
            clearInterval(r);
        }
        var input = document.querySelector('input.s_ipt');
        if(input){

        //window.alert(input)
            input.placeholder = ''; // 清空 placeholder
            hide=true;
        }
    }, 100); // 3秒后执行

})();