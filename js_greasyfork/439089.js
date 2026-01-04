// ==UserScript==
// @name          Reddit - Always disable safe search
// @version       0.1
// @description   Always disable the safe search toggle when performing a search on reddit.
// @author        schwarzkatz
// @match         https://www.reddit.com/*
// @grant         none
// @namespace https://greasyfork.org/users/811544
// @downloadURL https://update.greasyfork.org/scripts/439089/Reddit%20-%20Always%20disable%20safe%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/439089/Reddit%20-%20Always%20disable%20safe%20search.meta.js
// ==/UserScript==

(function() {
  // wait for element to exist
  // https://stackoverflow.com/a/61511955
  function waitForElm(selector) {
    return new Promise(resolve => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector))
      }

      const observer = new MutationObserver(mutations => {
        if (document.querySelector(selector)) {
          resolve(document.querySelector(selector))
          observer.disconnect()
        }
      })

      observer.observe(document.body, {
        childList: true,
        subtree: true
      })
    })
  }

  waitForElm(`#safe-search-toggle[aria-checked=true]`).then(e => e.click())
})()
