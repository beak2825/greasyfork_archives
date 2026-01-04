// ==UserScript==
// @name        Arrow Control - manganelo.com
// @namespace   Qther
// @match       https://manganelo.com/chapter/*
// @grant       none
// @version     1.0
// @author      Qther
// @description Use left and right arrow keys to switch between chapters.
// @downloadURL https://update.greasyfork.org/scripts/407764/Arrow%20Control%20-%20manganelocom.user.js
// @updateURL https://update.greasyfork.org/scripts/407764/Arrow%20Control%20-%20manganelocom.meta.js
// ==/UserScript==

document.onkeydown = evt => {
  evt = evt || window.event;
  if (evt.keyCode == 39) {
    document.getElementsByClassName("navi-change-chapter-btn-next a-h")[0].click();
  }
  else if (evt.keyCode == 37) {
    document.getElementsByClassName("navi-change-chapter-btn-prev a-h")[0].click();
  }
}