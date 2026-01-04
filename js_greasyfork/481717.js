// ==UserScript==
// @name imrannazar.com - Readability
// @namespace ?
// @version 20231207.13.04
// @description Improve readability of new ui on imrannazar.com
// @grant GM_addStyle
// @run-at document-start
// @match *://*.imrannazar.com/*
// @downloadURL https://update.greasyfork.org/scripts/481717/imrannazarcom%20-%20Readability.user.js
// @updateURL https://update.greasyfork.org/scripts/481717/imrannazarcom%20-%20Readability.meta.js
// ==/UserScript==

(function() {
let css = `
body {
    display: flex;
    flex-direction: column;
    align-items: center;   
}
main {
  max-width: 60rem;
  font-size: .75em;
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
