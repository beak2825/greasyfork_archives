// ==UserScript==
// @name CityU make Reg Course Button be Larger
// @namespace ckylin-style-bilibiliplayerblur
// @version 1.0.1
// @description Same as Name
// @author Tommy Ho
// @license GPLv3
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/445463/CityU%20make%20Reg%20Course%20Button%20be%20Larger.user.js
// @updateURL https://update.greasyfork.org/scripts/445463/CityU%20make%20Reg%20Course%20Button%20be%20Larger.meta.js
// ==/UserScript==

(function() {
let css = `input[name='REG_BTN'][value='Submit Changes'] {
    height: 400px;
    width: 700px;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
