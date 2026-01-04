// ==UserScript==
// @name Power Platform Community - Reverse Reply Order ( oldest first )
// @namespace eliotcole Scripts
// @version 1.0
// @description This reverses the reply order for the replies to a question and pushes any answers on the screen to the top
// @author eliotcole
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.powerplatform.com/*
// @downloadURL https://update.greasyfork.org/scripts/522608/Power%20Platform%20Community%20-%20Reverse%20Reply%20Order%20%28%20oldest%20first%20%29.user.js
// @updateURL https://update.greasyfork.org/scripts/522608/Power%20Platform%20Community%20-%20Reverse%20Reply%20Order%20%28%20oldest%20first%20%29.meta.js
// ==/UserScript==

(function() {
let css = `
  ul#paginated-list {
    display: flex;
    flex-direction: column-reverse;
  }
  ul#paginated-list > li:has( * div.thread--answered ) {
    order: 1;
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
