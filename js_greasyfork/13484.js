// ==UserScript==
// @name        Prevent Slash Opening QuickFind
// @author      Jefferson "jscher2000" Scher
// @namespace   JeffersonScher
// @description When the / key is received outside a text entry field, discard it
// @include     *
// @version     0.9.2
// @grant       none
// @copyright   Copyright 2015 Jefferson Scher
// @license     BSD 3-clause
// @downloadURL https://update.greasyfork.org/scripts/13484/Prevent%20Slash%20Opening%20QuickFind.user.js
// @updateURL https://update.greasyfork.org/scripts/13484/Prevent%20Slash%20Opening%20QuickFind.meta.js
// ==/UserScript==

function PSOQ_KeyCheck(key){
  if (key.target.nodeName == "INPUT" || key.target.nodeName == "TEXTAREA" || key.target.nodeName == "SELECT") return;
  if (key.target.hasAttribute("contenteditable") && key.target.getAttribute("contenteditable") == "true") return;
  if (key.ctrlKey || key.shiftKey || key.altKey || key.metaKey) return;
  // codes for / and ' key on my Windows 7, your keyCode may vary?
  if (key.which == 191 || key.which == 222){
    key.stopPropagation();
    key.preventDefault();
    return false;
  }
}
document.onkeydown = PSOQ_KeyCheck;