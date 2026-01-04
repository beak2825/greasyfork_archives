// ==UserScript==
// @name         更好用的 CSDN 免登录复制
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  升级后的 CSDN 免登录复制
// @author       Cipher
// @match        https://blog.csdn.net/*/article/details/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @icon         https://img-home.csdnimg.cn/images/20201124032511.png
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450557/%E6%9B%B4%E5%A5%BD%E7%94%A8%E7%9A%84%20CSDN%20%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/450557/%E6%9B%B4%E5%A5%BD%E7%94%A8%E7%9A%84%20CSDN%20%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 隐藏登录框
    GM_addStyle(".login-mark,#passportbox{display:none!important;}");
    // 隐藏蒙层及容器
    GM_addStyle(".login-mark,.passport-login-mark{display:none!important;}");
    GM_addStyle(".login-mark,.passport-login-container{display:none!important;}");

    //选中后复制
    var pre = $("#content_views pre");
    var preCode = $("#content_views pre code");
    pre.css("cssText","user-select: auto;");
    preCode.css("cssText","user-select: auto;");

    // 点击复制按钮
    $(".hljs-button").attr("data-title", "点击复制");
    $(".hljs-button").click(function(){
        GM_setClipboard(this.parentNode.innerText);
        $(".hljs-button").attr("data-title", "复制成功了！");
        setTimeout(function(){
            $(".hljs-button").attr("data-title", "点击复制");
        }, 1000);
    });
})();