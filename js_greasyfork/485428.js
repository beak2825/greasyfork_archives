// ==UserScript==
// @name Firepoker Cheat
// @namespace https://santus.dev/
// @description Reveal Points for Firepoker
// @author Krisantus Wanandi (https://github.com/krisantuswanandi)
// @match https://firepoker.app/**
// @icon https://www.google.com/s2/favicons?sz=64&domain=firepoker.app
// @run-at document-body
// @license MIT
// @supportURL https://github.com/krisantuswanandi/firepoker-cheat
// @version 0.0.3
// @downloadURL https://update.greasyfork.org/scripts/485428/Firepoker%20Cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/485428/Firepoker%20Cheat.meta.js
// ==/UserScript==

(function () {

"use strict";

// src/style.ts
function injectStyle() {
  const style = document.createElement("style");
  style.innerHTML = `
.cheat-enabled {
  .card.ng-binding {
    display: block !important
  }
  .card.card-facedown {
    display: none !important
  }
}`;
  document.head.appendChild(style);
}

// src/index.ts
var isFocusOnInput = function(event) {
  return INPUTS.includes(event.target.getAttribute("ng-model") || "");
};
var isShortcut = function(event) {
  return event.key.toLowerCase() === SHORTCUT_KEY;
};
var handleShortcut = function(event) {
  if (isFocusOnInput(event) || !isShortcut(event))
    return;
  if (event.type === "keydown") {
    document.body.classList.add(CLASS_NAME);
  } else if (event.type === "keyup") {
    document.body.classList.remove(CLASS_NAME);
  }
};
var init = function() {
  injectStyle();
  window.addEventListener("keydown", handleShortcut);
  window.addEventListener("keyup", handleShortcut);
};
var INPUTS = ["game.estimate.title", "game.estimate.notes"];
var SHORTCUT_KEY = "x";
var CLASS_NAME = "cheat-enabled";
init();

})();