// ==UserScript==
// @name GitHub - Don't wrap code lines
// @namespace https://greasyfork.org/users/4813
// @version 2023.01.10
// @description Don't wrap code lines
// @author Swyter, based on snippets by @gusutabopb on GitHub
// @license CC-BY-SA 4.0
// @grant GM_addStyle
// @run-at document-start
// @match *://*.github.com/*
// @downloadURL https://update.greasyfork.org/scripts/457978/GitHub%20-%20Don%27t%20wrap%20code%20lines.user.js
// @updateURL https://update.greasyfork.org/scripts/457978/GitHub%20-%20Don%27t%20wrap%20code%20lines.meta.js
// ==/UserScript==

(function() {
let css = `
    body .gist .blob-code-inner {
      white-space: pre ;
    }
    /* No \`.gist\` */
    body .blob-code-inner {
      white-space: pre;
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
