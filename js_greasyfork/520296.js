// ==UserScript==
// @name         Wechat Page Turner
// @namespace    https://kvoonme.netlify.app/
// @version      0.1.1
// @description  Better WeRead web page turning experience
// @author       Kevin Kwong
// @homepageURL  https://github.com/kvoon3/userscript-weread-page-turner
// @supportURL   https://github.com/kvoon3/userscript-weread-page-turner
// @match        https://weread.qq.com/web/reader/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weread.qq.com
// @grant        none
// @run-at       document-body
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520296/Wechat%20Page%20Turner.user.js
// @updateURL https://update.greasyfork.org/scripts/520296/Wechat%20Page%20Turner.meta.js
// ==/UserScript==

(function () {
  'use strict'

  let prevButton = null
  let nextButton = null

  function prev() {
    const isReading = !document.querySelector('.wr_mask_Show')

    if (!isReading)
      return

    if(!prevButton)
      prevButton = document.querySelector('.renderTarget_pager_button:not(.renderTarget_pager_button_right)')

    prevButton.click()
  }

  function next() {
    const isReading = !document.querySelector('.wr_mask_Show')

    if (!isReading)
      return


    if(!nextButton)
      nextButton = document.querySelector('.renderTarget_pager_button.renderTarget_pager_button_right')

    nextButton.click()
  }

  document.addEventListener('wheel', (e) => {
    e.preventDefault()

     e.deltaY > 0 ? next() : prev()
  }, { passive: false })

  document.addEventListener('keydown', ({ key }) => {
    ['k', 'l'].includes(key) && next();
    ['j', 'h'].includes(key) && prev()
  })
})()