// ==UserScript==
// @name        zyxel modem autologin
// @namespace   zyxel-autologin
// @description:en zyxel modem autologin script
// @include     http://192.168.1.1/cgi-bin/login.html
// @version     1
// @grant       none
// @description zyxel modem autologin script
// @downloadURL https://update.greasyfork.org/scripts/20465/zyxel%20modem%20autologin.user.js
// @updateURL https://update.greasyfork.org/scripts/20465/zyxel%20modem%20autologin.meta.js
// ==/UserScript==

function login(){
	var user = document.getElementsByName('Loginuser')[0];
	user.value = "admin";
	var password = document.getElementsByName("LoginPassword")[0];
	password.value = "admin";
	var button = document.getElementsByName('Prestige_Login')[0];
	button.click();
}

window.onload = function() {
  login();
};