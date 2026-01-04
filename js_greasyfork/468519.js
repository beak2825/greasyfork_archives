// ==UserScript==
// @name        Simulating_focus 
// @match       *://*/*
// @run-at      document-start
// @grant       none
// @version     1.0
// @author      Multibot
// @description Simulating the focus of tabs and windows

// @namespace https://greasyfork.org/users/959062
// @downloadURL https://update.greasyfork.org/scripts/468519/Simulating_focus.user.js
// @updateURL https://update.greasyfork.org/scripts/468519/Simulating_focus.meta.js
// ==/UserScript==

// This userscript blocks the page visibility API and to some extent the old blur/focus APIs.

let events_to_block = [
  "visibilitychange",
  "webkitvisibilitychange",
  "mozvisibilitychange",
  "hasFocus",
  "blur",
  "focus",
  "mouseleave"
]

for (let event_name of events_to_block) {
  document.addEventListener(event_name, function (event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
  }, true);
}

for (let event_name of events_to_block) {
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
