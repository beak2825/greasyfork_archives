// ==UserScript==
// @name Dreadcast Forum taille police
// @namespace dreadcast-forum
// @version 1.0
// @description Augmente la taille de la police dans les posts forum + derniers sujets
// @grant GM_addStyle
// @run-at document-start
// @match https://www.dreadcast.net/Forum/*
// @downloadURL https://update.greasyfork.org/scripts/531404/Dreadcast%20Forum%20taille%20police.user.js
// @updateURL https://update.greasyfork.org/scripts/531404/Dreadcast%20Forum%20taille%20police.meta.js
// ==/UserScript==

(function() {
let css = `
    /* Target only forum messages */
    div.zone_display_text {
        font-size: 18px !important; /* Increase font size */
    }
    
    /* Target the latest topics list */
    div#list_derniers_sujets {
        font-size: 14px !important; /* Increase font size */
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
