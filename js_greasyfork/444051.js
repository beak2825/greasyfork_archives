// ==UserScript==
// @name        IGG-Games Anti-Anti Adblock
// @namespace   https://github.com/earthplusthree/userscripts
// @match       *://igg-games.com/*
// @grant       none
// @version     1.0
// @author      earthplusthree
// @description Watches for and removes 'Disable Adblock' popup on igg-games.com. Working 4/26/22.
// @downloadURL https://update.greasyfork.org/scripts/444051/IGG-Games%20Anti-Anti%20Adblock.user.js
// @updateURL https://update.greasyfork.org/scripts/444051/IGG-Games%20Anti-Anti%20Adblock.meta.js
// ==/UserScript==

let antiAdblockModal = document.getElementById("idModal");
let originalParent = antiAdblockModal.parentNode.nodeName;

const observer = new MutationObserver((mutations, observer) => {
  if (antiAdblockModal.parentNode.nodeName !== originalParent)
    antiAdblockModal.parentNode.remove();
});
observer.observe(document, {
  subtree: true,
  attributes: true,
});
