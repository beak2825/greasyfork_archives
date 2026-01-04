// ==UserScript==
// @name YouTube - Bring back colored thumbs up and down buttons and like bar
// @namespace https://greasyfork.org/users/4813
// @version 2021.09.21
// @description White/grayscale and stroke-only transparent buttons suck.
// @author Swyter
// @license CC-BY-SA 4.0
// @grant GM_addStyle
// @run-at document-start
// @match https://www.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/431505/YouTube%20-%20Bring%20back%20colored%20thumbs%20up%20and%20down%20buttons%20and%20like%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/431505/YouTube%20-%20Bring%20back%20colored%20thumbs%20up%20and%20down%20buttons%20and%20like%20bar.meta.js
// ==/UserScript==

(function() {
let css = `
    :root
    {
      --swy-blue-color: #2e93ff;
    }

    #info > #info-contents  #container ytd-toggle-button-renderer.style-default-active:first-of-type /* swy: only make blue the first/thumbs up */
    {
      color: var(--swy-blue-color) !important;
    }

    #like-bar.ytd-sentiment-bar-renderer
    {
      background-color: var(--swy-blue-color) !important;
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
