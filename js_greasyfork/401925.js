// ==UserScript==
// @name        Block Save Keyboard Shortcut in Roam
// @namespace   https://eriknewhard.com/
// @author      everruler12
// @description For people who have a habit of hitting Ctrl+S in Roam, and want to stop the browser save dialog from popping up
// @version     1.1
// @license     ISC
// @grant       none
// @match       https://roamresearch.com/*
// @downloadURL https://update.greasyfork.org/scripts/401925/Block%20Save%20Keyboard%20Shortcut%20in%20Roam.user.js
// @updateURL https://update.greasyfork.org/scripts/401925/Block%20Save%20Keyboard%20Shortcut%20in%20Roam.meta.js
// ==/UserScript==

document.addEventListener("keydown", function(e) {
  if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
    e.preventDefault()
  }
}, false)