// ==UserScript==
// @name       Newrow Anti Spy
// @match       *://smart.newrow.com/*
// @run-at      document-start
// @grant       none
// @version     1
// @author      Chase Davis & IceWreck
// @description Prevent newrow from seeing if you are on a different screen.

// @namespace https://greasyfork.org/users/815497
// @downloadURL https://update.greasyfork.org/scripts/435962/Newrow%20Anti%20Spy.user.js
// @updateURL https://update.greasyfork.org/scripts/435962/Newrow%20Anti%20Spy.meta.js
// ==/UserScript==

// This userscript blocks the page visibility API and to some extent the old blur/focus APIs.
var event_name

let events_to_block = [
  "visibilitychange",
  "webkitvisibilitychange",
  "mozvisibilitychange",
  "hasFocus",
  "blur",
  "focus",
  "mouseleave",
  "mouseout",
  "fullscreenchange",
  "mozfullscreenchange",
  "onpagehide",
  "webkithidden",
  "webkitfullscreenchange",
  "unload"
]

for (event_name of events_to_block) {
  document.addEventListener(event_name, function (event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
  }, true);
}

for (event_name of events_to_block) {
  window.addEventListener(event_name, function (event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
  }, true);
}

document.hasFocus = function () { return true; };
document.onvisibilitychange = null;
Object.defineProperty(document, "visibilityState", { value: "visible" });
Object.defineProperty(document, "hidden", { value: false });
Object.defineProperty(document, "mozHidden", { value: false });
Object.defineProperty(document, "webkitHidden", { value: false });
Object.defineProperty(document, "webkitVisibilityState", { value: "visible" });
