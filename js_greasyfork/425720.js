// ==UserScript==
// @name         YouTube Ad Skip
// @description  Automatically skips YouTube ads by monitoring the DOM
// @author       drewkerr
// @license      MIT
// @match        https://www.youtube.com/*
// @version 0.0.1.20210430034621
// @namespace https://greasyfork.org/users/766729
// @downloadURL https://update.greasyfork.org/scripts/425720/YouTube%20Ad%20Skip.user.js
// @updateURL https://update.greasyfork.org/scripts/425720/YouTube%20Ad%20Skip.meta.js
// ==/UserScript==
(function() {
  'use strict'

  // configure MutationObserver
  const target = document.querySelector('.video-ads')
  const config = { subtree: true, childList: true }

  // find a skip button and a child node and click it
  function skipAds(targetNode) {
    let skipButton = targetNode.querySelector('.ytp-ad-skip-button')
    if (skipButton) {
      skipButton.click()
      console.log('Ads skipped.')
    }
  }

  // call skipAds when the target node updates
  function callback(mutationsList) {
    for(const mutation of mutationsList) {
      for(const addedNode of mutation.addedNodes) {
        skipAds(addedNode)
      }
    }
  }

  // skip any ads loaded with the page
  skipAds(target)
  
  // add a DOM observer to watch for page changes
  const observer = new MutationObserver(callback)
  observer.observe(target, config)
})()