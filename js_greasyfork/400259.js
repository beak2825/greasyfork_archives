// ==UserScript==
// @name Twitter no-misclick
// @namespace https://greasyfork.org/en/users/322108-nullgemm
// @version 0.1.1
// @description Hides Explore, Bookmarks and List from the navigation menu.
// @author nullgemm
// @license WTFPL
// @grant GM_addStyle
// @run-at document-start
// @match *://*.twitter.com/*
// @downloadURL https://update.greasyfork.org/scripts/400259/Twitter%20no-misclick.user.js
// @updateURL https://update.greasyfork.org/scripts/400259/Twitter%20no-misclick.meta.js
// ==/UserScript==

(function() {
let css = `
  nav .css-4rbku5:nth-child(2),
  nav .css-4rbku5:nth-child(5),
  nav .css-4rbku5:nth-child(6)
  {
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
