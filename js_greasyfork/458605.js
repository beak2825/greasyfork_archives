// ==UserScript==
// @name Wikipedia Redesign Tweaks
// @namespace github.com/Brawl345
// @version 1.0.0
// @description A few tweaks for the Wikipedia Redesign
// @author Brawl (https://github.com/Brawl345)
// @license Unlicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.wikipedia.org/*
// @downloadURL https://update.greasyfork.org/scripts/458605/Wikipedia%20Redesign%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/458605/Wikipedia%20Redesign%20Tweaks.meta.js
// ==/UserScript==

(function() {
let css = `
    @media screen and (min-width: 1000px) {
        .vector-feature-page-tools-disabled .mw-page-container-inner {
            column-gap: 0px;
        }

        #vector-toc {
            background-color: #f8f9fa;
        }

        .vector-toc-pinned #vector-toc-pinned-container .vector-toc:after {
            background: none;
            background-image: none;
        }
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
