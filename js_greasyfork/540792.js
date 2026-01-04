// ==UserScript==
// @name MyHeritage: no DNA offer / notification
// @namespace github.com/openstyles/stylus
// @version 1.0.0
// @description Hides DNA offer banner and top-bar notifications.
// @author ciricuervo
// @grant GM_addStyle
// @run-at document-start
// @match *://*.myheritage.com/*
// @match *://*.myheritage.es/*
// @downloadURL https://update.greasyfork.org/scripts/540792/MyHeritage%3A%20no%20DNA%20offer%20%20notification.user.js
// @updateURL https://update.greasyfork.org/scripts/540792/MyHeritage%3A%20no%20DNA%20offer%20%20notification.meta.js
// ==/UserScript==

(function() {
let css = `

    div.special_offer_banner_container,
    div.notification_panel,
    div.notification_tooltip {
        display: none !important;
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
