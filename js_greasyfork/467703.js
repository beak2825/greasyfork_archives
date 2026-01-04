// ==UserScript==
// @name Non-LGBT MDN
// @namespace -
// @version 1.0.0
// @description color everything to default colors as it was back before. (basically removes lgbt s***)
// @author NotYou
// @license GPL-3.0-or-later
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/467703/Non-LGBT%20MDN.user.js
// @updateURL https://update.greasyfork.org/scripts/467703/Non-LGBT%20MDN.meta.js
// ==/UserScript==

(function() {
let css = `.light body {
    --pride-0: var(--mdn-color-black) !important;
    --pride-1: var(--mdn-color-black) !important;
    --pride-2: var(--mdn-color-black) !important;
    --pride-3: var(--mdn-color-black) !important;
    --pride-4: var(--mdn-color-black) !important;
    --pride-5: var(--mdn-color-black) !important;
}

.dark body {
    --pride-0: var(--mdn-color-white) !important;
    --pride-1: var(--mdn-color-white) !important;
    --pride-2: var(--mdn-color-white) !important;
    --pride-3: var(--mdn-color-white) !important;
    --pride-4: var(--mdn-color-white) !important;
    --pride-5: var(--mdn-color-white) !important;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
