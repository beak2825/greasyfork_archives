// ==UserScript==
// @name Amazon Prime Gaming - Fade out non-GOG or Epic Games freebies
// @namespace https://greasyfork.org/en/users/4813
// @version 2023.11.09.01
// @description Make the interesting freebies easier to find between all the Amazon Games App cruft.
// @author Swyter
// @license CC-BY-SA 4.0
// @grant GM_addStyle
// @run-at document-start
// @match *://*.gaming.amazon.com/*
// @downloadURL https://update.greasyfork.org/scripts/479348/Amazon%20Prime%20Gaming%20-%20Fade%20out%20non-GOG%20or%20Epic%20Games%20freebies.user.js
// @updateURL https://update.greasyfork.org/scripts/479348/Amazon%20Prime%20Gaming%20-%20Fade%20out%20non-GOG%20or%20Epic%20Games%20freebies.meta.js
// ==/UserScript==

(function() {
let css = `       
        /* swy: fade out any link leading to a AGA-based game */
        div.tw-block div.item-card__action > a[data-a-target='learn-more-card'][href*='aga/']
        {
            opacity: .3;
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
