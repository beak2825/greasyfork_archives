// ==UserScript==
// @name Linki GNU/Linux
// @namespace github.com/openstyles/stylus
// @version 1.0.1
// @description Podgląd linków przed najechaniem z pomocą CSS
// @author Me
// @grant GM_addStyle
// @run-at document-start
// @match https://forum.dobreprogramy.pl/t/*
// @downloadURL https://update.greasyfork.org/scripts/446684/Linki%20GNULinux.user.js
// @updateURL https://update.greasyfork.org/scripts/446684/Linki%20GNULinux.meta.js
// ==/UserScript==

(function() {
let css = `
article[data-post-id="3844212"] .contents a:before,
article[data-post-id="3997472"] .contents a:before {
    content: " (" attr(href) ") ";
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
