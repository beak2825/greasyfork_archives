// ==UserScript==
// @name         replace-fonts
// @namespace    http://tampermonkey.net/
// @version      202312190930
// @description  Replace all fonts by preferred ones.
// @author       Rafael David Tinoco
// @match        http*://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482670/replace-fonts.user.js
// @updateURL https://update.greasyfork.org/scripts/482670/replace-fonts.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  var fontsToOpenSans = [
    'Calibri',
    'Cambria',
    'Candara',
    'Constantia',
    'Corbel',
    'Georgia',
    'Segoe UI',
    'Trebuchet MS',
    'Verdana',
    'sans',
    'sans-serif',
    'serif',
    'Avenir',
    'Avenir Next',
    'Comic Sans MS',
    'Comic Sans',
    'Lucida Grande',
    'Lucida Sans',
    'Roboto'
  ]
  var fontsToCousine = [
    'Monospace',
    'Noto Mono',
    'Consolas',
    'Courier New',
    'Courier',
    'Monaco',
    'Menlo',
    'Fira Mono',
    'Liberation Mono',
    'Roboto Mono'
  ]
  var fontsToLiberationSans = [
    'Arial',
    'Times New Roman',
    'Arial Narrow',
    'Tahoma',
    'Helvetica',
    'Helvetica Neue',
    'San Francisco',
    'Fira Sans',
    'Noto Sans'
  ]

  function adjustElementStyles (node) {
    let fontFamily = window
      .getComputedStyle(node)
      .fontFamily.replace(/["']/g, '')
    let site = window.location.hostname

    fontFamily.split(',').some(font => {
      if (fontsToOpenSans.includes(font.trim())) {
        node.style.fontFamily = '"Open Sans", sans-serif'
        return true
      } else if (fontsToCousine.includes(font.trim())) {
        node.style.fontFamily = 'Cousine, monospace'
        return true
      } else if (fontsToLiberationSans.includes(font.trim())) {
        node.style.fontFamily = '"Liberation Sans", sans-serif'
        return true
      }
      return false
    })
  }

  function observeDOMChanges () {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            adjustElementStyles(node)
            node.querySelectorAll('*').forEach(adjustElementStyles)
          }
        })
      })
    })
    observer.observe(document, { childList: true, subtree: true })
  }

  window.addEventListener('load', () => {
    document.querySelectorAll('*').forEach(adjustElementStyles)
    observeDOMChanges()
  })

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('*').forEach(adjustElementStyles)
  })
})()
