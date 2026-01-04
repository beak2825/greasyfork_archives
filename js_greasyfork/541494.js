// ==UserScript==
// @name         airaFence enable language
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Enable language dropdown on airaFence login page running on localhost or LAN
// @author       Alejandrocsdev
// @match        http://127.0.0.1:8086/*
// @include      http://192.168.10.*:8086/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=0.1
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541494/airaFence%20enable%20language.user.js
// @updateURL https://update.greasyfork.org/scripts/541494/airaFence%20enable%20language.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  // Watch for the select element and hook into its attribute changes
  const watchSelect = (select) => {
    if (!select) return

    const disableObserver = new MutationObserver(() => {
      if (select.disabled) {
        select.removeAttribute('disabled')
        // console.log('🛠️ Disabled attribute removed again')
      }
    })

    disableObserver.observe(select, {
      attributes: true,
      attributeFilter: ['disabled']
    })

    // Initial remove in case it's already disabled
    select.removeAttribute('disabled')
    // console.log('✅ Select enabled and observer attached')
  }

  // Top-level observer to catch the select when it appears
  const rootObserver = new MutationObserver(() => {
    const select = document.querySelector('select[disabled]')
    if (select) {
      watchSelect(select)
    }
  })

  rootObserver.observe(document.body, {
    childList: true,
    subtree: true
  })

  // If the element is already rendered, hook immediately
  const initSelect = document.querySelector('select[disabled]')
  if (initSelect) watchSelect(initSelect)
})()