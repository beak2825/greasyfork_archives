// ==UserScript==
// @name        PNB NET
// @namespace   BUDDHACSC
// @description FILL
// @include     https://netbanking.netpnb.com/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/24355/PNB%20NET.user.js
// @updateURL https://update.greasyfork.org/scripts/24355/PNB%20NET.meta.js
// ==/UserScript==
if(document.getElementById('AuthenticationFG.USER_PRINCIPAL').value==""){
  document.getElementById('AuthenticationFG.USER_PRINCIPAL').value="HZA";
  document.getElementById('STU_VALIDATE_CREDENTIALS').click();
} 
//if(document.getElementById('AuthenticationFG.ACCESS_CODE')){alert();
// document.getElementById('AuthenticationFG.ACCESS_CODE').value="N";
//document.getElementById('VALIDATE_STU_CREDENTIALS1').click();}