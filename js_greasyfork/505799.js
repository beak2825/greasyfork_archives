// ==UserScript==
// @name Goatlings Profile Box Alignment
// @namespace luckydevil.nz
// @version 1.1
// @description Fixing those annoying gaps in the Goatlings pet profile boxes!
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match https://www.goatlings.com/pet/u/*
// @downloadURL https://update.greasyfork.org/scripts/505799/Goatlings%20Profile%20Box%20Alignment.user.js
// @updateURL https://update.greasyfork.org/scripts/505799/Goatlings%20Profile%20Box%20Alignment.meta.js
// ==/UserScript==

(function() {
let css = `
      .pet-profile-box
    {
        height: 251.2px;
    }
    
    .pet-profile-box-two
    {
        width: 524.4px;
        height: 251.2px;
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
