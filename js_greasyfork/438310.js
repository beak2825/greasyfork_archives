// ==UserScript==
// @name Wide JIRA
// @namespace https://greasyfork.org/users/206706
// @version 0.0.2
// @description Widen your create issue box in JIRA
// @author Fishswing
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @include http://jira.*/*
// @include https://jira.*/*
// @downloadURL https://update.greasyfork.org/scripts/438310/Wide%20JIRA.user.js
// @updateURL https://update.greasyfork.org/scripts/438310/Wide%20JIRA.meta.js
// ==/UserScript==

(function() {
let css = `

.aui-dialog2-large {
    width: 80% !important;
    top: 3% !important;
    bottom: 3% !important;
}

.aui-dialog2-content {
    max-height: 100% !important;
}

.aui-page-focused-large .aui-page-panel {
    width: 80% !important;
}

.aui-page-focused-large .aui-page-header {
    width: 80% !important;
}

`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
