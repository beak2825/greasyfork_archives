// ==UserScript==
// @name         CSDN Allow copy
// @namespace    csdn
// @version      1.0.1
// @description  CSDN免登录复制
// @author       mjj
// @match        https://blog.csdn.net/*/article/details/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @icon         https://g.csdnimg.cn/static/logo/favicon32.ico
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/432956/CSDN%20Allow%20copy.user.js
// @updateURL https://update.greasyfork.org/scripts/432956/CSDN%20Allow%20copy.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    //去除登录框
    GM_addStyle(".login-mark,#passportbox{display:none!important;}");
 
    //选中后复制
    var pre = $("#content_views pre");
    var preCode = $("#content_views pre code");
    pre.css("cssText","user-select: auto;");
    preCode.css("cssText","user-select: auto;");
 /*
    //点按钮复制
    $(".hljs-button").attr("data-title", "来，点这嘎达复制全部！");
    $(".hljs-button").click(function(){
        GM_setClipboard(this.parentNode.innerText);
        $(".hljs-button").attr("data-title", "干他妈的老子复制成功了！你服不服？");
        setTimeout(function(){
            $(".hljs-button").attr("data-title", "憋瞅了，麻溜的去粘贴吧，整完赶紧下班！");
        }, 1000);
    });
*/
})();