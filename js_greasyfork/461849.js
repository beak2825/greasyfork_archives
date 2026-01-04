// ==UserScript==
// @name         自动添加空格，在 CJK （中日韩）字符和英文字母之间自动添加空格
// @namespace    pangu-userscript
// @version      1.3.1
// @license      MIT
// @description  在 CJK （中日韩）字符和英文字母之间自动添加空格，考虑了输入框、代码块、DOM 动态更新等情况。
// @match        http*://*/*
// @grant        none
// @require      https://unpkg.com/pangu@4.0.7/dist/browser/pangu.min.js
// @downloadURL https://update.greasyfork.org/scripts/461849/%E8%87%AA%E5%8A%A8%E6%B7%BB%E5%8A%A0%E7%A9%BA%E6%A0%BC%EF%BC%8C%E5%9C%A8%20CJK%20%EF%BC%88%E4%B8%AD%E6%97%A5%E9%9F%A9%EF%BC%89%E5%AD%97%E7%AC%A6%E5%92%8C%E8%8B%B1%E6%96%87%E5%AD%97%E6%AF%8D%E4%B9%8B%E9%97%B4%E8%87%AA%E5%8A%A8%E6%B7%BB%E5%8A%A0%E7%A9%BA%E6%A0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/461849/%E8%87%AA%E5%8A%A8%E6%B7%BB%E5%8A%A0%E7%A9%BA%E6%A0%BC%EF%BC%8C%E5%9C%A8%20CJK%20%EF%BC%88%E4%B8%AD%E6%97%A5%E9%9F%A9%EF%BC%89%E5%AD%97%E7%AC%A6%E5%92%8C%E8%8B%B1%E6%96%87%E5%AD%97%E6%AF%8D%E4%B9%8B%E9%97%B4%E8%87%AA%E5%8A%A8%E6%B7%BB%E5%8A%A0%E7%A9%BA%E6%A0%BC.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  const ignores = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'PRE', 'CODE', 'INPUT']

  const isIgnore = name => ignores.includes(name)
  const isEditable = el => el.getAttribute('contenteditable')?.toLowerCase() === 'true'
  const isMonaco = el => el.getAttribute('class')?.includes("monaco-editor")
 
  function acceptNode(node) {
    const isAccept = isIgnore(node.tagName) || isEditable(node) || isMonaco(node)
    return isAccept ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
  }

  function addSpacing() {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_ELEMENT,
      { acceptNode },
      false
    )

    const elements = []

    while (walker.nextNode()) {
      elements.push(walker.currentNode)
    }

    elements.forEach(element => {
      if (element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE) {
        const originalText = element.textContent
        const newText = pangu.spacing(originalText)

        if (originalText !== newText) {
          element.textContent = newText
        }
      }
    })
  }

  function observeDOM(observer) {
    observer.observe(document.body, { childList: true, subtree: true })
  }

  function debounce(func, wait, immediate) {
    let timeout
    return function () {
      const context = this
      const args = arguments

      const later = function () {
        timeout = null
        if (!immediate) func.apply(context, args)
      }

      const callNow = immediate && !timeout
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)

      if (callNow) func.apply(context, args)
    }
  }

  const addSpacingDebounced = debounce(addSpacing, 300)

  // Run once when the script is loaded
  addSpacing()

  // Run every time the content of the page is changed
  const observer = new MutationObserver(() => {
    requestAnimationFrame(() => {
      addSpacingDebounced()
    })
  })

  // Start observing when the DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => observeDOM(observer))
  } else {
    observeDOM(observer)
  }
})()
