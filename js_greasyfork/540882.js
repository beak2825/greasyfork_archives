// ==UserScript==
// @name        hydrus.app video controls
// @namespace   Violentmonkey Scripts
// @match       https://hydrus.app/*
// @match       https://dev.hydrus.app/*
// @grant       none
// @version     1.1
// @author      -
// @license     MIT
// @description 6/26/2025, 11:14:24 PM
// @downloadURL https://update.greasyfork.org/scripts/540882/hydrusapp%20video%20controls.user.js
// @updateURL https://update.greasyfork.org/scripts/540882/hydrusapp%20video%20controls.meta.js
// ==/UserScript==

(async function() {
  const pswpItemsObserver = new MutationObserver((mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        for (const node of mutation.addedNodes) {
          if (node.tagName !== "VIDEO") {
            continue
          }
          node.controls = true
        }
      }
    }
  })

  const pwspObserver = new MutationObserver((mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        for (const node of mutation.addedNodes) {
          if (!node.classList?.contains("pswp")) {
            continue
          }
          const pswpItems = node.querySelector("#pswp__items")
          pswpItemsObserver.observe(pswpItems, {childList: true, subtree: true})
          pswpItems.querySelectorAll("video.pswp-video").forEach(e => {e.controls = true})
        }
      }
    }
  })

  pwspObserver.observe(document.body, {childList: true})
})()