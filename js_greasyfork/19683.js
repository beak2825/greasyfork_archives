// ==UserScript==
// @name        HDF SHOW PAYMENT SUBMIT
// @namespace   ANAND KUMAR
// @description PAY
// @include     https://netbanking.hdfcbank.com/netbanking/entry
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/19683/HDF%20SHOW%20PAYMENT%20SUBMIT.user.js
// @updateURL https://update.greasyfork.org/scripts/19683/HDF%20SHOW%20PAYMENT%20SUBMIT.meta.js
// ==/UserScript==
var txt=document.frmTxn.fldTxnAmt.value;
if(txt)click_ok();