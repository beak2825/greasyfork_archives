// ==UserScript==
// @name		 AutoQQLogin
// @name:zh-CN   自动QQ登录
// @namespace    AutoQQLogin
// @version      1.1.0
// @description  用于网站自动QQ登录
// @include      http*://xui.ptlogin2.qq.com/cgi-bin/xlogin*
// @run-at 		document-end
// @author       wycaca
// @copyright 	2020+, wycaca
// @downloadURL https://update.greasyfork.org/scripts/370420/AutoQQLogin.user.js
// @updateURL https://update.greasyfork.org/scripts/370420/AutoQQLogin.meta.js
// ==/UserScript==

var now = 1;
var time = 5;
var a,b;
(function() {
    a = window.setInterval(login, 1000);
    b = window.setInterval(timeCheck, 1000);
})();

function login() {
    now++;
    var qqNum = document.getElementById("qlogin_list").childNodes[1].getAttribute("uin");
    if (qqNum.length > 3) {
        console.log("QQ: " + qqNum);
        // 判断是否为手机登录
        if (document.getElementsByClassName("onekey_logo").length == 0){
            var QQNum = document.getElementById("qlogin_list").childNodes[1].getAttribute("uin");
            console.log("QQNumElem: " + document.getElementById("img_out_" + QQNum));
            document.getElementById("img_out_" + QQNum).click();
        } else {
            console.log("Mobile QQ Online");
        }
    }
}

function timeCheck() {
    console.log("now: " + now);
    if(now >= time){
        window.clearInterval(a);
        window.clearInterval(b);
    }
    document.getElementById("switcher_plogin").click();
}