// ==UserScript==
// @name De-Shittify Asura
// @namespace https://greasyfork.org/en/users/1452991-stying
// @version 1.0.3
// @description De-Shittify Asura scans and remove Ad Prompt and banner
// @author Stying
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @include https://asuracomic.net*/*
// @downloadURL https://update.greasyfork.org/scripts/531542/De-Shittify%20Asura.user.js
// @updateURL https://update.greasyfork.org/scripts/531542/De-Shittify%20Asura.meta.js
// ==/UserScript==

(function() {
let css = `

    
    
    div.bg-gradient-to-br.from-indigo-900.via-purple-900.to-indigo-800.text-white.py-8.px-4.md\\:py-12.md\\:px-10.shadow-lg.relative.overflow-hidden, .jsx-5e69ac27470f8f66.min-h-min.my-auto{
        display: none !important;
    }
    
    

    html[class*="dark"] body header.bg-themecolor .max-w-\\[1220px\\].flex.mx-auto.px-2.items-center.justify-between.gap-5 .flex.w-full .flex-row.w-full.gap-3\\.5.items-center .hidden.md\\:flex.flex-row.w-full.gap-3\\.5.items-center .hidden.md\\:flex.flex-row.items-center.gap-3\\.5 .flex.justify-between.items-center {
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
