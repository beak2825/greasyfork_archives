// ==UserScript==
// @name YouTube - Hide Video Comments
// @namespace https://greasyfork.org/users/761164
// @version 2.0.1
// @description YouTube comments only exist to cause stress, so get rid of them.
// @author XerBlade
// @license GPL-3.0
// @grant GM_addStyle
// @run-at document-start
// @match https://www.youtube.com/watch*
// @downloadURL https://update.greasyfork.org/scripts/425221/YouTube%20-%20Hide%20Video%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/425221/YouTube%20-%20Hide%20Video%20Comments.meta.js
// ==/UserScript==

(function() {
let css = `
#comments, #comment-teaser {
    display: none;
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
