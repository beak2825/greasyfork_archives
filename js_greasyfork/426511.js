// ==UserScript==
// @name         京东一键价保
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  打开京东价格保护页面，点击按钮
// @author       You
// @match        *://pcsitepp-fm.jd.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426511/%E4%BA%AC%E4%B8%9C%E4%B8%80%E9%94%AE%E4%BB%B7%E4%BF%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/426511/%E4%BA%AC%E4%B8%9C%E4%B8%80%E9%94%AE%E4%BB%B7%E4%BF%9D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function doPUll(){
        window.scrollTo(0,document.body.scrollHeight);var a,b;function clickBtn(i){console.log(i);if(i>=b){return}window.scrollTo(0,a.eq(i).offset().top-150);if(!!a.eq(i).attr("style")){clickBtn(i+1);return}if(a.eq(i).closest(".co-th").hasClass("has-apply")!==true){a.eq(i).click()}var d=parseInt(1501*Math.random()+500,10);setTimeout(function(){clickBtn(i+1)},d)}setTimeout(function(){$(".modifyRefundType").attr("value","1");a=$(".apply-list .co-th .btn a");b=a.length;clickBtn(0)},1500);
    }
    $("#main .jb-header").append('<span id="jdfucker_heiheihei" style="color:#fff;background:#E71C05;float:right;padding:0 10px;border-radius:5px;margin-right:40px;line-height:30px;font-size:14px;margin-top:15px;cursor:pointer">一键价保</span>')
    $("#jdfucker_heiheihei").click(function(){
        doPUll()
    })
})();