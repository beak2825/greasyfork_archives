// ==UserScript==
// @name         Hide YouTube Shorts (Mobile Layout)
// @version      1.0
// @namespace    https://gist.github.com/jyboudreau/6bc00ff8c96aa94e9312595efbf93175
// @description  Remove shorts from feeds/searches
// @author       github.com/jyboudreau
// @match        https://*.youtube.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450360/Hide%20YouTube%20Shorts%20%28Mobile%20Layout%29.user.js
// @updateURL https://update.greasyfork.org/scripts/450360/Hide%20YouTube%20Shorts%20%28Mobile%20Layout%29.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  const rootSelector = '.page-container'
  const shortsReelSearchSelector = 'ytm-search ytm-reel-shelf-renderer'
  const shortsOverlaySelector = 'ytm-thumbnail-overlay-time-status-renderer[data-style="SHORTS"]'
  const videoRendererSelector = 'ytm-video-with-context-renderer, ytm-compact-video-renderer'

  const findShortOverlays = () => Array.from(document.querySelectorAll(shortsOverlaySelector))
  const findVideoRenderer = (element) => element.closest(videoRendererSelector)

  function removeShortsReel() {
    const reels = document.querySelectorAll(shortsReelSearchSelector)
    if (reels.length) {
      reels.forEach((reel) => reel.remove())
      console.log(`Removed ${reels.length} shorts`)
    }
  }

  function removeShortsInFeeds() {
    const renderers = findShortOverlays().map(findVideoRenderer)
    if (renderers.length) {
      renderers.forEach((renderer) => renderer.remove())
      console.log(`Removed ${renderers.length} shorts from feeds`)
    }
  }

  function removeAllShorts() {
    removeShortsReel()
    removeShortsInFeeds()
  }

  const observer = new MutationObserver(removeAllShorts)
  observer.observe(document.querySelector(rootSelector), { childList: true, subtree: true })
})()
