// ==UserScript==
// @name Dark Hacking Social
// @namespace https://greasyfork.org/en/users/322108-nullgemm
// @version 0.1.1
// @description Paints Raven's tuxedo black because the white ça fait mal aux yeux.
// @author nullgemm
// @license WTFPL
// @grant GM_addStyle
// @run-at document-start
// @match *://*.hacking-social.com/*
// @downloadURL https://update.greasyfork.org/scripts/400265/Dark%20Hacking%20Social.user.js
// @updateURL https://update.greasyfork.org/scripts/400265/Dark%20Hacking%20Social.meta.js
// ==/UserScript==

(function() {
let css = `
  body,
  .entry-content > article,
  .excerpt-content > article,
  span[style="color: #333399;"],
  span[style="color: #000000;"],
  span[style="color: #009900;"]
  {
    color: #eee !important;
  }

  .entry,
  .wc-comment-right,
  #comments
  {
    background: #222 !important;
  }

  .design-credit
  {
    background: #000 !important;
  }

  .wc-comment-label
  {
    box-shadow: none !important;
    background: #1e1e1e !important;
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
