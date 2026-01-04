// ==UserScript==
// @name nautiljon-mini-signatures
// @namespace github.com/openstyles/stylus
// @version 0.1
// @description Réduit la taille des images et du texte dans les signatures et les agrandit au passage du pointeur.
// @author Ed38
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.www.nautiljon.com/*
// @downloadURL https://update.greasyfork.org/scripts/462557/nautiljon-mini-signatures.user.js
// @updateURL https://update.greasyfork.org/scripts/462557/nautiljon-mini-signatures.meta.js
// ==/UserScript==

(function() {
let css = `

    :root {
        
        --signature-img-mini-height: 40px;  /* Hauteur limite des images minimisées */
        --signature-img-maxi-height: 900px; /* Hauteur limite des images maximisées */
        --signature-font-mini-size: 8px;    /* Taille limite du texte minimisé */
        --signature-maxi-delay: 500ms;      /* Delai avant maximisation (temps de survol) */
        --signature-image-spacer: 1mm;      /* Espace entre les images */

    }

    div[id*="likes"] ~ * img {
        height: 0%;
        max-height: var(--signature-img-mini-height);
        width: auto !important;
        margin-right: var(--signature-image-spacer);
        transition: all 250ms ease-in ;
    }

    div[id*="likes"] ~ * img:hover {
        height: 100%;
        max-height: var(--signature-img-maxi-height);
        transition: all 1000ms ease-out var(--signature-maxi-delay);
    }

    div[id*="likes"] ~ * {
        font-size: min(1em, var(--signature-font-mini-size)) ;
        transition: font-size 150ms ease-in ;
    } 
   
    div[id*="likes"] ~ *:hover, div[id*="likes"] ~ *:hover *{
        font-size: inherit ;
        transition: font-size 150ms ease-out var(--signature-maxi-delay);
    }
    
 
    div[id*="likes"] ~ * font[class="emo"] {
         font-size:calc(var(--signature-font-mini-size)*1.23) ;
    }
 
     div[id*="likes"] ~ *:hover font[class="emo"] {
         font-size:16px ;
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
