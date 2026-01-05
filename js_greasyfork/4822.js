// ==UserScript==
// @name           vkontakte.ru loginform email autofill
// @namespace      http://userscripts.org/
// @description    automatically fills email into login form at vkontakte.ru
// @include        http://vkontakte.ru/*
// @include        http://*.vkontakte.ru/*
// @include        http://vk.com/*
// @include        http://*.vk.com/*
// @version 0.0.1.20140904105009
// @downloadURL https://update.greasyfork.org/scripts/4822/vkontakteru%20loginform%20email%20autofill.user.js
// @updateURL https://update.greasyfork.org/scripts/4822/vkontakteru%20loginform%20email%20autofill.meta.js
// ==/UserScript==


function main() {
	var email = "yz@yz.kiev.ua";

	var isLoginForm = document.getElementById("quick_login_form") || document.getElementById("login");
	if (isLoginForm) {
		var emailBox = document.getElementById("quick_email");
		if (emailBox) {
			emailBox.value = email;
		}
		document.login.pass.focus();
//		document.getElementById("quick_pass").focus();
	}
}
main();
