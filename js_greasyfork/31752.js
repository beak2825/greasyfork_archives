// ==UserScript==
// @name        pnb otp
// @namespace   anand kumar
// @description otp count
// @include     https://acs2.enstage-sas.com/acs-web-v17/EnrollWeb/PNB/server/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/31752/pnb%20otp.user.js
// @updateURL https://update.greasyfork.org/scripts/31752/pnb%20otp.meta.js
// ==/UserScript==
if(document.getElementsByName('otpDestinationOption')[0].value=='toMobile'){
var otp=document.getElementsByClassName("btn-submit")[0];
otp.click();}