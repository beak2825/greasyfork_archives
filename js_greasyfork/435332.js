// ==UserScript==
// @name [Paper] Google Docs Dark Mode
// @namespace theusaf.org
// @version 1.5.0
// @description Google Docs Dark Mode - Paper
// @author theusaf
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match https://docs.google.com/document*
// @downloadURL https://update.greasyfork.org/scripts/435332/%5BPaper%5D%20Google%20Docs%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/435332/%5BPaper%5D%20Google%20Docs%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
let css = `
  :root {
    --gray-50: #dddddd;
    --gray-100: #bdbdbd;
    --gray-150: #646464;
    --gray-200: #555555;
    --gray-300: #444444;
    --gray-400: #313131;
    --gray-500: #1C1C1C;
    --gray-600: #171717;
    --white-100: #f5f5f5;
    --white-200: #ededed;
    --white-300: #e3e3e3;
  }

  /* background/text */
  .kix-zoomdocumentplugin-outer,
  .kix-appview-editor > div {
    background-color: var(--gray-100) !important;
    filter: invert(1);
  }

  .kix-appview-clipped-ui-elements-container {
    filter: invert(1);
  }

  /* images */
  .kix-lineview-text-block image,
  .kix-lineview-text-block img,
  #link-bubble-thumbnail-image,
  .docs-link-bubble-favicon img {
    filter: invert(1);
  }

  /* grammarly support */
  [data-grammarly-shadow-root="true"] {
    mix-blend-mode: normal !important;
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
