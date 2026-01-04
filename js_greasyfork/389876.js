// ==UserScript==
// @name         联通光猫超管登陆
// @namespace    https://github.com/luomoxu/UserScript
// @version      0.1
// @description  目前测试支持光猫 KD-YUN-811E(北京联通)
// @author       You
// @match        http://192.168.1.1/*
// @match        http://192.168.100.1/*
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/389876/%E8%81%94%E9%80%9A%E5%85%89%E7%8C%AB%E8%B6%85%E7%AE%A1%E7%99%BB%E9%99%86.user.js
// @updateURL https://update.greasyfork.org/scripts/389876/%E8%81%94%E9%80%9A%E5%85%89%E7%8C%AB%E8%B6%85%E7%AE%A1%E7%99%BB%E9%99%86.meta.js
// ==/UserScript==

(function () {
	'use strict';
	if ($('title').text() == '中国联通家庭网关') {
		$(".wrapper_administrtor_passwordbox").after('<div class="wrapper_administrtor_passwordbox"><input style="width: 323px;" type="button" id="admin_login" value="管理员登陆" class="wrapper_administrtor_but" onclick="submitFrm()"></div>')
		$("#admin_login").on("click", function () {
			$("#user_name").val('CUAdmin');
			$("#loginfrm").submit();
		});
		console.log(unsafeWindow.authLevel)
		if (typeof unsafeWindow.authLevel != "undefined") {
			unsafeWindow.authLevel = 10;
		}
	}
})();