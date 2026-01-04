// ==UserScript==
// @name         Fix Order of GitHub Dashboard
// @namespace    http://prantlf.me/
// @version      2.2
// @description  Keeps entries on the GitHub dashboard page ordered from the newest one to the oldest one, but the More button may not always appear.
// @author       prantlf@gmail.com
// @license      MIT
// @match        https://github.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520074/Fix%20Order%20of%20GitHub%20Dashboard.user.js
// @updateURL https://update.greasyfork.org/scripts/520074/Fix%20Order%20of%20GitHub%20Dashboard.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const dashboard = document.getElementById('dashboard')
  let observe = true
  const observer = new MutationObserver(mutations => {
    if (observe && mutations.some(mutatedArticle)) {
      console.debug('[fix-order]', 'new articles detected')
      debounce(reorder)
    }
  })
  observer.observe(dashboard, { childList: true, subtree: true })

  function mutatedArticle({ target, addedNodes }) {
    return isOrHasArticle(target) || Array.from(addedNodes).some(isOrHasArticle)
  }

  function isOrHasArticle(el) {
    return el.tagName === 'ARTICLE' || el.nodeType === 1 && el.getElementsByTagName('ARTICLE').length > 0
  }

  let debouncing
  function debounce(fn) {
    if (debouncing) {
      clearTimeout(debouncing)
      debouncing = undefined
    }
    debouncing = setTimeout(fn, 100)
  }

  function reorder() {
    observe = false
    const feeds = Array.from(dashboard.getElementsByTagName('TURBO-FRAME'))
    const articles = feeds
      .map(frame => Array.from(frame.children).filter(el => el.tagName === 'ARTICLE'))
      .flat()
    const position = document.documentElement.scrollTop
    const now = new Date
    for (const article of articles) {
      const { nextElementSibling: div } = article
      article.div = div
      const time = article.querySelector('relative-time')
      article.time = time && new Date(time.getAttribute('datetime')) || now
      article.remove()
      div.remove()
    }
    articles.sort((l, r) => l.time < r.time ? 1 : l.time > r.time ? -1 : 0)
    const feed = feeds[feeds.length - 1]
    let { firstElementChild: anchor } = feed
    for (const article of articles) {
      const { div } = article
      anchor.insertAdjacentElement('afterend', article)
      article.insertAdjacentElement('afterend', div)
      delete article.div
      delete article.time
      anchor = div
    }
    console.debug('[fix-order]', articles.length, 'articles reordered')
    setTimeout(() => {
      document.documentElement.scrollTop = position
      observe = true
    })
  }
})();