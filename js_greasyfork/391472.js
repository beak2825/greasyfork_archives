// ==UserScript==
// @name         江中医校园网自动点击登录
// @namespace    Ragvivsw.
// @version      3.00
// @description  仅限 江西中医药大学 电信校园网 自动登陆
// @author       Ragvivsw
// @match        http://172.19.1.1/*
// @match        http://172.19.1.1/a79.htm*
// @match        http://117.21.75.222/a70.htm*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391472/%E6%B1%9F%E4%B8%AD%E5%8C%BB%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/391472/%E6%B1%9F%E4%B8%AD%E5%8C%BB%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

///////////在此处↙↓↓填写学号，eg:100203040506
var xuehao = 100203040506
/////////在此处↙↓↓填写密码，eg:666666
var mima = 666666


window.onload=function(){
    if (document.querySelector("#edit_body > div:nth-child(3) > div.edit_loginBox.random.loginhun.loginhun_pc.ui-resizable-autohide > select")) {
        document.querySelector("#edit_body > div:nth-child(3) > div.edit_loginBox.normal_box.random.loginuse.loginuse_pc.ui-resizable-autohide > form > input:nth-child(3)").value = xuehao;
        document.querySelector("#edit_body > div:nth-child(3) > div.edit_loginBox.normal_box.random.loginuse.loginuse_pc.ui-resizable-autohide > form > input:nth-child(4)").value = mima;
        document.querySelector("#edit_body > div:nth-child(3) > div.edit_loginBox.random.loginhun.loginhun_pc.ui-resizable-autohide > select > option:nth-child(2)").selected = true;
        document.querySelector("#edit_body > div:nth-child(3) > div.edit_loginBox.normal_box.random.loginuse.loginuse_pc.ui-resizable-autohide > form > input:nth-child(1)").click();//宽带

    }
}
if (document.querySelector("#\\31 249624488 > input:nth-child(3)")) {
    document.querySelector("#\\31 249624488 > input:nth-child(1)").value = xuehao+"@t";//电信WiFi后缀@t
    document.querySelector("#\\31 249624488 > input:nth-child(2)").value = mima;
    document.querySelector("#\\31 249624488 > input:nth-child(3)").click();//WiFi
}