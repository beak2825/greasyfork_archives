// ==UserScript==
// @name EXhentai Visual Borders Helper
// @namespace https://greasyfork.org/users/58231
// @version 0.0.2.1
// @description Highlight images between JPG, GIF and PNG by border color.
// @author Jaraya
// @grant GM_addStyle
// @run-at document-start
// @match https://exhentai.org/g/*
// @match https://e-hentai.org/g/*
// @downloadURL https://update.greasyfork.org/scripts/396202/EXhentai%20Visual%20Borders%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/396202/EXhentai%20Visual%20Borders%20Helper.meta.js
// ==/UserScript==

(function() {
let css = `
    #gdt a div div[title*="png"] {
        border: 3px solid red!important;
        margin: -2px!important;
    }

    #gdt a div div[title*="jpg"],
    #gdt a div div[title*="jpeg"] {
        border: 3px solid cyan!important;
        margin: -2px!important;
    }

    #gdt a div div[title*="gif"] {
        border: 3px solid magenta!important;
        margin: -2px!important;
    }
    #gdt a div div[title*="webp"] {
        border: 3px solid green!important;
        margin: -2px!important;
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
