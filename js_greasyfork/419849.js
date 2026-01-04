// ==UserScript==
// @name         buff自动登录
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://buff.163.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419849/buff%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/419849/buff%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
	'use strict';

	if($(".login-user.j_drop-handler").length==0){
		loginModule.steamLogin();
		//window.open("/account/login/steam?back_url=/account/steam_bind/finish", "_blank", "width=1,height=1");
	}

})();