// ==UserScript==
// @name         Merriam - Webster
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Tweak merriam-webster, inspired by Vocabulary script.
// @author       HW
// @match        https://www.merriam-webster.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386532/Merriam%20-%20Webster.user.js
// @updateURL https://update.greasyfork.org/scripts/386532/Merriam%20-%20Webster.meta.js
// ==/UserScript==

(function() {
    'use strict';

  // dictionary
  const input = document.querySelector('input#s-term')

  if (input) {
    input.blur()
    input.addEventListener('keydown', event => {
      // console.log(event.key)
      switch (event.key) {
        case 'Escape': {
          input.blur()
        }
      }
    })
  }

  document.body.addEventListener('keydown', event => {
    // console.log(event)
    if (event.target.nodeName === 'INPUT') return

    switch (event.key) {
      case 'o': {
        const audio = document.querySelector('a.play-pron')
        audio && audio.click()
        break
      }
      case 'i': {
        event.preventDefault()
        input.focus()
        input.value = ""
        break
      }
      case 'Backspace': {
        window.history.back()
        break
      }
    }
  })
})();