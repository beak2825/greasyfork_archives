// ==UserScript==
// @name niconico show full nicoru count
// @namespace github.com/rinsuki
// @version 1.0.0
// @description ニコるのカウントを略さず表示します
// @author rinsuki
// @grant GM_addStyle
// @run-at document-start
// @match https://www.nicovideo.jp/watch/*
// @downloadURL https://update.greasyfork.org/scripts/449074/niconico%20show%20full%20nicoru%20count.user.js
// @updateURL https://update.greasyfork.org/scripts/449074/niconico%20show%20full%20nicoru%20count.meta.js
// ==/UserScript==

(function() {
let css = `
    span.NicoruCell-count[data-nicoru-count]::before {
        content: attr(data-nicoru-count);
        padding-right: 10em;
    }
    .CommentPanelDataGrid-TableCell[data-name="nicoruCount"] {
        padding: 0 4px;
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
