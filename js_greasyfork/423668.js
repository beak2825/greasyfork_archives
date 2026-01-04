// ==UserScript==
// @name         CityInc - Dark Background
// @namespace    DQampire
// @version      1.0
// @description  With dark user extension you can't achieve the true dark mode cause of the background gradient. So i created a simple script that removes gradient and adds darker color to the background.
// @author       DQampire
// @grant        GM_addStyle
// @include http://cityinc.se/*
// @downloadURL https://update.greasyfork.org/scripts/423668/CityInc%20-%20Dark%20Background.user.js
// @updateURL https://update.greasyfork.org/scripts/423668/CityInc%20-%20Dark%20Background.meta.js
// ==/UserScript==

(function() {
let css = `
   html, body { background: #0a0a0a !important; }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();