// ==UserScript==
// @name         Free Ripple Roll
// @namespace    https://coinfaucet.io/*
// @icon         https://files.coinmarketcap.com/static/img/coins/32x32/ripple.png
// @version      1.1
// @description  Click FreeRiple
// @author       Anderson Mello
// @match        https://coinfaucet.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35032/Free%20Ripple%20Roll.user.js
// @updateURL https://update.greasyfork.org/scripts/35032/Free%20Ripple%20Roll.meta.js
// ==/UserScript==

$(document).ready(function(){
         document.getElementsByClassName("cmn-btn btn-yellow")[0].click();

setTimeout(function() {
  location.reload();
}, 3600000);
});