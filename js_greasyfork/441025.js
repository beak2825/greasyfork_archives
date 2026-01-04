// ==UserScript==
// @name Return Old Pastebin
// @namespace -
// @version 0.1
// @description Delete Ukraine&Russia poster, back old logo
// @author NotYou
// @license GPL-3.0-or-later
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/441025/Return%20Old%20Pastebin.user.js
// @updateURL https://update.greasyfork.org/scripts/441025/Return%20Old%20Pastebin.meta.js
// ==/UserScript==

(function() {
let css = `.header__logo {
    background: rgba(0, 0, 0, 0) url("https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdnp1.stackassets.com%2Ff01c78f72819a8d6e44eda0d516d47bbeda29c0b%2Fstore%2F89a5d242f98e723ddb55bfcbd3b975161aa564c4ef3e6f65a4ba14cf3ae5%2F16172fd75c7d67e51c03f4dfa01bb0a1b89bad2f_logo_footer.png&f=1&nofb=1") no-repeat scroll -14px 8px / 80px;
}

[src="/themes/pastebin/img/no_war_ukraine.jpeg"] {
    display: none !important;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
