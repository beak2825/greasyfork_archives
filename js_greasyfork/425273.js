// ==UserScript==
// @name         去除暨南大学登录验证码
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在您登陆暨南大学的网站时，你可以使用该脚本去除产生的网易易盾图形滑块验证码。
// @author       Chizuru Chionghwa
// @match        https://icas.jnu.edu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425273/%E5%8E%BB%E9%99%A4%E6%9A%A8%E5%8D%97%E5%A4%A7%E5%AD%A6%E7%99%BB%E5%BD%95%E9%AA%8C%E8%AF%81%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/425273/%E5%8E%BB%E9%99%A4%E6%9A%A8%E5%8D%97%E5%A4%A7%E5%AD%A6%E7%99%BB%E5%BD%95%E9%AA%8C%E8%AF%81%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //alert("match test");
    $("#captcha").hide();
    $("#index_login_btn").click(function(){
        $("input[name='NECaptchaValidate']").val("wdnmd");
		login();
	});
    $("#errormsg").text("验证码已经给你扬了").show();
})();
