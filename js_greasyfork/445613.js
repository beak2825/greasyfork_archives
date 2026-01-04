// ==UserScript==
// @name        Filecr Alert Remover
// @namespace   Violentmonkey Scripts
// @match       https://filecr.com/*
// @grant       none
// @version     0.1
// @author      Samad Khafi
// @license     MIT
// @description Removes filecr extension installation pop-up dialog.
// @downloadURL https://update.greasyfork.org/scripts/445613/Filecr%20Alert%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/445613/Filecr%20Alert%20Remover.meta.js
// ==/UserScript==

(function () {
  console.log("Filecr Alert Remover: Started!");

  var a = document.getElementById("site-alert");

  if (a) {
    console.log("Filecr Alert Remover: Alert Found!");
    
    a.style.position = "static";
    a.style.bottom = "0";
    a.style.right = "0";
    a.style.boxShadow = "none";

    console.log("Filecr Alert Remover: Alert Removed!");
  }  
})();
