// ==UserScript==
// @name         百度网盘倍速(自用)
// @namespace    URL
// @version      0.1
// @description  百度网盘倍速
// @author       flypig
// @include      https://pan.baidu.com/pfile/video*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/524365/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%80%8D%E9%80%9F%28%E8%87%AA%E7%94%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/524365/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E5%80%8D%E9%80%9F%28%E8%87%AA%E7%94%A8%29.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  let video

  // 等待视频元素加载完成
  function waitForVideo() {
    video = document.getElementsByTagName('video')[0]
    if (!video) {
      setTimeout(waitForVideo, 100) // 每隔100毫秒检查一次
      return
    }

    // 初始化倍速
    let playbackRate = 1

    // 更新倍速并显示提示
    function updatePlaybackRate(newRate) {
      playbackRate = newRate
      document.getElementsByTagName('video')[0].playbackRate = playbackRate
      showPlaybackRate()
    }

    // 在页面上显示当前倍速
    function showPlaybackRate() {
      const rateElement = document.createElement('div')
      rateElement.style.position = 'absolute'
      rateElement.style.top = '10px'
      rateElement.style.right = '10px'
      rateElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'
      rateElement.style.color = 'white'
      rateElement.style.padding = '5px'
      rateElement.style.borderRadius = '5px'
      rateElement.style.zIndex = '9999'
      rateElement.textContent = `当前倍速: ${playbackRate}x`
      document.body.appendChild(rateElement)
      setTimeout(() => {
        rateElement.remove()
      }, 2000) // 2秒后自动隐藏提示
    }

    // 监听按键事件
    document.addEventListener('keydown', function (event) {
      switch (event.key) {
        case 'z':
          updatePlaybackRate(playbackRate - 0.5)
          break
        case 'x':
          updatePlaybackRate(playbackRate + 0.5)
          break
        case 'c':
          updatePlaybackRate(1)
          break
      }
    })
  }

  // 定期检查 URL 参数变化
  let previousUrl = window.location.href
  setInterval(() => {
    if (window.location.href !== previousUrl) {
      previousUrl = window.location.href
      waitForVideo()
    }
  }, 1000) // 每隔1秒检查一次

  window.addEventListener('load', waitForVideo)
})()
