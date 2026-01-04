// ==UserScript==
// @name         wait-for-selector
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @license      MIT
// @description  要素がDOMに出現するまで待つユーティリティです。
// @author       You
// @grant        none
// ==/UserScript==

'use strict'
/**
 * @param {string} selectors
 * @param {number} [timeout=Infinity]
 * @param {ParentNode} [context=document.body]
 * @returns {Promise<Element>}
 */
const waitForSelector = (selectors, timeout = Infinity, context = document.body) => {
  const element = context.querySelector(selectors)

  if (element) {
    return Promise.resolve(element)
  }

  return new Promise((resolve, reject) => {
    const observer = new MutationObserver(records => {
      for (const { addedNodes } of records) {
        if (!addedNodes.length) {
          continue
        }

        const element = context.querySelector(selectors)

        if (!element) {
          continue
        }

        observer.disconnect()
        resolve(element)
      }
    })

    observer.observe(context, {
      childList: true,
      subtree: true
    })

    if (Number.isFinite(timeout)) {
      setTimeout(() => {
        observer.disconnect()
        reject(new Error('Element not found'))
      }, timeout)
    }
  })
}

unsafeWindow.waitForSelector = waitForSelector
