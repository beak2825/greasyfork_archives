// ==UserScript==
// @name        HDF LAST
// @namespace   ANAND KUMAR
// @description PAY
// @include     https://netbanking.hdfcbank.com/netbanking/entry
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/14789/HDF%20LAST.user.js
// @updateURL https://update.greasyfork.org/scripts/14789/HDF%20LAST.meta.js
// ==/UserScript==
var txt=document.frmTxn.fldTxnAmt.value;
if(txt<="100" || confirm("Press ok Pay:"+txt))document.frmTxn.submit();