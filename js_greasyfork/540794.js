// ==UserScript==
// @name MyHeritage: no search bar
// @namespace github.com/openstyles/stylus
// @version 1.0.0
// @description Removes the find-a-person bar along with the generations selector.
// @author ciricuervo
// @grant GM_addStyle
// @run-at document-start
// @match *://*.myheritage.com/*
// @match *://*.myheritage.es/*
// @downloadURL https://update.greasyfork.org/scripts/540794/MyHeritage%3A%20no%20search%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/540794/MyHeritage%3A%20no%20search%20bar.meta.js
// ==/UserScript==

(function() {
let css = `

    #ToolBarProximity, #FindAPersonParent {
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
