// ==UserScript==
// @name         Comentarios_PNET
// @namespace    Padillaaka
// @version      0.3
// @description  PNET
// @author       Padillaaka
// @match        https://agentproact.ayesa.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387438/Comentarios_PNET.user.js
// @updateURL https://update.greasyfork.org/scripts/387438/Comentarios_PNET.meta.js
// ==/UserScript==

(function() {
  var str = document.getElementById("timeTrackingRowDelMulti").innerHTML;
  var res = str.replace('disabled="true"', 'style="background-color: #4CAF50;"');
  document.getElementById("timeTrackingRowDelMulti").innerHTML = res;
    // Your code here...
})();



