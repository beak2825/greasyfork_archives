// ==UserScript==
// @name         Times new roman!!!
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  We love times new roman
// @author       Stowe Times New Roman Department
// @license   MIT
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480595/Times%20new%20roman%21%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/480595/Times%20new%20roman%21%21%21.meta.js
// ==/UserScript==

(function() {
let css = "";
css += `
*:not([class*="icon"]):not(i) {

    font-family: 'Times New Roman', Times !important;

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
