// ==UserScript==
// @name E-Hentai Hide Comments
// @namespace http://tampermonkey.net/
// @version 1.0.2
// @description Comments go away.
// @author Xerodusk
// @license GPL-3.0-or-later
// @grant GM_addStyle
// @run-at document-start
// @match https://e-hentai.org/g/*
// @match https://exhentai.org/g/*
// @downloadURL https://update.greasyfork.org/scripts/444179/E-Hentai%20Hide%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/444179/E-Hentai%20Hide%20Comments.meta.js
// ==/UserScript==

(function() {
let css = `
    #cdiv {
        display: none;
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
