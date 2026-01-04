// ==UserScript==
// @name        ChatGPT ReadMode Alt+R
// @namespace   Violentmonkey Scripts
// @match       https://chat.openai.com/c/*
// @grant       none
// @version     1.0
// @author      -
// @description 5/29/2023, 10:32:31 AM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467499/ChatGPT%20ReadMode%20Alt%2BR.user.js
// @updateURL https://update.greasyfork.org/scripts/467499/ChatGPT%20ReadMode%20Alt%2BR.meta.js
// ==/UserScript==

let readMode = false
let sidebar, chatPane, formBlock

waitFor(isMainPresent).then(assignListener)

function waitFor(predicateFn) {
  return new Promise(resolve => {
    setTimeout(() => {
      const result = predicateFn()
      if (result) resolve(result)
      else waitFor(predicateFn).then(resolve)
    })
  })
}

function isMainPresent() {
  return document.querySelector('.w-full.h-full')
}

function assignListener(main) {
  [sideBar, chatPane] = main.children

  addEventListener('keydown', e => {
    if (e.key == 'r' && e.altKey) toggleReadMode()
  })
}

function toggleReadMode() {
  formBlock = chatPane.querySelector('.absolute.bottom-0')
  readMode = !readMode

  document.documentElement.style.fontSize = readMode ? '24px' : null
  sideBar.hidden = readMode
  if (formBlock) formBlock.hidden = readMode
}