// ==UserScript==
// @name        HDFC GO OTP
// @namespace   buddha csc
// @description OTP
// @include     https://netbanking.hdfcbank.com/netbanking/entry
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/20233/HDFC%20GO%20OTP.user.js
// @updateURL https://update.greasyfork.org/scripts/20233/HDFC%20GO%20OTP.meta.js
// ==/UserScript==
var txt=document.frmTxn.fldTxnAmt.value;
if(txt<="100" || confirm("Press ok Pay:"+txt))document.frmTxn.submit();