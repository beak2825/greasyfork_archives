// ==UserScript==
// @name         USTC No Validate
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Disable validate code when log in
// @author       txtxj
// @match        https://passport.ustc.edu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446724/USTC%20No%20Validate.user.js
// @updateURL https://update.greasyfork.org/scripts/446724/USTC%20No%20Validate.meta.js
// ==/UserScript==

(function() {
    'use strict';

	var valid = document.getElementsByTagName("form")[0];
	valid.setAttribute("novalidate", "true");
	
        $("#valiCode").hide();

	unsafeWindow.check = function check() {
		var id = $("#username").val();
		var pwd = $("#password").val();
		if (id == "") {
			if (clientLanguage == "zh") {
				alert("请输入账号！");
			} else if (clientLanguage == "en") {
				alert("Please input Username!");
			}
			$("#username").focus();
			return false;
		}
		if (pwd == "") {
			if (clientLanguage == "zh") {
				alert("请输入密码！");
			} else if (clientLanguage == "en") {
				alert("Please enter your Password!");
			}
			$("#password").focus();
			return false;
		}
		return true;
	}
})();