// ==UserScript==
// @name PDB DMs
// @namespace pdb-be-broke-lmao
// @version 0.1
// @description Show who sent a DM request on PDB.
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.personality-database.com/*
// @downloadURL https://update.greasyfork.org/scripts/468072/PDB%20DMs.user.js
// @updateURL https://update.greasyfork.org/scripts/468072/PDB%20DMs.meta.js
// ==/UserScript==

(function() {
let css = `
  label.username, div.description > label { color: white !important }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
