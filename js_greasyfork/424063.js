// ==UserScript==
// @name Instagram - Allow right click on images
// @namespace github.com/Brawl345
// @version 1.0.3
// @description Allow right-clicking on images on Instagram
// @author Brawl (https://github.com/Brawl345)
// @license Unlicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.instagram.com/*
// @downloadURL https://update.greasyfork.org/scripts/424063/Instagram%20-%20Allow%20right%20click%20on%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/424063/Instagram%20-%20Allow%20right%20click%20on%20images.meta.js
// ==/UserScript==

(function() {
let css = `
._ovg3g, ._si7dy, ._9AhH0, ._aagw, .x1qjc9v5.x972fbf.xcfux6l.x1qhh985.xm0m39n.x9f619.x78zum5.xdt5ytf.x2lah0s.xk390pu.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.xggy1nq.x11njtxf.x5yr21d.x10l6tqk.x17qophe.x13vifvy.xh8yej3 {
    display: none !important;
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
