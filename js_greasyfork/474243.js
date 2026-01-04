// ==UserScript==
// @name         NS_Pass
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ez
// @author       NeoSlyde
// @match        https://www.japscan.lol/lecture-en-ligne/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=japscan.lol
// @grant        none
// @license MIT
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/474243/NS_Pass.user.js
// @updateURL https://update.greasyfork.org/scripts/474243/NS_Pass.meta.js
// ==/UserScript==


const obs = new MutationObserver((mutationsList) => {
  for (const mut of mutationsList) {
    for (const node of mut.addedNodes) {
      if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE') {
        if(node.text.includes("isBrave")){
          node.remove();
        }
      }
    }
  }
});



obs.observe(document.documentElement, { childList: true, subtree: true });