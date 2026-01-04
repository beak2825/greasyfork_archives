// ==UserScript==
// @name MyHeritage: no country flags
// @namespace github.com/openstyles/stylus
// @version 1.0.0
// @description Removes the country flag icon on top of person profiles.
// @author ciricuervo
// @grant GM_addStyle
// @run-at document-start
// @match *://*.myheritage.com/*
// @match *://*.myheritage.es/*
// @downloadURL https://update.greasyfork.org/scripts/540797/MyHeritage%3A%20no%20country%20flags.user.js
// @updateURL https://update.greasyfork.org/scripts/540797/MyHeritage%3A%20no%20country%20flags.meta.js
// ==/UserScript==

(function() {
let css = `

    g > image.country-flag {
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
