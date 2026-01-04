// ==UserScript==
// @name         GQL Playground Tooltip Fix
// @namespace    gql-playground-fix
// @version      1.0
// @description  Fixes tooltips in GQL Playground
// @author       rpiaggio
// @match        *://localhost:*/*
// @match        *://*.lucuma.xyz/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/514876/GQL%20Playground%20Tooltip%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/514876/GQL%20Playground%20Tooltip%20Fix.meta.js
// ==/UserScript==

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.removedNodes.length) {
      mutation.removedNodes.forEach((node) => {
        if (
          node.tagName === "UL" &&
          node.classList.contains("CodeMirror-hints")
        ) {
          if (!node.parentElement && mutation.target.parentElement) {
            mutation.target.parentElement.removeChild(mutation.target);
          }
        }
      });
    }
  });
});

observer.observe(document.body, {
  subtree: true,
  childList: true,
});