// ==UserScript==
// @name         ChinanetAutoLogin
// @namespace    http://your.homepage/
// @version      1.0
// @description  自动填写chinanet账号或自动登录
// @author       You
// @include      https://wlan.ct10000.com/index.wlan
// @match        https://wlan.ct10000.com/index.wlan/?version=3.10.109&ext=dhdg&updated=true
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10350/ChinanetAutoLogin.user.js
// @updateURL https://update.greasyfork.org/scripts/10350/ChinanetAutoLogin.meta.js
// ==/UserScript==
function login () {
    //填写账号密码
	var phoneText = null ;
	var pwdText = null ;
	var otherUserText = null ;
	var otherUserPwdText = null ;
	var regAreaText = null;
	var regArea = document.getElementById("regArea").options ;
	var inputList = document.getElementsByTagName('input') ;
	if (otherUserText == null && otherUserPwdText == null && regAreaText == null) {
		var phone = document.getElementById('phone') ;
		var pwd = document.getElementById('pwd') ;
		phone.value = phoneText ;
		pwd.value = pwdText ;
// 		for (var i=0; i<inputList.length; i++) {
// 			if (inputList[i].getAttribute('onclick') == "javascript:phoneLogin(this);") {
// 				phoneLogin(inputList[i]) ;
// 			}
// 		}
	}
	if (phoneText == null && pwdText == null) {
		var otherUser = document.getElementById('otherUser') ;
		var otherUserPwd = document.getElementById('otherUserPwd') ;
		otherUser.value = otherUserText ;
		otherUserPwd.value = otherUserPwdText ;
		for (var i=0; i<regArea.length; i++) {
			if (regArea[i].value == regAreaText) {
				document.getElementById("regArea").options[i].selected = true ;
			}
		}
// 		for (var i=0; i<inputList.length; i++) {
// 			if (inputList[i].getAttribute('onclick') == "javascript:otherLogin(this);") {
// 				otherLogin(inputList[i]) ;
// 			}
// 		}
	}
}
function addLoadEvent (func) {
	var oldonload = window.onload ;
	if (typeof oldonload != "function") {
		window.onload = func ;
	} else {
		oldonload() ;
		func() ;
	}
}
addLoadEvent(login) ;

