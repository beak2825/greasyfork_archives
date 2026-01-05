// ==UserScript==
// @name        HDFC net II
// @namespace   ANAND KUMAR 9794115696
// @include     https://netbanking.hdfcbank.com/netbanking/*
// @version     1
// @grant       none
// @description HDFC NET COUNT
// @downloadURL https://update.greasyfork.org/scripts/14104/HDFC%20net%20II.user.js
// @updateURL https://update.greasyfork.org/scripts/14104/HDFC%20net%20II.meta.js
// ==/UserScript==
if(userInput == ''){
			document.frmTxn.selAcct.value = 'ACCOUNT NO  ';
			refreshbalance(document.frmTxn.selAcct.selectedIndex - 1);
  click_ok();  
}