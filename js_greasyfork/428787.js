// ==UserScript==
// @name Scryfall Darkmode
// @namespace scryfall.com
// @version 2.0.1
// @description Black background for Scryfall.
// @author Korakys
// @license CC0
// @grant GM_addStyle
// @run-at document-start
// @match *://*.scryfall.com/*
// @downloadURL https://update.greasyfork.org/scripts/428787/Scryfall%20Darkmode.user.js
// @updateURL https://update.greasyfork.org/scripts/428787/Scryfall%20Darkmode.meta.js
// ==/UserScript==

(function() {
let css = `

#main, #footer, .search-controls, .search-controls-mobile, .search-info, .card-profile, .rulings, .card-text, .homepage, .form-layout, .advanced-search-submit-bottom {
   background: #000;
   background-color: #000;
}
.rulings a[href], .search-controls-display-options > label, .search-info a[href], .search-info strong {
   filter: brightness(2);
}
.card-text a[href] {
   color: #c688ff;
}
.rulings, .card-text, .checklist td > a, .checklist td > span, .form-layout label {
   color: #eee;
}
.search-info {
   color: #888;
}
.footer-legal {
   color: #666;
}
#footer {
   border-top: 1px dashed #CDCDCD;
}
.advanced-search-submit-bottom {
   border-top: 1px solid #902bd8 !important;
}
/* Pesky non-standard symbols, like paws, energy, etc */
.card-symbol-P, .card-symbol-E, .card-symbol-TK {
   filter: invert(1);
}
.form-row-label svg, .advanced-search-subjoiner {
   filter: brightness(2);
}
.button-n, .prints-table, .reference-jump, .reference-block {
   background-color: #bbb
}

img.card {
   border: 1px solid #666;
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
