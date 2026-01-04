// ==UserScript==
// @name PSXHAX Hide Annoying pop up
// @namespace https://greasyfork.org/users/1291245
// @version 0.1.1
// @description Hiding annoying pop-up 'Please allow ads on our site' on PSXHAX
// @author funkie
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/493077/PSXHAX%20Hide%20Annoying%20pop%20up.user.js
// @updateURL https://update.greasyfork.org/scripts/493077/PSXHAX%20Hide%20Annoying%20pop%20up.meta.js
// ==/UserScript==

(function() {
let css = `body > div.fc-ab-root {
   display:none !important;
}
/* ==UserStyle==`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
