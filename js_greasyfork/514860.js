// ==UserScript==
// @name Hide Trakt VIP Button
// @namespace Floyed-TraktVipButton
// @version 2024-11-01
// @description Hides the Trakt Get VIP Button
// @license MIT
// @author Floyed
// @grant GM_addStyle
// @run-at document-start
// @include http://trakt.tv/*
// @include https://trakt.tv/*
// @include http://*.trakt.tv/*
// @include https://*.trakt.tv/*
// @downloadURL https://update.greasyfork.org/scripts/514860/Hide%20Trakt%20VIP%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/514860/Hide%20Trakt%20VIP%20Button.meta.js
// ==/UserScript==

(function() {
let css = `
    .btn-vip {
        display: none !important
    }

    #om1gYCfRiN-LD3xSETSnk-Ba2KT6YF2O-wrapper {
        display: none !important
    }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
