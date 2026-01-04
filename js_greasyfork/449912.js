// ==UserScript==
// @name         阿里云盘多倍速播放
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  阿里云视频倍速播放增加了额外倍速的选择，增加的方式是在原有的倍速播放样式基础上增加，保证使用方便及样式统一
// @author       wenzheng.li
// @match        *://www.aliyundrive.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aliyundrive.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449912/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E5%A4%9A%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/449912/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E5%A4%9A%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
  'use strict';
  window.addEventListener('load', () => {
  const interval = setInterval(() => {
    const video = document.querySelector('video')
    const ul = document.querySelector('.drawer-list-grid--2S0tk')
    const close =
      ul.parentElement.parentElement.previousElementSibling.children.item(1)
    let firstChild = [...ul.children].find(
      (el) => el.firstChild.textContent === '1.5 倍'
    )
    const rates = ['3', '2.5', '2']
    rates.forEach((rate) => {
      const cloneNode = firstChild.cloneNode(true)
      cloneNode.firstChild.innerHTML = `${rate}倍`
      ul.insertBefore(cloneNode, firstChild)
      firstChild = cloneNode
    })
    const backRateNodes = [...ul.children]
    const changeSelectColor = (select) => {
      setTimeout(() => {
        backRateNodes.forEach((item) => {
          item.dataset.isCurrent = 'false'
        })
        if (!select.dataset.isCurrent) {
          select.parentElement.dataset.isCurrent = 'true'
        } else {
          select.dataset.isCurrent = 'true'
        }
        close.click()
      })
    }
    ul.addEventListener('click', (e) => {
      const target = e.target
      const PlaybackRate = target.textContent.replace('倍', '')
      video.playbackRate = PlaybackRate
      changeSelectColor(target)
    })

    if (video) {
      clearInterval(interval)
    }
  }, 1000)
  })
})();