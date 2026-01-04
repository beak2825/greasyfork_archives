// ==UserScript==
// @name         Free SPON
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  SPIEGEL ONLINE ( SPON ) lesen mit aktiviertem Werbeblocker / read SPON with active adblocker
// @author       LYNX
// @match        https://www.spiegel.de/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/397052/Free%20SPON.user.js
// @updateURL https://update.greasyfork.org/scripts/397052/Free%20SPON.meta.js
// ==/UserScript==

(function() {
  'use strict';

  window.addEventListener('beforescriptexecute',
  function(event) {
    var originalScript = event.target;
    // if(/public\/spon\/generated\/web\/js\/header/.test(originalScript.src)) // Version 1.0
    if(/public\/shared\/generated\/js\/header/.test(originalScript.src)) // THNX to azz><zza !
    {
      originalScript.parentNode.removeChild(originalScript);
      event.preventDefault();
    }
  }
);

})();
