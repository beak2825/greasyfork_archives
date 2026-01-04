// ==UserScript==
// @name         Bunpro: Prevent cursor from jumping to end of input field
// @description  Restores the cursor position after romaji get converted to kana
// @version      0.1.4
// @namespace    https://pampel.dev
// @author       pampel
// @run-at       document-start
// @match        https://bunpro.jp/*
// @match        https://www.bunpro.jp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390962/Bunpro%3A%20Prevent%20cursor%20from%20jumping%20to%20end%20of%20input%20field.user.js
// @updateURL https://update.greasyfork.org/scripts/390962/Bunpro%3A%20Prevent%20cursor%20from%20jumping%20to%20end%20of%20input%20field.meta.js
// ==/UserScript==

'use strict';

addEventListener("turbolinks:load", () => {
  let inputElem = document.querySelector("#study-answer-input");
  if (!inputElem)
    return;

  let oldEndPos = 0;
  let oldValue = "";
  let imeActive = false;

  function listener() {
    // only needed for chrome || firefox
    if (document.activeElement !== inputElem || imeActive)
      return;

    if (oldValue !== inputElem.value && inputElem.selectionEnd === inputElem.value.length)
      inputElem.selectionEnd = inputElem.value.length - oldValue.length + oldEndPos;

    oldEndPos = inputElem.selectionEnd;
    oldValue = inputElem.value;
  }

  // firefox version
  inputElem.addEventListener('selectionchange', listener);
  inputElem.addEventListener('compositionstart', () => imeActive = true);
  inputElem.addEventListener('compositionend', () => imeActive = false);

  // chrome version
  document.addEventListener('selectionchange', listener);
});