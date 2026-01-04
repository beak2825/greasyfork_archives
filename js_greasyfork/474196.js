// ==UserScript==
// @name         华中师范网课刷题
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  华中师范大学刷题
// @author       You
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474196/%E5%8D%8E%E4%B8%AD%E5%B8%88%E8%8C%83%E7%BD%91%E8%AF%BE%E5%88%B7%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/474196/%E5%8D%8E%E4%B8%AD%E5%B8%88%E8%8C%83%E7%BD%91%E8%AF%BE%E5%88%B7%E9%A2%98.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  const host = document.location.host
  const BASE_URL = '0137.whxunw.com'
  let nextvideo = 0
  const video = getE('tm_video_html5_api')
  const modelMask = getE('layui-layer-shade1')
  const mask2 = getE('layui-layer1')

  function initvideo(host, BASE_URL) {
    if (host === BASE_URL) {
      video.muted = true
      modelMask.style.display = 'none'

      mask2.style.display = 'none'

      video.play()

      setInterval(() => {
        if (video.pause) {
          video.play()
        }
      }, 1000)
    }
  }
  function getE(id) {
    return document.getElementById(id)
  }
  function autoPlayVideo() {
    const mask1 = getE('layui-layer2')
    if (mask1 && mask1.style.display !== 'none') {
      window.location.reload()
    }
    const lessonItems = [...document.querySelectorAll('li[id^="lesson_"]')]
    lessonItems.forEach((i, k) => {
      if (i.className === 'on') {
        nextvideo = k + 1
        if (nextvideo === lessonItems.length) {
          video.removeEventListener('ended', autoPlayVideo)
        }
      }
    })

    console.log(lessonItems[nextvideo])
    lessonItems[nextvideo].click()
  }
  initvideo(host, BASE_URL)
  video.addEventListener('ended', autoPlayVideo)
  setTimeout(() => {
    location.reload()
  }, 5 * 60 * 1000)
  // Your code here...
})()
