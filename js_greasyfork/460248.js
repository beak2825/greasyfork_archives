// ==UserScript==
// @name        [PTP] Catch unsaved comments/posts
// @namespace   kannibalox
// @match       https://passthepopcorn.me/*
// @grant       none
// @version     1.0
// @author      kannibalox
// @license     GNU GPLv3
// @description Catch unsaved comments/posts
// @downloadURL https://update.greasyfork.org/scripts/460248/%5BPTP%5D%20Catch%20unsaved%20commentsposts.user.js
// @updateURL https://update.greasyfork.org/scripts/460248/%5BPTP%5D%20Catch%20unsaved%20commentsposts.meta.js
// ==/UserScript==
"use strict";
const beforeUnloadListener = (e) => {
  e.preventDefault();
  return e.returnValue = '';
};


function main() {
  var textInput = document.querySelector("#quickpost");
  var submitInput = document.querySelector("#quickpostform");
  if (textInput !== null && submitInput !== null) {
    textInput.addEventListener("input", (event) => {
      if (event.target.value !== "") {
        addEventListener("beforeunload", beforeUnloadListener, {capture: true});
      } else {
        removeEventListener("beforeunload", beforeUnloadListener, {capture: true});
      }
    });
    submitInput.addEventListener("submit", (event) => {
      removeEventListener("beforeunload", beforeUnloadListener, {capture: true});
    });
  }
}

window.addEventListener('load', main(), false);