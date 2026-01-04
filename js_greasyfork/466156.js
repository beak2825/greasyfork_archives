// ==UserScript==
// @name        Ad Remover Loader.to
// @namespace   Violentmonkey Scripts
// @description Removes any ad banners not removed by ad blockers on the video downloading site loader.to and correctly resizes the thumbnail preview.
// @icon        https://www.google.com/s2/favicons?sz=64&domain=loader.to
// @author      Tschipcraft
// @version     1.1
// @license     MIT
// @match       *://*.loader.to/*
// @downloadURL https://update.greasyfork.org/scripts/466156/Ad%20Remover%20Loaderto.user.js
// @updateURL https://update.greasyfork.org/scripts/466156/Ad%20Remover%20Loaderto.meta.js
// ==/UserScript==

const cssText = `
  .text-center {
    display: none;
  }
  #ff_addon {
    display: none !important;
  }
  #safari_addon {
    display: none !important;
  }
  #edge_addon {
    display: none !important;
  }
  #chrome_addon {
    display: none !important;
  }
  .object-cover {
    object-fit: contain;
    background: black;
  }
`;

// Apply CSS
const style = document.createElement("style");
style.type = "text/css";
style.innerHTML = cssText;
document.head.appendChild(style);
