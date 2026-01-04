// ==UserScript==
// @name YouTube Remove Ambient
// @namespace https://greasyfork.org/users/1212309
// @version 1.0
// @description Removes ambient mode around video player on YouTube.
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/479205/YouTube%20Remove%20Ambient.user.js
// @updateURL https://update.greasyfork.org/scripts/479205/YouTube%20Remove%20Ambient.meta.js
// ==/UserScript==

(function() {
let css = `#cinematics.ytd-watch-flexy {
  display: none !important;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
