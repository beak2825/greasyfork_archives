// ==UserScript==
// @name        NEW HDFC NET
// @namespace   ticket11
// @description AUTO
// @include     https://netbanking.hdfcbank.com/*
// @version     1.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/14103/NEW%20HDFC%20NET.user.js
// @updateURL https://update.greasyfork.org/scripts/14103/NEW%20HDFC%20NET.meta.js
// ==/UserScript==
if(document.frmLogin.fldLoginUserId){
document.frmLogin.fldLoginUserId.value ="";
fLogon();
}