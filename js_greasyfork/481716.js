// ==UserScript==
// @name odmiana.net - Dark mode
// @namespace userstyles.world/user/griffi-gh
// @version 1.0
// @description Dark mode + ad removal for odmiana.net
// @author griffi-gh
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.odmiana.net/*
// @downloadURL https://update.greasyfork.org/scripts/481716/odmiananet%20-%20Dark%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/481716/odmiananet%20-%20Dark%20mode.meta.js
// ==/UserScript==

(function() {
let css = `
    body {
        --fbc-white: black !important;
        --fbc-primary-text: white !important;
        --fbc-secondary-text: #aaaaaa !important;
        background: #222222 !important;
        color: white !important;
    }

    p,h1,h2,h3,h4,h5,h6 {
        color: unset !important;
    }

    table,tbody {
        background: #333333 !important;
    }

    tr:hover {
        background: #444444 !important;
    }
    
    html [data-l="https://anomoto.pl"] {
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
