// ==UserScript==
// @name AMQ: Video as Background (Requires Firefox)
// @namespace github.com/openstyles/stylus
// @version 1.0.0
// @description A new userstyle
// @author Me
// @grant GM_addStyle
// @run-at document-start
// @match *://*.animemusicquiz.com/*
// @downloadURL https://update.greasyfork.org/scripts/458999/AMQ%3A%20Video%20as%20Background%20%28Requires%20Firefox%29.user.js
// @updateURL https://update.greasyfork.org/scripts/458999/AMQ%3A%20Video%20as%20Background%20%28Requires%20Firefox%29.meta.js
// ==/UserScript==

(function() {
let css = `
    #gameChatPage > .col-xs-9 {
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center bottom !important;
        background-image: -moz-element(#qpVideoContainer) !important;
        position: relative;
    }
    #gameChatPage > .col-xs-9::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        backdrop-filter: blur(8px) !important;
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
