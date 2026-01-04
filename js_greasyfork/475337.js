// ==UserScript==
// @name v2ex highlight links
// @namespace v2ex.com
// @version 0.1.0
// @description This is your new file, start writing code
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/475337/v2ex%20highlight%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/475337/v2ex%20highlight%20links.meta.js
// ==/UserScript==

(function() {
let css = `.main-wrapper .my-box.post-wrapper .html-wrapper :is(.cell,.subtle),
.reply_content a:not(a[href^='/member']) {
    --link-color: #3391ff;
    --darkreader-text--link-color: #3391ff;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
