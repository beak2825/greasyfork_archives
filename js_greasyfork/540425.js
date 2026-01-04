// ==UserScript==
// @name         CSK - Content Security Killer
// @namespace    http://tampermonkey.net/
// @version      2025-06-22
// @description  Have you ever wanted to experiment with JS on a website, and you can't because of CSP and TrustedHTML? Well now you can!
// @author       ZERO
// @include      http://*/*
// @include      https://*/*
// @include      http://localhost/*
// @include      http://10.*.*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540425/CSK%20-%20Content%20Security%20Killer.user.js
// @updateURL https://update.greasyfork.org/scripts/540425/CSK%20-%20Content%20Security%20Killer.meta.js
// ==/UserScript==

(function() {
  const proto = Element.prototype
  const originalInnerHTMLDesc = Object.getOwnPropertyDescriptor(proto, 'innerHTML')

  Object.defineProperty(proto, 'innerHTML', {
    configurable: true,
    enumerable: originalInnerHTMLDesc.enumerable,
    get() {
      return originalInnerHTMLDesc.get.call(this)
    },
    set(value) {
      const origSet = originalInnerHTMLDesc.set.bind(this)
      try {
        origSet(value)
      } catch {
        origSet(value)
      }
    },
  })

  window.addEventListener('DOMContentLoaded', () => {
    const metas = document.querySelectorAll('meta[http-equiv="Expires"]')
    metas.forEach(meta => meta.remove())
  })
})();
