// ==UserScript==
// @name         SMBC AUTOCOMPLETE
// @namespace    https://rokoucha.net
// @version      1.0.1
// @description  SMBCダイレクト オートコンプリートスクリプト
// @author       rokoucha
// @match        https://direct.smbc.co.jp/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/410187/SMBC%20AUTOCOMPLETE.user.js
// @updateURL https://update.greasyfork.org/scripts/410187/SMBC%20AUTOCOMPLETE.meta.js
// ==/UserScript==

(() => {
  "use strict"
  const form = document.querySelector('form[name="Login"]')
  if (form) {
    const dummyInput = document.createElement('input')
    dummyInput.type = 'text'
    dummyInput.name = 'username'
    dummyInput.autocomplete = 'email'
    //dummyInput.style = 'width: 1px;height: 1px;'
    dummyInput.addEventListener('change', (e) => e.target.value.split('-').map((value, idx) => {
      document.querySelector(`input[name="USRID${idx + 1}"]`).value = value
    }))
    form.insertBefore(dummyInput, document.getElementById('headerGroup'))
    dummyInput.focus()
    //form.insertAdjacentElement("beforeBegin", dummyInput)
  }
})()
