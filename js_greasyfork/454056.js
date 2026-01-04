// ==UserScript==
// @name         video play util
// @namespace    https://gist.github.com/zqcccc/32eb827d35b8134f32f9dd3f70d9fb26
// @version      0.0.13
// @description  Universal video control, Control of the first video element of the page, advance and retract and multiply speed.
// @author       zqcccc
// @match        https://www.disneyplus.com/*
// @match        https://www.bilibili.com/video/*
// @match        https://jable.tv/videos/*
// @match        https://dsxys.live/player/*
// @match        https://web.telegram.org/k/*
// @match        https://www.youtube.com/watch*
// @match        https://kaiwu.lagou.com/*
// @match        https://ddys.pro/*
// @match        https://v.qq.com/x/*
// @match        https://frontendmasters.com/courses/*
// @include      /^https:\/\/ddys.+$/
// @match        https://www.youtube.com/*
// @match        https://www.iyf.tv/*
// @match        https://www.iole.tv/vodplay/*
// @match        https://sxyprn.com/post/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454056/video%20play%20util.user.js
// @updateURL https://update.greasyfork.org/scripts/454056/video%20play%20util.meta.js
// ==/UserScript==

; (function () {
  'use strict'

  let hasFirstInit = false
  let config = {
    selectVideoIndex: 0
  }

  function initConfig() {
    config = { selectVideoIndex: 0 }
  }

  function getVideoElement() {
    document.documentElement.background = '#fff'
    const videoElements = document.querySelectorAll('video')
    if (!hasFirstInit) {
      for (let i = 0; i < videoElements.length; i++) {
        const videoElement = videoElements[i]
        if (videoElement.src) {
          hasFirstInit = true
          config.selectVideoIndex = i
          break
        }
      }
    }
    return videoElements[config.selectVideoIndex] || window.$0 // chrome 自己指定
  }

  function adjustPlaybackRate(videoElement, change) {
    if (!videoElement) return
    // 计算新的播放速度并四舍五入到1位小数
    const newRate = Math.round((videoElement.playbackRate + change) * 10) / 10
    videoElement.playbackRate = newRate
  }

  function attachKeydownEvent() {

    let ClosureConfig = config
    function addEvent() {
      document.documentElement.addEventListener('keydown', keydownHandle)
    }
    function removeEvent() {
      document.documentElement.removeEventListener('keydown', keydownHandle)
    }

    function keydownHandle(e) {
      if (ClosureConfig !== config) {
        removeEvent()
        return
      }
      const videoElement = getVideoElement()
      if (!videoElement) removeEvent()
      switch (e.code) {
        case 'Period':
        case 'Quote':      // 单引号键
          videoElement.currentTime += 1
          break
        case 'Comma':
        case 'Semicolon':  // 分号键
          videoElement.currentTime -= 2
          break
        case 'Equal':
          adjustPlaybackRate(videoElement, 0.1)
          break
        case 'Minus':
          adjustPlaybackRate(videoElement, -0.1)
          break
        default:
          break
      }
    }

    let hasAddEvent = false
    function check() {
      const videoElement = getVideoElement()
      if (videoElement) {
        hasAddEvent = true
        emptyHandles()
        addEvent()
      }
    }

    let intervalTimes = 0
    const timer = setInterval(() => {
      if (hasAddEvent || intervalTimes >= 120) {
        clearInterval(timer)
      } else {
        check()
      }
      intervalTimes++
    }, 1000)
    return removeEvent
  }

  function observeVideo() {
    const v = getVideoElement()
    if (v) {
      const ob = new MutationObserver((mutations, observer) => {
        mutations.forEach((mut) => {
          console.log(
            '%c mut: ',
            'font-size:12px;background-color: #553E2E;color:#fff;',
            mut
          )
          if (mut.type === 'attributes' && mut.attributeName === 'src') {
            console.log('src changed')
            setTimeout(() => {
              emptyHandles()
              addRemove(attachKeydownEvent())
            }, 3000)
          }
        })
      })
      ob.observe(v, { attributes: true, attributeOldValue: true })
      return () => {
        ob.disconnect()
      }
    } else {
      console.log('no video element')
    }
  }

  var waitRemoveHandles = []
  function emptyHandles() {
    for (let i = waitRemoveHandles.length - 1; i >= 0; i--) {
      waitRemoveHandles.pop()?.()
    }
  }

  function insertPanel() {
    document.querySelector('#panel-control')?.remove()

    const panel = document.createElement('div')

    const videoElements = getVideoElements()

    panel.style.cssText = `
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
position: fixed;
z-index: 100;
width: 200px;
height: 200px;
background: rgba(0,0,0,0.4);
color: #fff;
`
    panel.style.left = '0'
    panel.style.top = '50vh'
    panel.draggable = 'true'
    panel.setAttribute('id', 'panel-control')

    panel.innerHTML = `<style>
    #panel-control {
      opacity: 0.1
    }
    #panel-control:hover {
      opacity: 1
    }
#panel-control button {
  background: rgba(0,0,0,0.3);
  border: none;
  color: #fff;
}
#refresh-panel {
  user-select: none;
  cursor: pointer;
  position: absolute;
  right: 10px;
  top: 10px;
}
</style>
<div class="info"></div>
  ${videoElements.map((videoElement, index) => `<button class="video-select" data-index="${index}">
    <div>${index}:</div>
    <div>${videoElement.src}</div>
  </button>`).join('')}
<button class="get-info">info</button>
<button class="add-speed">speed+0.1</button>
<button class="minus-speed">speed-0.1</button>
<button class="forward">+1s</button>
<button class="backward">-2s</button>
<button id="refresh-panel">↻</button>

`
    panel.querySelectorAll('.video-select').forEach((button, index) => {
      button.addEventListener('click', (e) => {
        // const index = Number(e.target.dataset.index)
        config.selectVideoIndex = index
        const videoElement = getVideoElement()
        if (videoElement) {
          panel.querySelector('.info').innerHTML = getVideoInfoText(videoElement)
        }
      }
      )
    })
    panel.querySelector('.get-info')?.addEventListener('click', () => {
      const video = getVideoElement()
      if (video) {
        const infoDiv = panel.querySelector('.info')
        infoDiv.innerHTML = getVideoInfoText(video)
      }
    })
    panel.querySelector('.add-speed')?.addEventListener('click', () => {
      const video = getVideoElement()
      video && adjustPlaybackRate(video, 0.1)
    })
    panel.querySelector('.minus-speed')?.addEventListener('click', () => {
      const video = getVideoElement()
      video && adjustPlaybackRate(video, -0.1)
    })
    panel.querySelector('.forward')?.addEventListener('click', () => {
      const video = getVideoElement()
      video && (video.currentTime += 1)
    })
    panel.querySelector('.backward')?.addEventListener('click', () => {
      const video = getVideoElement()
      video && (video.currentTime -= 2)
    })
    panel.querySelector('#refresh-panel')?.addEventListener('click', () => {
      init()
    })

    let canDrag = false,
      lastX,
      lastY,
      panelLeft,
      panelTop

    panel.addEventListener('dragstart', (e) => {
      canDrag = true
      lastX = e.pageX
      lastY = e.pageY
      const rect = panel.getBoundingClientRect()
      panelLeft = rect.left
      panelTop = rect.top
    })
    panel.addEventListener('drag', (e) => {
      if (canDrag) {
        const disX = e.pageX - lastX
        panel.style.left = panelLeft + disX + 'px'
        const disY = e.pageY - lastY
        panel.style.top = panelTop + disY + 'px'
      }
    })
    panel.addEventListener('dragend', () => (canDrag = false))
    panel.addEventListener('dragover', function (e) {
      e.preventDefault()
    })

    document.documentElement.appendChild(panel)
  }

  function addRemove(fn) {
    waitRemoveHandles.push(fn)
  }

  function getVideoElements() {
    const videos = document.querySelectorAll('video')
    return Array.from(videos)
  }

  function getVideoInfoText(video) {
    const { src, duration, currentTime, playbackRate } = video
    return `
    <div>src: ${src}</div>
    <div>playbackRate: ${playbackRate}</div>
    <div>duration: ${duration}</div>
    <div>currentTime: ${currentTime}</div>
    `
  }

  function init() {
    emptyHandles()
    initConfig()
    const cancel = observeVideo()
    addRemove(cancel)
    insertPanel()
    addRemove(attachKeydownEvent())
  }

  init()
  console.log('init player util')
  console.log('%c init player util: ', 'font-size:12px;background-color: #3F7CFF;color:#fff;', 'hello ')

})()
