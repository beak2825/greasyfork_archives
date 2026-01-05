// ==UserScript==
// @name        DropStop
// @author      Jefferson "jscher2000" Scher
// @namespace   JeffersonScher
// @version     1
// @description Cancel drop event so page doesn't navigate away
// @copyright   Copyright 2015 Jefferson Scher
// @license     BSD
// @include     *
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/14325/DropStop.user.js
// @updateURL https://update.greasyfork.org/scripts/14325/DropStop.meta.js
// ==/UserScript==

function IgnoreDrop(evt){
  // allow drop for inputs and textareas
  if (evt.target.nodeName == "INPUT" || evt.target.nodeName == "TEXTAREA") return;
  // allow drop for contenteditable elements
  if (evt.target.getAttribute("contenteditable") == "true") return;
  // prevent default action and kill the event
  evt.preventDefault();
  evt.stopPropagation();
  return false;
}
document.body.addEventListener("drop", IgnoreDrop, true);
// Per https://opensourcehacker.com/2011/11/11/cancelling-html5-drag-and-drop-events-in-web-browsers/
document.body.addEventListener("dragover", IgnoreDrop, true);
document.body.addEventListener("dragenter", IgnoreDrop, true);