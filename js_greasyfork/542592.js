// ==UserScript==
// @name         airaRetail custom UI
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Replace specific images with base64 versions on airaTrack login page
// @author       Alejandrocsdev
// @match        http://127.0.0.1:8082/*
// @include      http://192.168.10.*:8082/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=0.1
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542592/airaRetail%20custom%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/542592/airaRetail%20custom%20UI.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  const { hash, pathname } = location

  const isLoginPage = () => {
    return pathname === '/' && (hash === '#/' || hash.startsWith('#/?'))
  }

  const isZonePage = () => {
    return pathname === '/' && (hash === '#/zone' || hash.startsWith('#/?'))
  }

  const replaceImgs = () => {
    if (!isLoginPage()) return

    const hairImg = document.querySelector('img[src="/images/attribute/longhair.png"]')
    if (hairImg) {
      hairImg.src =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAoCAYAAABjPNNTAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAKaADAAQAAAABAAAAKAAAAAD9QK3vAAADLElEQVRYCe2W/XHbMAzF7V4HcDdgJ6g3qDpB0gnqbuANok4Qb2BngqQTKJ3A7gTSBnYncH9PAe4cRZFI+eOf5N09QwSBB5Aio4xG73hDOzA+dq37/T5D4wrKBjiBwgZW8Dd8GI/HO+xloeZgAWNQEnRzsQ4pNoG30LHlIYdq2ndxxPMUzmABHSUP4azNUkANrqGg5uYxBYnTAkooKG8akzcoBvF7VQElDCkixGuBKyio0aT8qFqI3kChhIMLkOsLLaIKxwapKejIYvPa4hDRjpYmFnVc2nRe+BBcmujyxeQAB1o6o8J2QHp7CmKlFEFoj3juJU43W+fu1Z1ibg2F7Hn2gJFEailEY9KJ1dEoLUeNtt5k/LnFLPp0P/QFMO9F/vTFUjQQowshW8EJ1EUJ2CYezfG1OdEcxzQZLKlqJh+OaSRjrN0OcMNn8LOsjQvmfbG4alRmtZBOxDTpIrs2JYrrtt4ypx1U7B38BgXZRxigzqB2Va9Z49MBwRUUZq7Ksy7GHBbQofM395hDi9/Pn8cueQg2KA9jBz0j5AVkJaxmmljiCF0FNA8XUFhCjYXeJj92CbfMZfj0SvXqH+BfuIr5N4yYioY2xCcjtUkvoP8Pf/pgoNViBS24EzEXp1PgiMmzN/npiOaSU1N30s/Ul+RKTwnB8v6l5Kc2WSGuM6Sb6a8rpd6VBT+mJCU1abf4zgrcpBRiUdfET2GFzkNKblKTJrwwqz/mP2KKEReI01dJ8EU+jU7xS4EcCrnr8awGHXP3t1mCdDRKC157jPnl7v1jPmQnR7wu7eYvK3hLoQLO4EQ+WZhB7Z6aCHADv8PTg0I5FPKmOj41VsI+6HNYL8A1GAdL6t1Jz3nVIrQysVlbkBVTswX077rsGuYwvJKn3Ra2bfNJPkTua6mn21nnMtaZDElCLcGmu2+ZSnMhVJhYpkyer228TFN6GY2O7/yzo9CMjLk4LrCzZB83tYaMozRjmgxWvTLrTSZ92iy3aTbmmDYnDsedTfI61JC4s6+NcoN+QFX/HvfjCw2DZWgys/N3brPoarJzJ0ncwapL4ERzl6hxolbfZc68A/8B8faXaVneiE0AAAAASUVORK5CYII='
    }

    const pantsImg = document.querySelector('img[src="/images/attribute/longpants.png"]')
    if (pantsImg) {
      pantsImg.src =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAoCAYAAABjPNNTAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAKaADAAQAAAABAAAAKAAAAAD9QK3vAAACbElEQVRYCe1X7VEbMRDFDP8DFaAS6CCkEighHWAqwB14UkFKsEuggxMVABU4T8e+sU7SSjqdnB+MNSPvaj/ePu+ebuYuLs7r3IFjBw6Hw2/sU68BBe6OVafa5fSYPP1MWvsaDeAWkbwWPr9WJ1jA/iP4qqjppJr8vxyzSeLZecIesNXx5Mgjzz3jfv6HxHNiUfoskgA3QFhjO0lwqLOWI2Ow/wLP6cRxenLVkDSSaSF3oj/j8XTnlrVBksU22E/Yy5eMBuKwdT9Yw1JUYNyPSF8/O9HXzbgAGASEwjSDeYkA2xBQpOtw2wLAuwe2bkOJs4B5jT142Ns4qtLigRTHjFg3xp3kDJCPuTLw+2PvQtIUChohF4oSUY5dJVlzu0duFbf5Rf6Eu/kr6M9yfhCpib04brSALEm0hO+uDw3AszN2LzZehDsvJqUS+0fK6WxZkvCzMIE0HGefxKKZzKE9l5v1lUhmkwMnyZBc4G4/9iSZYmGdEY+NcVJZVuxG8Xcd91gEY7ZasVZ7qZMnG+EcwiWSVVjeWyCMt2IwoWPOuQtJFGTH7ZziEsuLRowIohfJCLiWQM2rqkTSSDErUhNGHOwK4z5FUbvEwJwskczlpnwhyVTMbFtvkiEBki51cozTLmCJJME5tpAEz1rcWBxB9DM+lNm4WpIECcF5Jol3GnrKEsmltawA3C4B6kXSCIm3RjKcFCcygSmRZBJBJskdD8RnvQl0L5IEZzEWsaIYGlpkiWQtpkayNj8bd5X1Hp1bvMPUD6VjWKSxs+NXYeSNDSY2lT8fXlNJis0R2gc+i7PbNSuVX5N3jvleHfgH6ZqlqhlgwRsAAAAASUVORK5CYII='
    }
  }

  const replacCounts = () => {
    if (!isZonePage()) return

    const updateStatCount = className => {
      const statDiv = document.querySelector(`.${className}`)
      if (!statDiv) return

      const valueContainer = statDiv?.children[1]
      const originalSpan = valueContainer?.firstElementChild?.firstElementChild
      if (!originalSpan || originalSpan.tagName !== 'SPAN') return

      // Hide original
      originalSpan.style.display = 'none'

      // Avoid inserting multiple times
      const existing = valueContainer.querySelector('.custom-zero-span')
      if (existing) return

      // Create new span
      const fakeSpan = document.createElement('span')
      fakeSpan.textContent = '0'
      fakeSpan.className = 'custom-zero-span'

      // Apply your desired CSS
      fakeSpan.style.lineHeight = '1'
      fakeSpan.style.fontWeight = '600'
      fakeSpan.style.color = 'rgb(127 185 122 / var(--un-text-opacity))'
      fakeSpan.style.fontSize = '4rem'

      // Insert before 'ppl' span
      const pplSpan = originalSpan.parentElement.querySelector('span:nth-child(2)')
      originalSpan.parentElement.insertBefore(fakeSpan, pplSpan)
    }

    updateStatCount('stat-1') // Incoming Traffic
    updateStatCount('stat-2') // Zone Traffic
  }

  const observer = new MutationObserver(() => {
    replaceImgs()
    replacCounts()
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
})()
