// ==UserScript==
// @name Linguee Wide
// @namespace https://greasyfork.org/users/676264
// @version 0.0.1.20200814214044
// @description Remove Linguee min & max widths
// @author V1rgul (https://github.com/V1rgul)
// @license CC BY-NC - Creative Commons Attribution-NonCommercial
// @grant GM_addStyle
// @run-at document-start
// @match *://*.linguee.com.br/*
// @match *://*.linguee.de/*
// @match *://*.linguee.es/*
// @match *://*.linguee.fr/*
// @match *://*.linguee.ru/*
// @downloadURL https://update.greasyfork.org/scripts/408760/Linguee%20Wide.user.js
// @updateURL https://update.greasyfork.org/scripts/408760/Linguee%20Wide.meta.js
// ==/UserScript==

(function() {
let css = `

  #outer_div
  {
    max-width: none !important;
    min-width: 484px  !important;
 /* 17+450+17 */;
  }

  #mainlayout
  {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  .app_teaser
  {
    display: none !important;
  }

  #dictionary .dictionaryWithAppTeaser
  {
    padding-right: 0 !important;
  }

  .dictionaryWithAppTeaser .exact .lemma_content
  {
    padding-left: 40px;
  }

  .dictionaryWithAppTeaser .inexact .lemma_content
  {
    padding-left: 0;
  }

  #lingueecontent
  {
    margin-bottom: 5em;
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
