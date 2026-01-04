// ==UserScript==
// @name Hacker News - Antisocial
// @namespace https://greasyfork.org/en/users/710405-ajhall
// @version 1.0.0
// @description Remove social features such as upvotes and comment links from the main page of Hacker News
// @author ajhall
// @grant GM_addStyle
// @run-at document-start
// @match *://*.news.ycombinator.com/*
// @downloadURL https://update.greasyfork.org/scripts/417082/Hacker%20News%20-%20Antisocial.user.js
// @updateURL https://update.greasyfork.org/scripts/417082/Hacker%20News%20-%20Antisocial.meta.js
// ==/UserScript==

(function() {
let css = `
  #hnmain td.subtext,
  #hnmain td.title + td,
  a[href="newcomments"],
  a[href="ask"] {
    display: none;
  }

  #hnmain td.title {
    padding-right: 10px;
    padding-bottom: 3px;
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
