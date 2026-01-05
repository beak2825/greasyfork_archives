// ==UserScript==
// @name        HDFC NET SET AC
// @namespace   ANAND KUMAR
// @include     https://netbanking.hdfcbank.com/netbanking/*
// @version     1
// @grant       none
// @description select ac
// @downloadURL https://update.greasyfork.org/scripts/19682/HDFC%20NET%20SET%20AC.user.js
// @updateURL https://update.greasyfork.org/scripts/19682/HDFC%20NET%20SET%20AC.meta.js
// ==/UserScript==
if(userInput == ''){
			document.frmTxn.selAcct.value = '  ';//enter ac no
			refreshbalance(document.frmTxn.selAcct.selectedIndex - 1);
  click_ok();  
}