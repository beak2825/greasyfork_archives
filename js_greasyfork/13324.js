// ==UserScript==
// @name        HDFC2CON
// @namespace   anand kumar
// @description PAY2
// @include     https://netsafe.hdfcbank.com/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13324/HDFC2CON.user.js
// @updateURL https://update.greasyfork.org/scripts/13324/HDFC2CON.meta.js
// ==/UserScript==
//if (document.frmPayerAuth.txtLogin.value){
	document.frmPayerAuth.txtPassword.value="";
	document.getElementsByName("cmdSubmit")[0].click();
//}