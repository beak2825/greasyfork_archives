// ==UserScript==
// @name        VISA PASS SUBMIT II
// @namespace   ticket
// @include     https://netsafe.hdfcbank.com/*
// @version     1
// @description cont...
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/19679/VISA%20PASS%20SUBMIT%20II.user.js
// @updateURL https://update.greasyfork.org/scripts/19679/VISA%20PASS%20SUBMIT%20II.meta.js
// ==/UserScript==
if (document.frmPayerAuth.txtLogin.value){
	document.frmPayerAuth.txtPassword.value="";  //enter password
	setTimeout(function(){document.getElementsByName("cmdSubmit")[0].click(); return false;}, 4000);
	}  