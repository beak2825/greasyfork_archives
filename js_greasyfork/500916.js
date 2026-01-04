// ==UserScript==
// @name         2FA Killer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  绕过统一身份认证系统的两步验证
// @author       H-OH
// @match        https://passport.ustc.edu.cn/loginSm.jsp*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500916/2FA%20Killer.user.js
// @updateURL https://update.greasyfork.org/scripts/500916/2FA%20Killer.meta.js
// ==/UserScript==

(function() {
    "use strict";
	window.onload=()=>
	{
		var secondCode=$.getUrlParam('secondCode');
		var form = $("<form></form>");
		form.attr('action', "login");
		form.attr('method', 'post');
		form.attr('target', '_self');
		var input = $("<input type='hidden' name='secondCode' />");
		input.attr('value', secondCode);
		var input1 = $("<input type='hidden' name='second' />");
		input1.attr('value', '2');
		form.append(input);
		form.append(input1);
		form.appendTo("body");
		form.css('display', 'none');
		form.submit();
	}
})();