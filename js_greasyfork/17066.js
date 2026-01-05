// ==UserScript==
// @name        VISA COUN I
// @namespace   ticket1
// @description PASS
// @include     https://netsafe.hdfcbank.com/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/17066/VISA%20COUN%20I.user.js
// @updateURL https://update.greasyfork.org/scripts/17066/VISA%20COUN%20I.meta.js
// ==/UserScript==
if(document.getElementsByName('sbmtBtn'))
  document.frmAcsOption.acsRadio[0].checked="true";
selectOption();
