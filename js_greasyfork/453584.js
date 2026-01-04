// ==UserScript==
// @name BBVA - Dark mode
// @namespace https://greasyfork.org/en/users/4813
// @version 2023.07.17
// @description By default these pages have too much white.
// @author Swyter
// @license CC-BY-SA 4.0
// @grant GM_addStyle
// @run-at document-start
// @match *://*.web.bbva.es/*
// @downloadURL https://update.greasyfork.org/scripts/453584/BBVA%20-%20Dark%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/453584/BBVA%20-%20Dark%20mode.meta.js
// ==/UserScript==

(function() {
let css = `
    /* swy: dark mode */
    html
    {
        filter: invert(0.88) hue-rotate(180deg);
    }
    
    ph_cabecera,
    div[data-addon=bbva-announcement],
    div[data-autoload=experiencias],
    #app_footer_fyc_normal,
    div#footer,
    header[role=banner],
    nav#header,
    div[class*=megamenu__fixed],
    .m-marquee__media,
    nav-menu
    {
        filter: invert(1) hue-rotate(180deg);
    }
    
    img.o-media__img,
    img.o-heading__img,
    img[class*=cover]:not([class*=complexmarquee__img]),
    img[class*=card],
    video,
    iframe:not([id=initial-loading-spinner]),
    div.o-media__item.width-xxsmall
    {
        filter: invert(1) hue-rotate(180deg) !important;
    }
    
    /* swy: make the bank logo cover the whole cell */
    div.m-products table.o-table th[role=rowheader] img.o-media__img
    {
        width: inherit !important;
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
