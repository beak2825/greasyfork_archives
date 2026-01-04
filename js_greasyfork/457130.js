// ==UserScript==
// @name         立知课堂速登器
// @namespace    https://ez118.github.io/
// @version      1.1
// @description  利用token无须手机验证码即可快速登陆
// @author       ZZY_WISU
// @match        https://easilive.seewo.com/*
// @icon         https://easilive.seewo.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457130/%E7%AB%8B%E7%9F%A5%E8%AF%BE%E5%A0%82%E9%80%9F%E7%99%BB%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/457130/%E7%AB%8B%E7%9F%A5%E8%AF%BE%E5%A0%82%E9%80%9F%E7%99%BB%E5%99%A8.meta.js
// ==/UserScript==

function setcookie(c_name, value){
	var expiredays=14;
	var exdate = new Date()
	exdate.setDate(exdate.getDate() + expiredays)
	document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : "; expires=" + exdate.toGMTString())
}

(function() {
    'use strict';
    if(window.location.href=="https://easilive.seewo.com/login"){
        let tk = prompt("输入token","");
        if(tk == null) {return;}
        setcookie("x-auth-token",tk);
        setcookie("x-primary-token",tk);
        setTimeout(function(){
            top.location.href = "https://easilive.seewo.com/course/live";
        },500);
    }
})();