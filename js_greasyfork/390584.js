// ==UserScript==
// @name         YUCHO AUTOCOMPLETE
// @namespace    https://ci7lus.github.io
// @version      0.4
// @description  ゆうちょダイレクト オートコンプリートスクリプト
// @author       ci7lus
// @match        https://*.jp-bank.japanpost.jp/*
// @grant        none
// @license      MIT
// @copyright    Copyright (c) 2020 ci7lus
// @downloadURL https://update.greasyfork.org/scripts/390584/YUCHO%20AUTOCOMPLETE.user.js
// @updateURL https://update.greasyfork.org/scripts/390584/YUCHO%20AUTOCOMPLETE.meta.js
// ==/UserScript==

;(function () {
  "use strict"
  if (!document.querySelector(`input[name="okyakusamaBangou1"]`)) return
  const dummyInput = document.createElement("input")
  dummyInput.type = "text"
  dummyInput.name = "username"
  dummyInput.autocomplete = true
  dummyInput.style = "width: 1px; height: 1px; top: 380px; left: 1rem;"
  dummyInput.addEventListener("change", (e) => {
    e.target.value.split("-").map((value, idx) => {
      document.querySelector(
        `input[name="okyakusamaBangou${idx + 1}"]`
      ).value = value
    })
  })
  document
    .querySelector(`form[name="submitData"]`)
    .insertAdjacentElement("beforeBegin", dummyInput)
})()
