// ==UserScript==
// @name        Disable Site Restriction On Page Operations
// @namespace   https://greasyfork.org/en/users/85671-jcunews
// @version     1.1.5
// @license     AGPLv3
// @author      jcunews
// @description Disable site restrictions which prevent users on performing clipboard operations, text selection, page printing (experimental), and opening the Right-Click context menu. To open the Right-Click context menu use SHIFT+RightClick (the default; configurable in the script code).
// @match       *://*/*
// @inject-into page
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/390710/Disable%20Site%20Restriction%20On%20Page%20Operations.user.js
// @updateURL https://update.greasyfork.org/scripts/390710/Disable%20Site%20Restriction%20On%20Page%20Operations.meta.js
// ==/UserScript==

(() => {
  //=== CONFIGURATION BEGIN ===

  //Setting for Right-Click. At least either SHIFT or CTRL should be set to true.
  let useShift = true;
  let useCtrl  = false;

  //=== CONFIGURATION END ===

  if (document.contentType !== "text/html") return;
  let epd = Event.prototype.preventDefault;
  Event.prototype.preventDefault = function() {
    let a;
    switch (this.type) {
      case "cut":
      case "copy":
      case "selectstart":
        return;
      case "paste":
        if (a = document.activeElement) {
          while (a && a.classList && !a.classList.contains("CodeMirror")) a = a.parentNode;
          if (a) break;
        }
        return;
      case "contextmenu":
        if ((this.shiftKey === useShift) && (this.ctrlKey === useCtrl)) return;
    }
    return epd.apply(this, arguments);
  };
  var to = {createHTML: s => s}, tp = window.trustedTypes?.createPolicy ? trustedTypes.createPolicy("", to) : to, html = s => tp.createHTML(s);
  addEventListener("load", () => {
    document.documentElement.appendChild(document.createElement("STYLE")).innerHTML = html(`
@media print {
  html, body { opacity: 1 !important; visibility: visible !important }
  html { display: ${getComputedStyle(document.documentElement).display} !important }
  body { display: ${getComputedStyle(document.body).display} !important }
}
* {
  user-select: auto !important; -moz-user-select: auto !important; -webkit-user-select: auto !important; -ms-user-select: auto !important;
}
`);
  });
})();
