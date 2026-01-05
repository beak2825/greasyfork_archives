// ==UserScript==
// @name        PNB DEBID
// @namespace   IRCTC
// @description LOG
// @include     https://pgi.billdesk.com/pgidsk/pgmerc/*
// @include     https://www.billdesk.com/pgidsk/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/22127/PNB%20DEBID.user.js
// @updateURL https://update.greasyfork.org/scripts/22127/PNB%20DEBID.meta.js
// ==/UserScript==
if(document.getElementById('VMExpDate')){
document.form1.cnumber.value='6070936022';
checkCreditCard();
document.form1.expmon.value="02";
document.form1.expyr.value="2023";
document.form1.cname2.value="";
validateForm();
}
if(document.getElementById('MD')){
  document.form1.customerpin.value="";
  setTimeout(function(){document.form1.submit(); return false;}, 5000);
 //  if(confirm("Countinus...")){document.form1.submit();return false;}
}