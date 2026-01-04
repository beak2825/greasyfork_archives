// ==UserScript==
// @name Misskey.io Deck Popup Expander
// @namespace djshigel
// @version 0.2
// @description Expand popup window on right of Misskey deck
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/529256/Misskeyio%20Deck%20Popup%20Expander.user.js
// @updateURL https://update.greasyfork.org/scripts/529256/Misskeyio%20Deck%20Popup%20Expander.meta.js
// ==/UserScript==

(function() {
let css = `#misskey_app > div > div:has(div[data-sticky-container-header-height]):has(.ti-minimize) {
    width: 780px !important;
    height: 100% !important;
    top: 0px !important;
    left: calc(100% - 780px) !important;
}

#misskey_app > div > div:has(div[data-sticky-container-header-height]):not(:has(.ti-minimize)):not(:has(.ti-picture-in-picture)) {
    width: 350px !important;
    left: calc(100% - 350px) !important;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
