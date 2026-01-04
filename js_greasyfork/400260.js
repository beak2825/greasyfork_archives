// ==UserScript==
// @name YouTube anti-caps
// @namespace https://greasyfork.org/en/users/322108-nullgemm
// @version 0.1.1
// @description Converts all the video titles to lowercase
// @author nullgemm
// @license WTFPL
// @grant GM_addStyle
// @run-at document-start
// @match *://*.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/400260/YouTube%20anti-caps.user.js
// @updateURL https://update.greasyfork.org/scripts/400260/YouTube%20anti-caps.meta.js
// ==/UserScript==

(function() {
let css = `
  .title, #video-title
  {
    text-transform: lowercase;
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
