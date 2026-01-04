// ==UserScript==
// @name        Trac highlight last click in timeline - tetracore.local
// @namespace   Violentmonkey Scripts
// @match       http*://trac.tetracore.local/*/timeline
// @grant       none
// @version     1.0
// @author      mrculler
// @description 4/27/2022, 3:11:16 PM
// @license public domain
// @downloadURL https://update.greasyfork.org/scripts/444108/Trac%20highlight%20last%20click%20in%20timeline%20-%20tetracorelocal.user.js
// @updateURL https://update.greasyfork.org/scripts/444108/Trac%20highlight%20last%20click%20in%20timeline%20-%20tetracorelocal.meta.js
// ==/UserScript==

document.querySelectorAll(".changeset").forEach(function(el) {
  el.onmousedown = function() {
    document.querySelectorAll(".changeset").forEach(function(oel) { 
      oel.style.backgroundColor = null;
    });
    el.style.backgroundColor = "aliceblue"; 
  }; 
});