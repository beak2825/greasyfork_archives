// ==UserScript==
// @name         TorLook Timer Zap
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  foo
// @author       BlankedyBlank
// @license      GNU GPLv3
// @match        https://*.torlook.info/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443016/TorLook%20Timer%20Zap.user.js
// @updateURL https://update.greasyfork.org/scripts/443016/TorLook%20Timer%20Zap.meta.js
// ==/UserScript==

function killTimer() {
    'use strict';

let t = document.getElementsByClassName('fancybox-is-open')
  if (t.length === 1) {
    for (let e of document.scripts) {
      if (e.outerText.includes("magnet:?")) {
        const url = e.outerText.match((/<a href='(magnet:\?.*)'>Download<\/a>/))[1]
        window.open(url)
        t[0].remove()
        document.body.setAttribute("style", "overflow:auto;")
      }
    }
  }
}

// I don't know how MutationObservers work
window.addEventListener('DOMNodeInserted', killTimer)