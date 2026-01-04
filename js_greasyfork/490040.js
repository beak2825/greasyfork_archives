// ==UserScript==
// @name COMPACT
// @namespace .
// @version 1
// @description .
// @author
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @include https://stumblechat.com/room/*
// @downloadURL https://update.greasyfork.org/scripts/490040/COMPACT.user.js
// @updateURL https://update.greasyfork.org/scripts/490040/COMPACT.meta.js
// ==/UserScript==

(function() {
let css = `
    .message .nickname ~ .content {
        display: inline-block;
        top: -7px;
        position: relative;
        margin-left: 2px;
        margin-right: 1em;
    }
    .content + .content {
        display: inline-block!important;
        margin-right: 1em;
    }
    .message .nickname ~ .content span {
        line-height: 1.5em;
    }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
