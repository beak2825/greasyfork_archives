// ==UserScript==
// @name        devdocs.io - Do not auto focus input
// @namespace   Violentmonkey Scripts
// @match       https://devdocs.io/*
// @grant       none
// @version     1.0
// @author      -
// @license     MIT
// @description 7/27/2024, 9:54:04 AM
// @downloadURL https://update.greasyfork.org/scripts/501882/devdocsio%20-%20Do%20not%20auto%20focus%20input.user.js
// @updateURL https://update.greasyfork.org/scripts/501882/devdocsio%20-%20Do%20not%20auto%20focus%20input.meta.js
// ==/UserScript==

const $input = document.querySelector('input[search]') ?? document.querySelector('input._search-input')

if ($input) {
  let allowFocus = false
  $input.addEventListener('mousedown', () => {
    allowFocus = true
    setTimeout(() => {
      allowFocus = false
    }, 0)
  })
  $input.addEventListener('keydown', () => {
    allowFocus = true
    setTimeout(() => {
      allowFocus = false
    }, 0)
  })

  $input.addEventListener('focus', (e) => {
    if (!allowFocus) {
      e.target.blur()
    }
    allowFocus = false
  })
}
