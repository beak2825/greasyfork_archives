// ==UserScript==
// @name tezeusz.pl on XP
// @namespace github.com/openstyles/stylus
// @version 1.0.18
// @description Reset opacity and scroll only!
// @author krystian3w
// @license CC BY 4.0 https://creativecommons.org/licenses/by/4.0/
// @grant GM_addStyle
// @run-at document-start
// @match *://*.tezeusz.pl/*
// @downloadURL https://update.greasyfork.org/scripts/441423/tezeuszpl%20on%20XP.user.js
// @updateURL https://update.greasyfork.org/scripts/441423/tezeuszpl%20on%20XP.meta.js
// ==/UserScript==

(function() {
let css = `
    body, html { overflow: hidden visible  !important }
    body, header, main, footer { opacity: 1 !important }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
