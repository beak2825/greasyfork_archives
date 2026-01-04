// ==UserScript==
// @name         CSDN Guest Copyer (CSDN 匿名复制)
// @version      1.0.0
// @description  CSDN 匿名免登录,一键复制!
// @author       Zhifeng Hu
// @icon         https://img-home.csdnimg.cn/images/20201124032511.png
// @match        https://blog.csdn.net/*/article/details/*
// @require      https://libs.baidu.com/jquery/1.9.1/jquery.min.js
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @namespace    https://github.com/huzhifeng/
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463982/CSDN%20Guest%20Copyer%20%28CSDN%20%E5%8C%BF%E5%90%8D%E5%A4%8D%E5%88%B6%29.user.js
// @updateURL https://update.greasyfork.org/scripts/463982/CSDN%20Guest%20Copyer%20%28CSDN%20%E5%8C%BF%E5%90%8D%E5%A4%8D%E5%88%B6%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('CSDN Guest Copyer');

    //去除登录框
    GM_addStyle(".login-mark,#passportbox{display:none!important;}");

    //一键复制
    $(".hljs-button").attr("data-title", "一键复制");
    $(".hljs-button").click(function(){
        GM_setClipboard(this.parentNode.innerText);
        $(".hljs-button").attr("data-title", "复制成功");
        setTimeout(function(){
            $(".hljs-button").attr("data-title", "一键复制");
        }, 1000);
    });

    //获取代码块
    let codes = document.querySelectorAll("code");
    codes.forEach(c =>{
        c.contentEditable = "true";
    });
})();