// ==UserScript==
// @name MyHeritage: no gray balloons
// @namespace github.com/openstyles/stylus
// @version 1.0.0
// @description Removes gray ridge icon on top of person profiles.
// @author ciricuervo
// @grant GM_addStyle
// @run-at document-start
// @match *://*.myheritage.com/*
// @match *://*.myheritage.es/*
// @downloadURL https://update.greasyfork.org/scripts/540793/MyHeritage%3A%20no%20gray%20balloons.user.js
// @updateURL https://update.greasyfork.org/scripts/540793/MyHeritage%3A%20no%20gray%20balloons.meta.js
// ==/UserScript==

(function() {
let css = `
    
    g.ridgeIcon {
        display: none;
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
