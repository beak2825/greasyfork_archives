// ==UserScript==
// @name         增强ZF粘贴
// @namespace    Violentmonkey Scripts
// @description  解决正方系统密码框粘贴密码的问题
// @match        *://*/*/*/login_slogin.html*
// @match        *://*/*/login_slogin.html*
// @match        *://*/*/*_slogin.html*
// @require      https://code.jquery.com/jquery-1.11.1.js
// @icon         http://www.zfsoft.com/img/zf.ico
// @version      0.3.1.2
// @author       xzq
// @grant        none
//
// @downloadURL https://update.greasyfork.org/scripts/378580/%E5%A2%9E%E5%BC%BAZF%E7%B2%98%E8%B4%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/378580/%E5%A2%9E%E5%BC%BAZF%E7%B2%98%E8%B4%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //复制真实密码框-做伪密码框
    var inputmm = $("#mm");
    var inputwmm = $("#yhm").clone(true).attr("type","text").attr("placeholder","密码(可粘贴)").removeAttr("name").attr("id","wmm").appendTo(inputmm.parent());
    //复制按钮
    var wz_btn = $("#dl").clone(true).attr("id","showWzInput").html("伪装密码框").appendTo($("#dl").parent());
    //绑定事件-将内容给到真正的密码框中
    inputwmm.off('blur').on("blur",function(){
        inputmm.val(inputwmm.val());
        inputmm.removeAttr("style");
        inputwmm.attr("style","display:none");
    });
    var wzInput = function(){
        inputmm.attr("style","display:none");
        inputwmm.removeAttr("style");
    };
    //手动显示
    wz_btn.on("click",function(){
        wzInput();
    });
    //加载页面自动显示一次
    wzInput();
})();