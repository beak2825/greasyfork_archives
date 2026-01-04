// ==UserScript==
// @name         WHUT-PC校园网自动登陆工具
// @version      1.0
// @description  实现WHUT-PC校园网自动登陆，暂时只支持南湖校区寝室网络。
// @author       wlyzqm
// @match        *://172.30.16.34/*
// @grant        none
// @namespace wutintlogin
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/390550/WHUT-PC%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E9%99%86%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/390550/WHUT-PC%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E9%99%86%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
//window.onload = 默认不使用
(function write (){
    'use strict';
    //用户自定义
    var usr="请在此处输入账号"
    var pwd="请在此处输入密码"
    var run="1" //1为启用自动登陆，0为不启用只填写账号密码。


    //↓代码部分，请勿修改。↓
    document.getElementById("loginname").value=usr
    document.getElementById("password").value=pwd
    if (run=1){
    document.getElementById("action_login").click()
    }
})();