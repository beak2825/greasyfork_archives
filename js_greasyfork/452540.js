// ==UserScript==
// @name         bilibili/huya自动屏幕全屏原画Pro
// @namespace    http://tampermonkey.net/
// @version      2.0.7
// @description  bilibili/huya 1s后自动屏幕全屏原画Pro
// @author       wj
// @match        https://www.huya.com/**
// @match        https://www.huya.com/*
// @match        https://live.bilibili.com/**
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452540/bilibilihuya%E8%87%AA%E5%8A%A8%E5%B1%8F%E5%B9%95%E5%85%A8%E5%B1%8F%E5%8E%9F%E7%94%BBPro.user.js
// @updateURL https://update.greasyfork.org/scripts/452540/bilibilihuya%E8%87%AA%E5%8A%A8%E5%B1%8F%E5%B9%95%E5%85%A8%E5%B1%8F%E5%8E%9F%E7%94%BBPro.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  function pageOnload(targetNode, cb) {
    // 创建一个观察器实例并传入回调函数
    const observer = new MutationObserver(cb)

    // 以上述配置开始观察目标节点
    observer.observe(targetNode, { childList: true })
  }

  // Your code here...
  /* ---------- BILIBILI ------------- */
  // 改画质
  function BiLiPlayerQuality() {
    const ele = document.getElementById('live-player')
    const mousemove = new Event('mousemove')
    ele.dispatchEvent(mousemove)

    const qualityBtn = document.querySelector('.quality-wrap.svelte-73epzt')
    const mouseenter = new Event('mouseenter')
    qualityBtn.dispatchEvent(mouseenter)
    setTimeout(() => {
      const proBtn = document.querySelectorAll('.quality-it.svelte-73epzt')[0]
      proBtn.click()
      BiLiAutoOpen()
    }, 1000)
  }
  // 自动屏幕全屏
  function BiLiAutoOpen() {
    if (document.body.className === 'supportWebp player-full-win over-hidden') {
      return
    }
    const ele = document.getElementById('live-player')
    const ev = new Event('dblclick')
    ele.dispatchEvent(ev)
  }
  function BILI() {
    pageOnload(document.body, BiLiPlayerQuality)
  }
  /* ---------- 虎牙 ------------- */
  // 改画质
  function HYPlayerQuality() {
    document.getElementById('player-fullpage-btn').click()
  }
  // 自动屏幕全屏
  function HYAutoOpen() {
    document.querySelectorAll('.player-videotype-list li')[0].click()
  }
  function HY() {
    HYAutoOpen()
    HYPlayerQuality()
  }

  // 执行
  window.addEventListener('load', () => {
    const currentUrl = window.location.host
    console.log({ currentUrl })
    switch (currentUrl) {
      case 'www.huya.com':
        HY()
        break
      case 'live.bilibili.com':
        BILI()
        break
      case 'www.douyu.com': {
        // DY()
        break
      }
    }
  })
})()
