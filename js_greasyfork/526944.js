// ==UserScript==
// @name TheOnion.com – Dark [Ath]
// @namespace athari
// @version 1.0.0
// @description Dark theme for TheOnion.com.
// @author Athari (https://github.com/Athari)
// @homepageURL https://github.com/Athari/AthariUserCSS
// @supportURL https://github.com/Athari/AthariUserCSS/issues
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.theonion.com/*
// @downloadURL https://update.greasyfork.org/scripts/526944/TheOnioncom%20%E2%80%93%20Dark%20%5BAth%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/526944/TheOnioncom%20%E2%80%93%20Dark%20%5BAth%5D.meta.js
// ==/UserScript==

(function() {
let css = `
  :root {
    --wp--preset--color--black: #000000;
    --wp--preset--color--cyan-bluish-gray: #abb8c3;
    --wp--preset--color--white: #ffffff;
    --wp--preset--color--pale-pink: #f78da7;
    --wp--preset--color--vivid-red: #cf2e2e;
    --wp--preset--color--luminous-vivid-orange: #ff6900;
    --wp--preset--color--luminous-vivid-amber: #fcb900;
    --wp--preset--color--light-green-cyan: #7bdcb5;
    --wp--preset--color--vivid-green-cyan: #00d084;
    --wp--preset--color--pale-cyan-blue: #8ed1fc;
    --wp--preset--color--vivid-cyan-blue: #0693e3;
    --wp--preset--color--vivid-purple: #9b51e0;

    --wp--preset--color--primary-1: #084;
    --wp--preset--color--primary-2: #ccc;
    --wp--preset--color--secondary-1: #94D1B4;

    --wp--preset--color--shade-1: #999;
    --wp--preset--color--shade-2: #333;
    --wp--preset--color--shade-3: #ccc;

    color-scheme: dark;
    background: #111;
    color: #ddd;
  }

  .has-primary-2-background-color {
    background-color: #000 !important;
  }
  [style*="background-color:#f6f6f6"] {
    background-color: var(--wp--preset--color--shade-2) !important;
  }
  .wp-block-post-content > .wp-block-group:has([style^="background-color:#f3f3f3"]),
  .wp-block-post-content > .wp-block-group:has(#h-unlock-the-onion-vault) {
    display: none;
  }
  .slick-dots li button::before {
    color: var(--wp--preset--color--shade-1);
  }
  .custom-logo-link {
    filter: contrast(0.5) invert(1) brightness(0.8) saturate(8) hue-rotate(200deg);
  }
  .onion-part-footer.has-primary-2-background-color {
    background: var(--wp--preset--color--shade-2) !important;
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
