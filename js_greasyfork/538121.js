// ==UserScript==
// @name        Hide Translator's Note
// @namespace   Violentmonkey Scripts
// @match       *://ranobes.top/devils-son-in-law-v812312-360872/*
// @match       *://ranobes.net/devils-son-in-law-v812312-360872/*
// @grant       none
// @version     1.0
// @author      -
// @license     MIT
// @description 6/3/2025, 6:51:44 AM
// @downloadURL https://update.greasyfork.org/scripts/538121/Hide%20Translator%27s%20Note.user.js
// @updateURL https://update.greasyfork.org/scripts/538121/Hide%20Translator%27s%20Note.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let section = document.querySelector(".story #arrticle");

  if (!section) {
    return;
  }

  let paras = section.querySelectorAll("p");

  if (paras.length === 0) {
    return;
  }

  // Hide the last paragraph that is probably the translator's note
  const lastPara = paras[paras.length - 1];
  lastPara.style.display = "none";

  const button = document.createElement("button");
  button.textContent = "Show Translator's Note";
  button.style.border = "1px dotted #666";
  button.style.background = "transparent";
  button.style.cursor = "pointer";
  button.style.marginTop = "1em";

  button.addEventListener("click", () => {
    lastPara.style.display = "";
    button.remove();
  });

  lastPara.parentNode.insertBefore(button, lastPara.nextSibling);
})();
