// ==UserScript==
// @name         You bilibili
// @namespace    http://tampermonkey.net/
// @homepage     https://github.com/justforuse/chrome-extension-you-bilibili
// @version      0.3
// @description  Provide useful keyboard shortcuts for bilibili, for now is speed and subtitle control, like Youtube does.
// @author       Allen(https://github.com/justforuse)
// @include      http*://*bilibili.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450316/You%20bilibili.user.js
// @updateURL https://update.greasyfork.org/scripts/450316/You%20bilibili.meta.js
// ==/UserScript==

;(function () {
  const videoContainer = document.querySelector('#playerWrap .bpx-player-container')
  let video
  let isReady = false

  function loadCSS() {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.type = 'text/css'
    link.href = 'https://cdn.jsdelivr.net/gh/justforuse/chrome-extension-you-bilibili/after.css'
    const head = document.querySelector('head')
    head.appendChild(link, null)
  }

  loadCSS()

  function showSpeedToast() {
    const toast = document.createElement('div')
    toast.classList.add('ybl-speed-toast')

    toast.innerText = video.playbackRate + 'x'
    videoContainer.appendChild(toast)

    setTimeout(() => {
      videoContainer.removeChild(toast)
    }, 500)
  }

  function addKeyboardListener() {
    video = document.querySelector('video')
    if (!video) {
      video = document.querySelector('bwp-video')
    }
    console.dir(video)
    video.addEventListener('playing', () => {
      if (isReady) {
        return
      }
      isReady = true
      console.log('%c You bilibili is ready! ', 'background: #2395ba;')
      const subtitleBtn = document.querySelector(
        '.bpx-player-ctrl-subtitle .bpx-common-svg-icon'
      )
      const wideBtn = document.querySelector('.bpx-player-control-bottom .bpx-player-ctrl-wide')
      const webBtn = document.querySelector('.bpx-player-control-bottom .bpx-player-ctrl-web')
      console.log(subtitleBtn)
      document.addEventListener('keypress', (e) => {
        console.log(e)
        if (e.keyCode === 99) {
          // 'c' toggle caption
          subtitleBtn.click()
        } else if (e.keyCode === 62 && e.shiftKey) {
          // shift + > speed up
          video.playbackRate += 0.25
          showSpeedToast()
        } else if (e.keyCode === 60 && e.shiftKey) {
          // shift + < speed down
          if (video.playbackRate < 0.5) {
            return
          }
          video.playbackRate -= 0.25
          showSpeedToast()
        } else if (e.keyCode === 63 && e.shiftKey) {
          // shift + ? reset speeed
          video.playbackRate = 1
          showSpeedToast()
        } else if (e.keyCode === 70 && e.shiftKey) {
          // shift + f: toggle player web mode
          webBtn.click()
        } else if (e.keyCode === 87 && e.shiftKey) {
          // shift + w: toggle player wide mode
          wideBtn.click()
        }
      })
    })
    clearInterval(_interval)
  }

  let _interval = setInterval(function () {
    if (
      document.querySelector('.bili-comment') ||
      document.querySelector('.bb-comment')
    ) {
      addKeyboardListener()
    }
  }, 100)
})()
