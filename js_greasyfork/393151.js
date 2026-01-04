// ==UserScript==
// @name        b站自动宽屏
// @author      Huu Lane
// @description auto enable theater mode in bilibili.
// @version     3.0.0
// @include     *://www.bilibili.com/video/*
// @namespace nobody_space
// @downloadURL https://update.greasyfork.org/scripts/393151/b%E7%AB%99%E8%87%AA%E5%8A%A8%E5%AE%BD%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/393151/b%E7%AB%99%E8%87%AA%E5%8A%A8%E5%AE%BD%E5%B1%8F.meta.js
// ==/UserScript==

;(async function () {
  // prevent space bar from scrolling page
  window.addEventListener('keydown', function (e) {
    if (e.code === 'Space' && e.target == document.body) {
      e.preventDefault()
    }
  })

  const sleep = function * (sec) {
    while (true) {
      yield new Promise(res => setTimeout(res, sec * 1000))
    }
  }

  for await (const __ of sleep(0.5)) {
    const box = document.querySelector(
      '.bilibili-player-video-control-bottom-right',
    )
    const btn = box.querySelector('.bilibili-player-video-btn-widescreen')
    if (btn) {
      btn.click()
      break
    }
  }
})()
