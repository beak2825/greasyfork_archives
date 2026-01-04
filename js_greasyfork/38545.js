// ==UserScript==
// @name        Prevent Spacebar Doing Page Down
// @author      Jefferson "jscher2000" Scher
// @namespace   JeffersonScher
// @description When the Spacebar key is received outside a text entry area, discard it
// @include     *
// @version     1.0
// @grant       none
// @copyright   Copyright 2018 Jefferson Scher
// @license     BSD 3-clause
// @downloadURL https://update.greasyfork.org/scripts/38545/Prevent%20Spacebar%20Doing%20Page%20Down.user.js
// @updateURL https://update.greasyfork.org/scripts/38545/Prevent%20Spacebar%20Doing%20Page%20Down.meta.js
// ==/UserScript==

function PSDPD_KeyCheck(key){
  // Don't modify text editing
  if (key.target.nodeName == "INPUT" || key.target.nodeName == "TEXTAREA" || key.target.nodeName == "SELECT") return;
  if (key.target.hasAttribute("contenteditable") && key.target.getAttribute("contenteditable") == "true") return;
  // Don't modify certain combinations
  if (key.ctrlKey || key.altKey || key.metaKey) return;
  // If it's a space character, kill the event
  if (key.key == ' '){
    key.stopPropagation();
    key.preventDefault();
    return false;
  }
}
// Monitor the keydown event
document.addEventListener('keydown', PSDPD_KeyCheck);