// ==UserScript==
// @name         GitHub to DeepWiki Button
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds a button to GitHub pages to open the corresponding page on DeepWiki.
// @author       You
// @match        https://github.com/*/*
// @icon         https://www.google.com/as2/favicons?sz=64&domain=github.com
// @grant        none
// @license MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/534117/GitHub%20to%20DeepWiki%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/534117/GitHub%20to%20DeepWiki%20Button.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  function addButton() {
    const actionsList = document.querySelector('.AppHeader-actions')

    if (!actionsList) {
      return false
    }

    if (document.getElementById('deepwiki-button')) {
      return true
    }

    const button = document.createElement('button')
    button.textContent = 'Open in DeepWiki'
    button.id = 'deepwiki-button'
    button.type = 'button'

    button.classList.add('btn', 'btn-sm')
    button.addEventListener('click', function () {
      const deepwikiUrl = window.location.href.replace('github.com', 'deepwiki.com')
      window.open(deepwikiUrl, '_blank')
    })
    actionsList.appendChild(button)
    console.log('Tampermonkey - GitHub to DeepWiki: Button added successfully.')
    return true
  }

  if (!addButton()) {
    const retryInterval = setInterval(() => {
      if (addButton()) {
        clearInterval(retryInterval)
      }
    }, 500)
    setTimeout(() => {
      clearInterval(retryInterval)

      if (!document.getElementById('deepwiki-button')) {
        console.warn('Tampermonkey - GitHub to DeepWiki: Failed to add button after multiple retries.')
      }
    }, 5000)
  }
})()
