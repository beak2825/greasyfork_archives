// ==UserScript==
// @name         replace-font-sizes
// @namespace    http://tampermonkey.net/
// @version      202312190930
// @description  Replace all fonts sizes by preferred ones.
// @author       Rafael David Tinoco
// @match        http*://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482671/replace-font-sizes.user.js
// @updateURL https://update.greasyfork.org/scripts/482671/replace-font-sizes.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  var fixedWidthFonts = [
    'Monospace',
    'Courier',
    'Courier New',
    'Consolas',
    'Monaco',
    'Menlo',
    'Fire Mono',
    'Liberation Mono',
    'Monospace',
    'Noto Mono',
    'Roboto Mono'
  ]

  var domainFontSettings = [
    {
      domain: 'twitter.com',
      minFontSize: 18,
      maxFontSize: 18,
      minFixedWidthFontSize: 18,
      maxFixedWidthFontSize: 18,
      lineHeight: 1.2,
      fixedWidthLineHeight: 1.2
    },
    {
      domain: 'github.com',
      minFontSize: 17,
      maxFontSize: 24,
      minFixedWidthFontSize: 17,
      maxFixedWidthFontSize: 17,
      lineHeight: 1.2,
      fixedWidthLineHeight: 1.2
    },
    {
      domain: 'google.com',
      minFontSize: 16,
      maxFontSize: 22,
      minFixedWidthFontSize: 16,
      maxFixedWidthFontSize: 22,
      lineHeight: 0,
      fixedWidthLineHeight: 0
    },
    {
      domain: 'openai.com',
      minFontSize: 18,
      maxFontSize: 18,
      minFixedWidthFontSize: 18,
      maxFixedWidthFontSize: 18,
      lineHeight: 1.4,
      fixedWidthLineHeight: 1.2
    }
  ]

  function adjustFontSize (node) {
    let currentDomain = window.location.hostname
    let fontFamily = window.getComputedStyle(node).fontFamily.toLowerCase()
    let fontSize = parseFloat(window.getComputedStyle(node).fontSize)
    let isFixedWidth = fixedWidthFonts.some(font =>
      fontFamily.includes(font.toLowerCase())
    )

    let applicableSettings = domainFontSettings.find(setting =>
      currentDomain.includes(setting.domain)
    )
    if (!applicableSettings) return

    let newFontSize = 0
    let newLineHeight = 0

    let {
      minFontSize,
      maxFontSize,
      minFixedWidthFontSize,
      maxFixedWidthFontSize,
      lineHeight,
      fixedWidthLineHeight
    } = applicableSettings

    if (isFixedWidth) {
      if (fontSize < minFixedWidthFontSize) {
        newFontSize = minFixedWidthFontSize
      }
      if (fontSize > maxFixedWidthFontSize) {
        newFontSize = maxFixedWidthFontSize
      }
      if (fixedWidthLineHeight) {
        newLineHeight = fixedWidthLineHeight
      }
    } else {
      if (fontSize < minFontSize) {
        newFontSize = minFontSize
      }
      if (fontSize > maxFontSize) {
        newFontSize = maxFontSize
      }
      if (lineHeight) {
        newLineHeight = lineHeight
      }
    }

    if (newFontSize) {
      node.style.fontSize = `${newFontSize}px`
    }
    if (newLineHeight) {
      node.style.lineHeight = `${newLineHeight}em`
    }
  }

  function observeDOMChanges () {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            adjustFontSize(node)
            node.querySelectorAll('*').forEach(adjustFontSize)
          }
        })
        if (mutation.type === 'attributes') {
          adjustFontSize(mutation.target)
        }
      })
    })
    observer.observe(document, {
      childList: true,
      subtree: true,
      attributes: true
    })
  }

  window.addEventListener('load', () => {
    document.querySelectorAll('*').forEach(adjustFontSize)
    observeDOMChanges()
  })

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('*').forEach(adjustFontSize)
  })
})()
