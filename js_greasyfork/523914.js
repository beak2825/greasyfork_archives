// ==UserScript==
// @name         coze.cn
// @namespace    http://tampermonkey.net/
// @version      2025.01.16
// @description  coze.cn 输入区域方法调整, 调整样式...
// @author       You
// @match        https://www.coze.cn/space/*/bot/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coze.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523914/cozecn.user.js
// @updateURL https://update.greasyfork.org/scripts/523914/cozecn.meta.js
// ==/UserScript==

(function() {
  'use strict'

  // 输入区域方法
  const containerInterval = setInterval(() => {
    const containerSelectors = 'div.wrapper-single--A0MD8isUfN0fw9n2m7o1'
    const element = document.querySelector(containerSelectors)
    if (element) {
      element.style.gridTemplateColumns = '1fr 2fr'
      clearInterval(containerInterval)
    }
  }, 100)

  // 输入框边框粗细调整
  const inputInterval = setInterval(() => {
    const inputSelectors = 'div.textarea-with-top-rows--yBP1oD_y3UMsrTDkIhsk'
    const element = document.querySelector(inputSelectors)
    if (element) {
      element.style.borderRadius = '100px'
      element.style.border = '2px solid #E9EBF2'
      clearInterval(inputInterval)
    }
  }, 100)

})()

