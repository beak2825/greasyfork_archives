// ==UserScript==
// @name         Tampermonkey Editors
// @namespace    VSCode
// @version      1
// @description  Shows the script titles on vscode.dev instead of their name space.
// @author       hacker09
// @match        https://vscode.dev/*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://vscode.dev
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482176/Tampermonkey%20Editors.user.js
// @updateURL https://update.greasyfork.org/scripts/482176/Tampermonkey%20Editors.meta.js
// ==/UserScript==

(function() {
  'use strict';
    new MutationObserver(async function() {

  document.querySelectorAll(".collapsed.codicon.codicon-tree-item-expanded").forEach(el => el.click())

    }).observe(document.querySelector("#workbench\\.parts\\.sidebar"), { //Define o elemento e as caracteristicas a serem observadas
      attributes: true,
      attributeOldValue: true,
      characterData: true,
      characterDataOldValue: true,
      childList: true,
      subtree: true
    }); //Termina as definicoes a serem observadas */
})();