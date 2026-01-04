// ==UserScript==
// @name Checkvist Classic Red Style
// @namespace https://greasyfork.org/en/users/10118-drhouse
// @version 1.0
// @description original red colors stylesheet
// @author drhouse
// @license CC-BY-NC-SA-4.0
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/437417/Checkvist%20Classic%20Red%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/437417/Checkvist%20Classic%20Red%20Style.meta.js
// ==/UserScript==

(function() {
let css = `.selectedTask_focus, .selectedTask, .selectedFrame{
    color:white !important;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
