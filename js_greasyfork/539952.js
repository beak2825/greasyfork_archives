// ==UserScript==
// @name         airaTrack auto credentials
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Autofills admin credentials on airaTrack login page running on localhost or LAN
// @author       Alejandrocsdev
// @match        https://127.0.0.1:8443/*
// @include      https://192.168.10.*:8443/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=0.1
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539952/airaTrack%20auto%20credentials.user.js
// @updateURL https://update.greasyfork.org/scripts/539952/airaTrack%20auto%20credentials.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  // console.log('🚀 Tampermonkey script started')

  const isLoginPage = () => {
    const { hash, pathname } = location
    if (pathname === '/' && (hash === '#/' || hash.startsWith('#/?'))) {
      return true
    }
  }

  const fillInputs = () => {
    if (!isLoginPage()) return

    const inputs = document.querySelectorAll('input')
    if (inputs.length === 2) {
      // Prevent refilling repeatedly
      if (inputs[0].value === 'Admin' && inputs[1].value === '123456') return

      inputs[0].value = 'Admin'
      inputs[1].value = '123456'

      inputs[0].dispatchEvent(new Event('input', { bubbles: true }))
      inputs[1].dispatchEvent(new Event('input', { bubbles: true }))

      // console.log('✅ Inputs filled')
    }
  }

  const observer = new MutationObserver(() => {
    fillInputs()
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
})()