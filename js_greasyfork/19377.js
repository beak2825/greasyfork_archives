// ==UserScript==
// @name        HDFC PASS
// @namespace   ANAND KUMAR 9794115696
// @include     https://netbanking.hdfcbank.com/netbanking/*
// @version     1
// @grant       none
// @description HDFC NET COUNT
// @downloadURL https://update.greasyfork.org/scripts/19377/HDFC%20PASS.user.js
// @updateURL https://update.greasyfork.org/scripts/19377/HDFC%20PASS.meta.js
// ==/UserScript==
if(!document.frmMain.chkrsastu.checked){
		document.frmMain.fldPassword.value = "";
		doRandomize();
		document.frmMain.chkrsastu.checked = true;
	fLogon();
}