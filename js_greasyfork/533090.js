// ==UserScript==
// @name Remove Old Reddit Notifications Badge
// @namespace RORNB
// @version 0.2
// @description Removes the ugly new notifications badge from old Reddit.
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/533090/Remove%20Old%20Reddit%20Notifications%20Badge.user.js
// @updateURL https://update.greasyfork.org/scripts/533090/Remove%20Old%20Reddit%20Notifications%20Badge.meta.js
// ==/UserScript==

(function() {
let css = `#notifications,
#notifications + span,
#notifications + a.badge-count,
#notifications + a.badge-count + span {
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
