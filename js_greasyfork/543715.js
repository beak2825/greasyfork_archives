// ==UserScript==
// @name Internet Roadtrip - Selectable Location Text
// @namespace me.netux.site/user-styles/internet-roadtrip/selectable-location-text
// @version 1.0.0
// @description Make the location text on the green sign of neal.fun/internet-roadtrip selectable
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match https://neal.fun/internet-roadtrip/*
// @downloadURL https://update.greasyfork.org/scripts/543715/Internet%20Roadtrip%20-%20Selectable%20Location%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/543715/Internet%20Roadtrip%20-%20Selectable%20Location%20Text.meta.js
// ==/UserScript==

(function() {
let css = `
  .location::after {
    pointer-events: none;
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
