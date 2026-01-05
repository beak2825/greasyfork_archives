// ==UserScript==
// @name        NEW HDFC USE
// @namespace   ticket11
// @description AUTO
// @include     https://netbanking.hdfcbank.com/*
// @version     1.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/17065/NEW%20HDFC%20USE.user.js
// @updateURL https://update.greasyfork.org/scripts/17065/NEW%20HDFC%20USE.meta.js
// ==/UserScript==
if(document.frmLogin.fldLoginUserId){
document.frmLogin.fldLoginUserId.value ="";
fLogon();
}