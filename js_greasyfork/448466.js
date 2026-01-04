// ==UserScript==
// @name Astral Codex Ten Background Colour Fix
// @namespace astralcodexten.substack.com
// @version 0.1.6
// @description Removes light blue background colour from Astral Codex Ten.
// @author Korakys
// @license CC0
// @grant GM_addStyle
// @run-at document-start
// @match *://*.astralcodexten.substack.com/*
// @downloadURL https://update.greasyfork.org/scripts/448466/Astral%20Codex%20Ten%20Background%20Colour%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/448466/Astral%20Codex%20Ten%20Background%20Colour%20Fix.meta.js
// ==/UserScript==

(function() {
let css = `
html {
  --web_bg_color: initial !important;
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
