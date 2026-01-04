// ==UserScript==
// @name Widen Kitsu Feed
// @namespace https://greasyfork.org/users/703350
// @version 1.0.0
// @description Widen Kitsu Feed on Desktop
// @author Reina
// @supportURL https://kitsu.io/users/Reinachan
// @license unlicensed
// @grant GM_addStyle
// @run-at document-start
// @match *://*.kitsu.io/*
// @downloadURL https://update.greasyfork.org/scripts/422600/Widen%20Kitsu%20Feed.user.js
// @updateURL https://update.greasyfork.org/scripts/422600/Widen%20Kitsu%20Feed.meta.js
// ==/UserScript==

(function() {
let css = `
body {
  overflow-x: clip;
}

.row.global-row {
  margin-left: -40px;
  margin-right: -40px;
}

.feed-container .feed-stream.col-md {
  max-width: 1000px;
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
