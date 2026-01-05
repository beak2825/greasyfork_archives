// ==UserScript==
// @name        VISA CARD
// @namespace   ticket1
// @description PASS
// @include     https://netsafe.hdfcbank.com/*
// @version     2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/20877/VISA%20CARD.user.js
// @updateURL https://update.greasyfork.org/scripts/20877/VISA%20CARD.meta.js
// ==/UserScript==
document.getElementById('staticAuthOpen').addEventListener('click', function () {
 document.staticAuthForm.txtPassword.value="";keypressEvent(event);});//FILL PASSWORD
setInterval(function(){document.getElementById('staticAuthOpen').click();autob();}, 3000);