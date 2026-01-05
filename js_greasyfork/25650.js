// ==UserScript==
// @name        Disable Confirmation Dialog When Leaving A Web Page
// @namespace   DisableConfirmationDialogWhenLeavingAWebPage
// @description Disable confirmation dialog when leaving a web page
// @license     GNU AGPLv3
// @author      jcunews
// @match       *://*/*
// @version     1.0.5
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/25650/Disable%20Confirmation%20Dialog%20When%20Leaving%20A%20Web%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/25650/Disable%20Confirmation%20Dialog%20When%20Leaving%20A%20Web%20Page.meta.js
// ==/UserScript==

(() => {
  var d = Object.getOwnPropertyDescriptor(window, "onbeforeunload");
  d.set = function(f) {
    return f;
  };
  Object.defineProperty(window, "onbeforeunload", d);
  d = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function(typ) {
    if (typ.toLowerCase() !== "beforeunload") return d.apply(this, arguments);
  };
})();
