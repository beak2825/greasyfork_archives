// ==UserScript==
// @name Dark Redash
// @namespace djshigel
// @version 0.3
// @description Darken Redash
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/528885/Dark%20Redash.user.js
// @updateURL https://update.greasyfork.org/scripts/528885/Dark%20Redash.meta.js
// ==/UserScript==

(function() {
let css = `@media (prefers-color-scheme: dark) {
    html {
        filter: invert() hue-rotate(180deg) contrast(0.8);
    }

    .application-layout-side-menu, 
    :not(.application-layout-side-menu) iframe, 
    :not(.application-layout-side-menu) img, 
    :not(.application-layout-side-menu) svg:has(image) {
        filter: invert() hue-rotate(180deg) contrast(1.2);
    }

    .application-layout-side-menu .ant-menu {
        background-color: #0f1314;
    }
    
    .application-layout-side-menu .ant-menu img {
        filter: none;
    }
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
