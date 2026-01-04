// ==UserScript==
// @name Hacker News Colorful Indent
// @namespace RoCry
// @version 0.0.4
// @description Add minimal design of indent to Hacker News to make it more readable. Fork from https://greasyfork.org/en/scripts/524059-hacker-news-comment-indentation-colours/code
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.ycombinator.com/*
// @downloadURL https://update.greasyfork.org/scripts/526072/Hacker%20News%20Colorful%20Indent.user.js
// @updateURL https://update.greasyfork.org/scripts/526072/Hacker%20News%20Colorful%20Indent.meta.js
// ==/UserScript==

(function() {
let css = `
  :root {
    --indent-width: 2px;
    --indent-alpha: 0.4;
  }

  .ind {
    border-right: solid var(--indent-width) rgba(149, 165, 166, var(--indent-alpha));
  }

  .ind[indent="0"] {
    border-right: solid var(--indent-width) rgba(34, 139, 230, var(--indent-alpha));
  }

  .ind[indent="1"] {
    border-right: solid var(--indent-width) rgba(77, 171, 247, var(--indent-alpha));
  }

  .ind[indent="2"] {
    border-right: solid var(--indent-width) rgba(21, 170, 191, var(--indent-alpha));
  }

  .ind[indent="3"] {
    border-right: solid var(--indent-width) rgba(64, 192, 87, var(--indent-alpha));
  }

  .ind[indent="4"] {
    border-right: solid var(--indent-width) rgba(250, 176, 5, var(--indent-alpha));
  }

  .ind[indent="5"] {
    border-right: solid var(--indent-width) rgba(253, 126, 20, var(--indent-alpha));
  }

  .ind[indent="6"] {
    border-right: solid var(--indent-width) rgba(230, 73, 128, var(--indent-alpha));
  }

  .ind[indent="7"] {
    border-right: solid var(--indent-width) rgba(190, 75, 219, var(--indent-alpha));
  }

  .ind[indent="8"] {
    border-right: solid var(--indent-width) rgba(121, 80, 242, var(--indent-alpha));
  }

  .ind[indent="9"] {
    border-right: solid var(--indent-width) rgba(76, 110, 245, var(--indent-alpha));
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
