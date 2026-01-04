// ==UserScript==
// @name         超星自动填充账号密码
// @namespace    Anubis Ja
// @version      1.0.0
// @description  自动填充账号密码
// @author       Anubis Ja
// @match        *://*.chaoxing.com/login*
// @match        *://*.chaoxing.com/wlogin*
// @match        *://*.chaoxing.com/wunitlogin*
// @require      https://cdn.staticfile.org/jquery/1.7.2/jquery.min.js
// @run-at       document-end
// @grant        unsafeWindow
// @supportURL   https://greasyfork.org/zh-CN/scripts/385594
// @downloadURL https://update.greasyfork.org/scripts/385594/%E8%B6%85%E6%98%9F%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E8%B4%A6%E5%8F%B7%E5%AF%86%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/385594/%E8%B6%85%E6%98%9F%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E8%B4%A6%E5%8F%B7%E5%AF%86%E7%A0%81.meta.js
// ==/UserScript==
var _self = unsafeWindow,
$ = _self.jQuery || window.jQuery;
var $div = $(
    '<div style="border: 2px dashed rgb(0, 85, 68); width: 300px; position: fixed; top: 30px; right: 1%; z-index: 999999; font-size: 15px; background-color: rgba(70, 196, 38, 0.8); color: white;">' +
        '<div style="text-align: center; color: black; font-size: 20px;">超星自动填充账号密码</div>' +
        '<hr><br>' +
        '<form style="margin: 0 5px;">' +
            '<div>' +
                '支持页面：<br><a href="https://passport2.chaoxing.com/wlogin" target="_blank">wlogin（推荐，手机号+密码）</a><br><a href="https://passport2.chaoxing.com/login" target="_blank">login</a><br><a href="https://passport2.chaoxing.com/wunitlogin" target="_blank">wunitlogin</a><br>账号密码空格隔开,多个空格隔开的也可以' +
                '<input id="dl" name="dl" type="text" style="text-align: center; color: black; width: 290px; height: 30px;"  placeholder="输入账号密码">' +
            '<br>' +
        '</form>' +
        '<br><a href="https://greasyfork.org/zh-CN/scripts/380572" target="_blank">推荐脚本：超星网课全能打码（点击安装）</a></div>' +
    '</div>'
).appendTo('body').on('input change', 'input', function(event) {
var url = window.location.href;
var arr = new Array();
var r = /\s+/g;
arr = $("#dl").val().replace("	", " ").replace(r, ' ').split(' ');
if (url.indexOf("chaoxing.com/login") >= 0) { //超星登录login
    $("#unameId").val(arr[0]);
    $("#passwordId").val(arr[1]);
}
if (url.indexOf("chaoxing.com/wlogin") >= 0) { //超星登录wlogin
    $("#phone").val(arr[0]);
    $("#code").val(arr[1]);
}
if (url.indexOf("chaoxing.com/wunitlogin") >= 0) { //超星登录wunitlogin
    $("#idNumber").val(arr[0]);
    $("#pwd").val(arr[1]);
}
//console.log($("#dl").val())
}).end();