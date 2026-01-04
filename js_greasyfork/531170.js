// ==UserScript==
// @name Discord (web) - Remove top bar in the new 2025 UI refresh
// @namespace https://greasyfork.org/en/users/4813
// @version 2025.03.28
// @description The bar is pretty useless and takes a ton of vertical space.
// @author Swyter
// @license CC-BY-SA 4.0
// @grant GM_addStyle
// @run-at document-start
// @match *://*.discord.com/*
// @downloadURL https://update.greasyfork.org/scripts/531170/Discord%20%28web%29%20-%20Remove%20top%20bar%20in%20the%20new%202025%20UI%20refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/531170/Discord%20%28web%29%20-%20Remove%20top%20bar%20in%20the%20new%202025%20UI%20refresh.meta.js
// ==/UserScript==

(function() {
let css = `
    .visual-refresh {
        /* swy: change the CSS variable so that the rest of the layout that goes below complies :) */
        --custom-app-top-bar-height: 0px !important;
    
        /* swy: hide the top bar contents, otherwise some icons bleed through */
        div[class^='container_'] > div[class^='base_'] > div[class^='bar_'] {
            display: none !important;
        }
    
        /* swy: restore the top padding for the sidebar server icon list (so that the Direct Messages button doesn't look weird) */
        div[class^='sidebar_'] > nav[class^='wrapper_'] > ul[class^='tree_'] > div[class^='itemsContainer_'] > div[class^='stack_'] {
            padding-top: 12px !important; /* swy: 12px is the original value */
        }
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
