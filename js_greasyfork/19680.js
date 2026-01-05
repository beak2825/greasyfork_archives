// ==UserScript==
// @name        NEW HDFC LOGI PASS SUBMIT
// @namespace   ticket11
// @description AUTO
// @include     https://netbanking.hdfcbank.com/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/19680/NEW%20HDFC%20LOGI%20PASS%20SUBMIT.user.js
// @updateURL https://update.greasyfork.org/scripts/19680/NEW%20HDFC%20LOGI%20PASS%20SUBMIT.meta.js
// ==/UserScript==
function logi(){
document.frmLogin.fldLoginUserId.value ="";//enter user name
fLogon();
}
function pass(){
document.frmMain.fldPassword.value = "";//enter password
		doRandomize();
		document.frmMain.chkrsastu.checked = true;
	fLogon();
}
if(document.frmLogin.fldTxnId.value =="LGN"){logi();}