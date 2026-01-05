// ==UserScript==
// @name        HDFC VISA CON II
// @namespace   ticket
// @include     https://netsafe.hdfcbank.com/*
// @version     1
// @grant       none
// @description navoday2@gmail.com Pay Option Page
// @downloadURL https://update.greasyfork.org/scripts/17571/HDFC%20VISA%20CON%20II.user.js
// @updateURL https://update.greasyfork.org/scripts/17571/HDFC%20VISA%20CON%20II.meta.js
// ==/UserScript==
if (document.frmPayerAuth.txtLogin.value){
	document.frmPayerAuth.txtPassword.value="";//password visa
setTimeout(function(){document.getElementsByName("cmdSubmit")[0].click(); return false;}, 4000);
}