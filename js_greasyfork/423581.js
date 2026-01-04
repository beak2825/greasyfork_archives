 // ==UserScript==
 // @name         湖南信息职业技术学院 校园网自动登录
 // @namespace    http://tampermonkey.net/
 // @version      1.0
 // @description  实现校园网的自动登录
 // @author       xiaoyu0216
 // @match       http://10.253.0.1/a70.htm
 // @require      https://code.jquery.com/jquery-3.3.1.min.js
 // @require      https://code.jquery.com/ui/1.12.1/jquery-ui.js
 // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423581/%E6%B9%96%E5%8D%97%E4%BF%A1%E6%81%AF%E8%81%8C%E4%B8%9A%E6%8A%80%E6%9C%AF%E5%AD%A6%E9%99%A2%20%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/423581/%E6%B9%96%E5%8D%97%E4%BF%A1%E6%81%AF%E8%81%8C%E4%B8%9A%E6%8A%80%E6%9C%AF%E5%AD%A6%E9%99%A2%20%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
 // ==/UserScript==


setTimeout(function(){
    //找到账号窗口并填写账号                                   XXXXX为你的登录账号
document.querySelector("#edit_body > div.edit_row.ui-resizable-autohide > div.edit_loginBox.ui-resizable-autohide > form > input:nth-child(2)").value = "XXXXXXXXX";

    //找到密码窗口并填写密码                                   XXXXX为你的登录账号
document.querySelector("#edit_body > div.edit_row.ui-resizable-autohide > div.edit_loginBox.ui-resizable-autohide > form > input:nth-child(3)").value = "XXXXXXXX"

    //找到运营商并选择对应的运营商   选择你使用的运营商 列如你的运营商为中国联通
    //就将  中国联通.selected = false  ，后面的false改为true  其他的都改为fales ，这里我的运营商为校园网

var 校园网=document.querySelector("#edit_body > div.edit_row.ui-resizable-autohide > div.edit_loginBox.ui-resizable-autohide > select > option:nth-child(2)")
var 中国移动=document.querySelector("#edit_body > div.edit_row.ui-resizable-autohide > div.edit_loginBox.ui-resizable-autohide > select > option:nth-child(3)")
var 中国联通=document.querySelector("#edit_body > div.edit_row.ui-resizable-autohide > div.edit_loginBox.ui-resizable-autohide > select > option:nth-child(4)")
var 中国电信=document.querySelector("#edit_body > div.edit_row.ui-resizable-autohide > div.edit_loginBox.ui-resizable-autohide > select > option:nth-child(5)")
    校园网.selected = true
    中国移动.selected = false
    中国联通.selected = false
    中国电信.selected = false

    //找到登录按钮并登录
document.querySelector("#edit_body > div.edit_row.ui-resizable-autohide > div.edit_loginBox.ui-resizable-autohide > form > input:nth-child(1)").click();;
;},4000);

