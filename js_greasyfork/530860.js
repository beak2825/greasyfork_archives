// ==UserScript==
// @name         ChatGPT Vim-Style Scrolling (Ctrl+U / Ctrl+D)
// @namespace    https://greasyfork.org/users/your-username
// @version      1.1
// @description  Scroll ChatGPT with keyboard like Vim (Ctrl+U to scroll up, Ctrl+D to scroll down)
// @author       Maciek Dobaczewski
// @match        https://chatgpt.com/*
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/530860/ChatGPT%20Vim-Style%20Scrolling%20%28Ctrl%2BU%20%20Ctrl%2BD%29.user.js
// @updateURL https://update.greasyfork.org/scripts/530860/ChatGPT%20Vim-Style%20Scrolling%20%28Ctrl%2BU%20%20Ctrl%2BD%29.meta.js
// ==/UserScript==

(function () {
  'use strict'

  function handleKeydown(e) {
    if (!e.ctrlKey) return

    // You can manually update this selector if chatGPT changes the element. 
    const container = document.querySelector('div.flex.h-full.flex-col.overflow-y-auto')
    if (!container) return

    const key = e.key.toLowerCase()
    if (key === 'd') {
      container.scrollBy({ top: 300 })
      e.preventDefault()
    } else if (key === 'u') {
      container.scrollBy({ top: -300 })
      e.preventDefault()
    }
  }

  document.addEventListener('keydown', handleKeydown, true)
})()
