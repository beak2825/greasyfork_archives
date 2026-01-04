// ==UserScript==
// @name skribbl.io original font
// @namespace https://greasyfork.org/en/users/795073-thewordwas
// @version 1
// @description Restores the original font, from before November 2022.
// @author TheWordWas
// @grant GM_addStyle
// @run-at document-start
// @match *://*.skribbl.io/*
// @downloadURL https://update.greasyfork.org/scripts/455016/skribblio%20original%20font.user.js
// @updateURL https://update.greasyfork.org/scripts/455016/skribblio%20original%20font.meta.js
// ==/UserScript==

(function() {
let css = `
#game-chat,
.player-info * {
    font-family: sans-serif!important;
 
}

#game-chat *,
.player-info * {
    line-height: 1.5em!important;
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
