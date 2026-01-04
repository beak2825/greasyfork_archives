// ==UserScript==
// @name         Editar_PNET
// @namespace    Padillaaka
// @version      0.7
// @description  PNET
// @author       Padillaaka
// @match        https://agentproact.ayesa.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387435/Editar_PNET.user.js
// @updateURL https://update.greasyfork.org/scripts/387435/Editar_PNET.meta.js
// ==/UserScript==

(function() {
  var str = document.getElementById("pageToolBar").innerHTML;
  var res = str.replace("paw:disabled=", "");
  document.getElementById("pageToolBar").innerHTML = res;
    // Your code here...
})();

(function() {
  var str2 = document.getElementById("pageToolBar").innerHTML;
  var res2 = str2.replace("disabled=", "");
  document.getElementById("pageToolBar").innerHTML = res2;
    // Your code here...
})();


