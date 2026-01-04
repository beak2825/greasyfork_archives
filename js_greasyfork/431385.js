// ==UserScript==
// @name        Odysee keyboard control fix
// @namespace   Violentmonkey Scripts
// @match       https://odysee.com/*
// @grant       none
// @version     1.0
// @author      neruok
// @description Fixes issues with keyboard scrolling and volume changes.
// @downloadURL https://update.greasyfork.org/scripts/431385/Odysee%20keyboard%20control%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/431385/Odysee%20keyboard%20control%20fix.meta.js
// ==/UserScript==

window.addEventListener("keydown", function(e) {
  elem = document.activeElement
  if (elem.tagName === "VIDEO"){
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
      e.preventDefault();
    }
  }
  else {
    e.stopImmediatePropagation();
  }
}, false);