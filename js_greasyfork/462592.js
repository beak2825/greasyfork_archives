// ==UserScript==
// @name         FixSpacing2
// @namespace    CSS userscript
// @license MIT
// @version      0.1
// @description  Fix ugly new CAI spacing in a better way
// @author       good anon
// @match        https://beta.character.ai/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462592/FixSpacing2.user.js
// @updateURL https://update.greasyfork.org/scripts/462592/FixSpacing2.meta.js
// ==/UserScript==

(function () {
  let css = `
    .markdown-wrapper  p  {  display:inline-block;  margin-block-end:0.5em;  }
    .markdown-wrapper  p br {  display:block;  content:" "!important;  margin:-1em;  }
   `;

  var head = document.getElementsByTagName("head")[0];
  var style = document.createElement("style");
  style.setAttribute("type", 'text/css');
  style.innerHTML = css;
  head.appendChild(style);
})();