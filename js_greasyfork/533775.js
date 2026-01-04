// ==UserScript==
// @name Dreamwidth - Manageable pagination divs
// @namespace https://greasyfork.org/users/3759
// @version 1.0
// @description Makes them smoller
// @license CC0
// @grant GM_addStyle
// @run-at document-start
// @include /^(?:^https?://[-\w]+\.dreamwidth\.org/.*)$/
// @downloadURL https://update.greasyfork.org/scripts/533775/Dreamwidth%20-%20Manageable%20pagination%20divs.user.js
// @updateURL https://update.greasyfork.org/scripts/533775/Dreamwidth%20-%20Manageable%20pagination%20divs.meta.js
// ==/UserScript==

(function() {
let css = `
.pagination {
    max-height: 200px;
    overflow: scroll;
}

ul.pages {
    width: 100% !important;
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
