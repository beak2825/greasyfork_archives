// ==UserScript==
// @name         Trello Markdown Enhancer
// @description  Enhance Trello card description markdown rendering with marked.js
// @version      0.1
// @author       Hikerpig
// @copyright    2019 hikerpig (https://openuserjs.org/users/hikerpig)
// @licence      MIT
// @match        https://trello.com/*
// @require      https://cdn.jsdelivr.net/npm/marked/marked.min.js
// @grant        none
// @namespace https://greasyfork.org/users/325041
// @downloadURL https://update.greasyfork.org/scripts/388543/Trello%20Markdown%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/388543/Trello%20Markdown%20Enhancer.meta.js
// ==/UserScript==

;(function() {
  'use strict'

  /**
   * @type MutationObserver
   */
  let mo

  function renderContent(input) {
    let text
    if (typeof input === 'string') {
      text = input
    } else if (input instanceof Element) {
      text = input.innerHTML
    }
    return marked(text)
  }

  // function getRawMarkdown(descEle) {
  //   let rawMarkdown = descEle.innerText
  //   Object.keys(descEle).forEach(k => {
  //     if (descEle[k].unmarkeddown) {
  //       rawMarkdown = descEle[k].unmarkeddown
  //     }
  //   })
  //   return rawMarkdown
  // }

  /**
   * Enhance description rendering with marked.js
   */
  function enhanceDesc() {
    const descEle = document.querySelector('.js-desc')
    if (!descEle) return
    const pEles = descEle.querySelectorAll('p')
    pEles.forEach((pEle) => {
      const text = pEle.innerText
      let hasTable = text.split('\n').some((lineContent) => {
        if (/\|\s*---\s*|/.test(lineContent)) {
          return true
        }
      })
      if (hasTable) {
        const newHTML = marked(text)
        pEle.innerHTML = newHTML
      }
    })
  }

  function bindOverlayEvents() {
    const tabParentEle = document.querySelector('.js-tab-parent')
    if (!mo) {
      mo = new MutationObserver(mutations => {
        // console.log('mutations', mutations)
        let hasCardDetail = false
        mutations.forEach(m => {
          if (m.addedNodes.length) {
            hasCardDetail = true
          }
        })

        if (hasCardDetail) {
          enhanceDesc()
        }
      })
    }
    mo.observe(tabParentEle, { childList: true })
  }

  // window.enhanceDesc = enhanceDesc

  // ---------------- start -----------------------
  enhanceDesc()
  bindOverlayEvents()
})()
