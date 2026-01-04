// ==UserScript==
// @name BreakingLineCode
// @namespace Forum
// @author Isilin
// @date 21/04/2024
// @version 1.0
// @description Ajoute un retour à la ligne automatique pour la balise code.
// @license WTF Public License; http://en.wikipedia.org/wiki/WTF_Public_License
// @include https://www.dreadcast.net/Forum
// @include https://www.dreadcast.net/Forum#
// @include https://www.dreadcast.net/FAQ
// @include https://www.dreadcast.net/FAQ#
// @include https://www.dreadcast.net/Forum/*
// @include https://www.dreadcast.net/FAQ/*
// @include https://www.dreadcast.net/EDC
// @include https://www.dreadcast.net/EDC/*
// @compat Firefox, Chrome
// @grant GM_addStyle
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/493103/BreakingLineCode.user.js
// @updateURL https://update.greasyfork.org/scripts/493103/BreakingLineCode.meta.js
// ==/UserScript==

(function() {
let css = `
  pre {
      white-space: pre-wrap !important;
      white-space: moz-pre-wrap !important;
      white-space: -pre-wrap !important;
      white-space: -o-pre-wrap !important;
      line-height: 22px !important;
  }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();