// ==UserScript==
// @name MyHeritage: font weight
// @namespace github.com/openstyles/stylus
// @version 1.0.1
// @description Increases the font weight of the persons' dates (not the names).
// @author ciricuervo
// @grant GM_addStyle
// @run-at document-start
// @match *://*.myheritage.com/*
// @match *://*.myheritage.es/*
// @downloadURL https://update.greasyfork.org/scripts/540790/MyHeritage%3A%20font%20weight.user.js
// @updateURL https://update.greasyfork.org/scripts/540790/MyHeritage%3A%20font%20weight.meta.js
// ==/UserScript==

(function() {
let css = `

    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400..700&display=swap');

    /* Try to use Helvetica Neue if they exist locally, otherwise load it from CDN */
    @font-face {
        font-family: 'helvetica-local';
        src: local("HelveticaNeue-Medium");
        font-style: normal;
        font-weight: 400 700;
        font-display: swap;
    }

    g[data-type="_svgGroup"] g[pointer-events="none"] text {
        font-family: 'helvetica-local', Inter, Arial, sans-serif;
    }

    g[data-type="_svgGroup"] g[pointer-events="none"] + g[pointer-events='none'] text {
        font-weight: 500;
    }

    g[data-type='_svgGroup'] g[pointer-events='none'] + g[pointer-events='none'] text[font-size^='13'] {
        font-size: 12.5px;
    }

    g[data-type='_svgGroup'] g[pointer-events='none'] + g[pointer-events='none'] text[font-size^='14.3'] {
        font-size: 13.8px;
    }

    g[data-type='_svgGroup'] g[pointer-events='none'] + g[pointer-events='none'] text[font-size^='15'] {
        font-size: 14.5px;
    }

    g[data-type='_svgGroup'] g[pointer-events='none'] + g[pointer-events='none'] text[font-size^='16.9'] {
        font-size: 16.4px;
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
