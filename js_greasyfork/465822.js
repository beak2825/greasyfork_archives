// ==UserScript==
// @name StackOverflow sticky votes
// @namespace https://greasyfork.org/users/1075775
// @version 0.0.1.20230509012311
// @description Makes the upvote/downvote buttons and vote count on StackOverflow and StackExchange sticky, so you don't have to scroll up to upvote a long answer.
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/465822/StackOverflow%20sticky%20votes.user.js
// @updateURL https://update.greasyfork.org/scripts/465822/StackOverflow%20sticky%20votes.meta.js
// ==/UserScript==

(function() {
let css = `#answers .votecell .js-voting-container,
#question .votecell .js-voting-container {
    position: sticky;
    top: 60px;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
