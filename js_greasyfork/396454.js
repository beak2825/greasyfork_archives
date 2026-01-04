// ==UserScript==
// @name         Memrise, click answer by pressing key number
// @name:zh-TW   Memrise, 按數字鍵快速選答案
// @namespace    https://blog.newtchen.me/
// @version      1.0
// @description  Select the right answer by simply clicking Number key
// @description:zh-TW  用數字鍵選擇正確答案
// @author       YU-HSIN, CHEN
// @match        https://www.memrise.com/course/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/396454/Memrise%2C%20click%20answer%20by%20pressing%20key%20number.user.js
// @updateURL https://update.greasyfork.org/scripts/396454/Memrise%2C%20click%20answer%20by%20pressing%20key%20number.meta.js
// ==/UserScript==

(function () {
  'use strict'
  var KEYDOWN = 'keydown'

  function _getKeyNumber (e) {
    var keyNumber = Number(e.key)
    return isNaN(keyNumber) ? null : keyNumber
  }

  function _getChoiceId (keyNumber) {
    return '[data-choice-id="' + (keyNumber - 1) + '"]'
  }

  function keydownHandler (e) {
    var keyNumber = _getKeyNumber(e)
    if (keyNumber > 0 && keyNumber < 10) {
      document.querySelector(_getChoiceId(keyNumber)).click()
    }
  }

  document.addEventListener(KEYDOWN, keydownHandler)
})()
