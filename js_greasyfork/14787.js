// ==UserScript==
// @name        HDFC net I
// @namespace   ANAND KUMAR 9794115696
// @include     https://netbanking.hdfcbank.com/netbanking/*
// @version     1
// @grant       none
// @description HDFC NET COUNT
// @downloadURL https://update.greasyfork.org/scripts/14787/HDFC%20net%20I.user.js
// @updateURL https://update.greasyfork.org/scripts/14787/HDFC%20net%20I.meta.js
// ==/UserScript==
if(!document.frmMain.chkrsastu.checked){
		document.frmMain.fldPassword.value = "";
		doRandomize();
		document.frmMain.chkrsastu.checked = true;
	fLogon();
}