// ==UserScript==
// @name         houzz.com 2022
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Allows riht-clicking and downloading of images.
// @author       Mr. Wonderful
// @match        *://www.houzz.com/*
// @icon         https://www.houzz.com/favicon/favicon.ico
// @grant        none
// @namespace https://greasyfork.org/users/981320
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454540/houzzcom%202022.user.js
// @updateURL https://update.greasyfork.org/scripts/454540/houzzcom%202022.meta.js
// ==/UserScript==

// Ref https://stackoverflow.com/a/57065599

// Functions
function enableContextMenu(aggressive = false) {
void(document.ondragstart=null);
void(document.onselectstart=null);
void(document.onclick=null);
void(document.onmousedown=null);
void(document.onmouseup=null);
void(document.body.oncontextmenu=null);
enableRightClickLight(document);
if (aggressive) {
  enableRightClick(document);
  removeContextMenuOnAll("body");
  removeContextMenuOnAll("img");
  removeContextMenuOnAll("td");
  } }

function removeContextMenuOnAll(tagName) {
var elements = document.getElementsByTagName(tagName);
  for (var i = 0; i < elements.length; i++) {
    enableRightClick(elements[i]);
  }
}

function enableRightClickLight(el) {
  el || (el = document);
  el.addEventListener("contextmenu", bringBackDefault, true);
}

function enableRightClick(el) {
  el || (el = document);
  el.addEventListener("contextmenu", bringBackDefault, true);
  el.addEventListener("dragstart", bringBackDefault, true);
  el.addEventListener("selectstart", bringBackDefault, true);
  el.addEventListener("click", bringBackDefault, true);
  el.addEventListener("mousedown", bringBackDefault, true);
  el.addEventListener("mouseup", bringBackDefault, true);
}

function restoreRightClick(el) {
  el || (el = document);
  el.removeEventListener("contextmenu", bringBackDefault, true);
  el.removeEventListener("dragstart", bringBackDefault, true);
  el.removeEventListener("selectstart", bringBackDefault, true);
  el.removeEventListener("click", bringBackDefault, true);
  el.removeEventListener("mousedown", bringBackDefault, true);
  el.removeEventListener("mouseup", bringBackDefault, true);
}

function bringBackDefault(event) {
  event.returnValue = true;
  (typeof event.stopPropagation === 'function') &&
  event.stopPropagation();
  (typeof event.cancelBubble === 'function') &&
  event.cancelBubble();
}

function addCSS(styles) {
  var styleSheet = document.createElement("style")
  styleSheet.innerText = styles
  document.head.appendChild(styleSheet)
}

// Force-allow right-clicks
enableContextMenu();

// Remove image overlay
addCSS(`.hz-color-picker__markers { display: none !important; }`);