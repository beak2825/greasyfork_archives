// ==UserScript==
// @name         PPT预览自动切换
// @namespace    http://tampermonkey.net/
// @version      0.63
// @description: PPT预览自动切换，触发鼠标点击事件，自动翻页
// @author       黄种鑫
// @match        *://*.oos.101.com/*
// @match        *://view.officeapps.live.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @description zh-CN PPT预览自动切换，触发鼠标点击事件，自动翻页
// @downloadURL https://update.greasyfork.org/scripts/431476/PPT%E9%A2%84%E8%A7%88%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/431476/PPT%E9%A2%84%E8%A7%88%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var isInFrame = Array.from(location.ancestorOrigins).reduce((prev, cur) => prev || !cur.includes('officeapps.live'), false)

  console.log('aaa' + (+new Date()))
  console.log('location.ancestorOrigins.length', location.ancestorOrigins.length)
  if (location.ancestorOrigins.length === (isInFrame ? 1 : 0)) {
    console.log('bbb' + (+new Date()))
    console.log('我是父页面')
    window.addEventListener('message', (e) => {
      console.log(e.data)
      // 母页面处理
      if (e.origin.includes('officeapps.live.com')) { // 子页面传过来的消息，转发到外部去
        console.log('父页面收到来自子页面的消息')
        if (isInFrame) {
          top.postMessage(e.data, '*')
        }
      } else { // 外部来的消息，转发到子页面去
        console.log('父页面收到财涛的消息')
        document.querySelector('#wacframe').contentWindow.postMessage(e.data, '*')
      }
    })

    return
  }

  var progress = 0
  var timerId
  var duration

  var sleep = (time) => {
      return new Promise(resolve => {
          setTimeout(resolve, time)
      })
  }

  async function init(afterClick = 0) {
    // 触发聚焦？？？
    document.querySelector('#SlidePanel').click()
    var curPage = +(document.querySelector('#SlideLabel-Medium14').innerText.match(/\d+/)[0] || 1)
    console.log('curPage', curPage)
    for (var i = 0; i < 100 * curPage; i++) {
      document.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 33 }))
    }
    for (var j = 0; j < afterClick; j++) {
      document.querySelector('#SlidePanel').click()
      await sleep(100)
    }
  }

  function runSubtitle() {
    progress = progress + 20 / duration
    if (progress <= 1) {
      var subtitle = document.querySelector('.subtitle')
      if (subtitle) {
        subtitle.style.setProperty('--progress', progress)
      } else {
        progress = Number.MAX_SAFE_INTEGER
      }
    } else {
      var oldDiv = document.querySelector('.subtitle-wrapper')
      if (oldDiv) {
        document.body.removeChild(oldDiv)
      }
      progress = 0
      clearInterval(timerId)
      timerId = undefined
    }
  }

  console.log('ccc' + (+new Date()))
  console.log('我是子页面')
  window.addEventListener('message', async (e) => {
    console.log('ddd' + (+new Date()))
    console.log(e.data)
    // 子页面处理
    if (e.data.eventName === 'init') {
      var initIndex = e.data.index
      await init(initIndex)
      top.postMessage({
        eventName: 'inited'
      }, '*')
    } else if (e.data.eventName === 'audio_start') {
      progress = 0
      duration = e.data.duration || 1
      var oldDiv = document.querySelector('.subtitle-wrapper')
      if (oldDiv) {
        document.body.removeChild(oldDiv)
      }
      var dialogue = e.data.dialogue || ''
      var div = document.createElement('div')
      div.setAttribute('class', 'subtitle-wrapper')
      var outerSpan = document.createElement('span')
      outerSpan.setAttribute('class', 'subtitle-outer')
      var span = document.createElement('span')
      span.setAttribute('class', 'subtitle')
      span.style.setProperty('--progress', progress)
      span.innerHTML = dialogue
      outerSpan.appendChild(span)
      div.appendChild(outerSpan)
      document.body.appendChild(div)
      clearInterval(timerId)
      timerId = setInterval(runSubtitle, 20)
    } else if (e.data.eventName === 'play') {
      var playStatus = e.data.playStatus
      if (playStatus) {
        clearInterval(timerId)
        timerId = setInterval(runSubtitle, 20)
      } else {
        clearInterval(timerId)
        timerId = undefined
      }
    } else if (e.data.eventName === 'stop') {
      var oldDiv = document.querySelector('.subtitle-wrapper')
      if (oldDiv) {
        document.body.removeChild(oldDiv)
      }
      progress = 0
      clearInterval(timerId)
      timerId = undefined
    } else if (e.data.eventName === 'click') {
      var clickIndex = e.data.index
      if (clickIndex) {
        init(clickIndex)
      } else {
        document.querySelector('#SlidePanel').click()
      }
    }
  })

  function addClass() {
    var subTitleWrapperCls = '.subtitle-wrapper{z-index:99999;position: absolute;width: 100vw;bottom: 50px;margin: 0 auto;text-align: center;}'
    var subTitleOuter = '.subtitle-outer{padding: 4px 10px;border-radius: 8px;font-size: 24px;word-break: break-all;background: rgb(204 204 204 / 50%);}@media screen and (max-width: 800px) {.subtitle-outer{padding: 2px 6px;font-size: 16px;}}'
    var subTitleCls = '.subtitle{--progress:0;color: transparent;line-height: 1.5;word-break: break-all;background: linear-gradient(90deg, red calc(var(--progress) * 100%), white calc(var(--progress) * 100%));background-clip: text;-webkit-background-clip: text;}'

    var style = document.createElement('style')
    style.innerHTML = subTitleWrapperCls + subTitleOuter + subTitleCls
    document.head.appendChild(style)
  }

  var timer = setInterval(() => {
    if (document.querySelector('#SlidePanel #scc')) {
      console.log('ppt 初始化成功')
      console.log('eee' + (+new Date()))
      top.postMessage({
        eventName: 'loaded'
      }, '*')
      addClass()
      clearInterval(timer)
    }
  }, 10)
})();