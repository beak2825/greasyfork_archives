// ==UserScript==
// @name            Le Parisiene remove paywall
// @namespace       StephenP
// @version         1.0.0
// @description     Removes the paywall for Le Parisiene articles.
// @author          StephenP
// @match           https://www.leparisien.fr/*
// @grant           none
// @run-at          document-idle
// @downloadURL https://update.greasyfork.org/scripts/421494/Le%20Parisiene%20remove%20paywall.user.js
// @updateURL https://update.greasyfork.org/scripts/421494/Le%20Parisiene%20remove%20paywall.meta.js
// ==/UserScript==
(function () {
  var css=document.createElement('style');
  css.innerHTML=".blurText{filter: none !important}";
  document.body.appendChild(css);
  document.getElementById('paywall-connect').remove();  
})()

