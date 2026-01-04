// ==UserScript==
// @name         Android Favicons
// @description  Convert Apple specific favicons to Android
// @match        *://*/*
// @exclude      https://my.nextdns.io/*
// @grant        none
// @run-at       document-end
// @version 0.0.1.20240619103134
// @namespace https://greasyfork.org/users/1312904
// @downloadURL https://update.greasyfork.org/scripts/498349/Android%20Favicons.user.js
// @updateURL https://update.greasyfork.org/scripts/498349/Android%20Favicons.meta.js
// ==/UserScript==

new Promise(() => {
  const sel = 'link[rel="apple-touch-icon"]'
  new MutationObserver((_, observer) => {
    if (document.querySelector(sel)) {
      observer.disconnect();
      document.querySelectorAll(sel).forEach(el => el.rel = 'icon')
    }
  }).observe(document.body, {
    childList: true,
    subtree: true
  })
})

