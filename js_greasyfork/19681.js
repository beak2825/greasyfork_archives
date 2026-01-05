// ==UserScript==
// @name        HDFC PASS FILL SUB
// @namespace   ANAND KUMAR 9794115696
// @include     https://netbanking.hdfcbank.com/netbanking/*
// @version     1
// @grant       none
// @description HDFC NET COUNT
// @downloadURL https://update.greasyfork.org/scripts/19681/HDFC%20PASS%20FILL%20SUB.user.js
// @updateURL https://update.greasyfork.org/scripts/19681/HDFC%20PASS%20FILL%20SUB.meta.js
// ==/UserScript==
if(!document.frmMain.chkrsastu.checked){
		document.frmMain.fldPassword.value = "";//enter password
		doRandomize();
		document.frmMain.chkrsastu.checked = true;
	fLogon();
}