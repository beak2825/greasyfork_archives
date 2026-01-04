// ==UserScript==
// @name Test encoding issue
// @namespace http://greasyfork.local/users/1
// @version 0.0.1.20231104203640
// @description https://github.com/JasonBarnabe/greasyfork/issues/1174
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/479047/Test%20encoding%20issue.user.js
// @updateURL https://update.greasyfork.org/scripts/479047/Test%20encoding%20issue.meta.js
// ==/UserScript==

(function() {
let css = `nav .with-submenu>a:after {
    content: " ▾"
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
