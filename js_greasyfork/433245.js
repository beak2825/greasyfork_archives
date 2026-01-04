// ==UserScript==
// @name         Zoom Prefer Web
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Zoomのディープリンク画面で即Webで参加ボタンを出すようにする
// @author       ci7lus
// @match        https://zoom.us/j/*
// @icon         https://www.google.com/s2/favicons?domain=zoom.us
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/433245/Zoom%20Prefer%20Web.user.js
// @updateURL https://update.greasyfork.org/scripts/433245/Zoom%20Prefer%20Web.meta.js
// ==/UserScript==

;(async function () {
  "use strict"
  while (true) {
    const button = document.querySelector("div[role='button']")
    if (button) {
      button.click()
      break
    }
    await new Promise((res) => setTimeout(() => res(), 500))
  }
})()
