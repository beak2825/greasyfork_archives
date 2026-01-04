// ==UserScript==
// @name Misc Tweaks for Todoist
// @namespace http://github.com/exterrestris
// @version 0.1.0
// @description Assorted tweaks for Todoist
// @grant GM_addStyle
// @run-at document-start
// @match *://*.todoist.com/*
// @downloadURL https://update.greasyfork.org/scripts/423432/Misc%20Tweaks%20for%20Todoist.user.js
// @updateURL https://update.greasyfork.org/scripts/423432/Misc%20Tweaks%20for%20Todoist.meta.js
// ==/UserScript==

(function() {
let css = `@namespace url(http://www.w3.org/1999/xhtml);

  * {
    scrollbar-width: thin;
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
