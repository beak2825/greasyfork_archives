// ==UserScript==
// @name Don't Be A Hu
// @namespace im.outv.dont-be-a-hu
// @version 1.0.0
// @description Improve Zhihu UI
// @author Outvi V (github.com/outloudvi)
// @license DBAD (https://github.com/philsturgeon/dbad)
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/417150/Don%27t%20Be%20A%20Hu.user.js
// @updateURL https://update.greasyfork.org/scripts/417150/Don%27t%20Be%20A%20Hu.meta.js
// ==/UserScript==

(function() {
let css = `html {
    overflow: auto !important;
}

.Modal-wrapper.Modal-enter-done {
    display: none;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
