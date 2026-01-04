// ==UserScript==
// @name        Viglink Redirection Suppressor
// @namespace   Violentmonkey Scripts
// @match       https://untoldtales.proboards.com/*
// @grant       none
// @license     MIT
// @version     1.0
// @author      catsoft
// @description 10/24/2023, 8:08:02 PM
// @downloadURL https://update.greasyfork.org/scripts/478180/Viglink%20Redirection%20Suppressor.user.js
// @updateURL https://update.greasyfork.org/scripts/478180/Viglink%20Redirection%20Suppressor.meta.js
// ==/UserScript==

var scriptWatcher = new MutationObserver(function (mutationsList, observer) {
  for (var mutation of mutationsList) {
    if (mutation.type === 'childList') {
      for (var node of mutation.addedNodes) {
        if (node.localName == "script" && node.type=="module" && node.innerText.includes("$(this).prop('href', 'http://redirect.vig")) {
          node.innerHTML = "\n return;"+node.innerHTML
          console.log("sucessfully prevented script from tracking links: ",node)
          scriptWatcher.disconnect()
        }}}}})
scriptWatcher.observe(document, { childList: true, subtree: true });