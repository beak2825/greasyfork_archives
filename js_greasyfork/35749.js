// ==UserScript==
// @version        2017.11.06
// @name 58chedai
// @description 58chedai quick invest
// @namespace 58chedai
// @match https://58chedai.com/invest/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/35749/58chedai.user.js
// @updateURL https://update.greasyfork.org/scripts/35749/58chedai.meta.js
// ==/UserScript==
$(function(){
    //在列表页面等待倒计时，时间到了点击进入投标页面，已经自动填好了金额和密码，直接点提交按钮即可。
    investshowBg();
    $("#money").val("20000");
    $("#money").blur();
    $("[name=paypassword]:first").val("821120");
    $("[name=paypassword]:first").blur().prop();  
});
