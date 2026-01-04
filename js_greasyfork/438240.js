// ==UserScript==
// @name         unsubscribe jd collect
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动取关京东收藏!
// @author       You
// @match        https://t.jd.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/438240/unsubscribe%20jd%20collect.user.js
// @updateURL https://update.greasyfork.org/scripts/438240/unsubscribe%20jd%20collect.meta.js
// ==/UserScript==
;(function () {
  'use strict'

  let index = 0

  const href = location.href
  if (!/vender|product/.test(href)) {
    return
  }

  function start() {
    setTimeout(() => {
      const dom = document.querySelector('.batch-btn')
      click(dom)
    }, 2000)

    const nodeList = document.querySelectorAll('.i-check')
    setTimeout(() => {
      for (const item of nodeList) {
        item.click()
      }
      console.log('全选')
    }, 4000)

    setTimeout(() => {
      const dom = document.querySelector('.u-unfollow')
      click(dom)
      console.log('展示弹框')
    }, 6000)

    setTimeout(() => {
      const dom = document.querySelector('.ui-dialog-btn-submit')
      click(dom)
      console.log('确认取消')
    }, 8000)
  }
  start()

  function click(dom) {
    if (dom) {
      dom.click()
    }
  }
})()
