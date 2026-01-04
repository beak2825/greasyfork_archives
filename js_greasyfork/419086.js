// ==UserScript==
// @name Pxls Big Emoji
// @namespace Mikarific
// @version 1.0.2
// @description Big custom emoji for Pxls instances.
// @license unlicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/419086/Pxls%20Big%20Emoji.user.js
// @updateURL https://update.greasyfork.org/scripts/419086/Pxls%20Big%20Emoji.meta.js
// ==/UserScript==

(function() {
let css = `img.customEmoji {
    width: auto !important;
    height: 2em !important;
}
.content img.emoji {
    height: 2em !important;
    width: 2em !important;
    margin: 0 .05em 0 .1em;
    vertical-align: -.1em;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
