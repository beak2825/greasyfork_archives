// ==UserScript==
// @name         显示 AV/BV
// @namespace    im.outv.userscript.bvav
// @version      1.0
// @description  在视频页显示 AV/BV 号
// @author       Outvi V
// @match        *://www.bilibili.com/*
// @match        *://bilibili.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442943/%E6%98%BE%E7%A4%BA%20AVBV.user.js
// @updateURL https://update.greasyfork.org/scripts/442943/%E6%98%BE%E7%A4%BA%20AVBV.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  const VBR_TRY_COUNT = 12
  const AV_SPAN_ID = '__bvav__span_av'
  const BV_SPAN_ID = '__bvav__span_bv'

  const Log = (...args) => console.log('[bvav]', ...args)

  function nowOrReady(cb) {
    if (document.readyState !== 'loading') {
      cb()
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        cb()
      })
    }
  }

  function sleep(ms) {
    return new Promise((r) => {
      setTimeout(() => {
        r()
      }, ms)
    })
  }

  function findOrCreateAndUpdateText(id, value) {
    let elem = document.querySelector('#' + id)
    if (!elem) {
      elem = document.createElement('span')
      elem.id = id
      elem.classList.add('a-crumbs')
      const ih = document.querySelector('.video-data')
      ih.appendChild(elem)
    }
    elem.innerText = value
  }

  function appendAvBv() {
    document
      .querySelector('.video-data')
      .lastElementChild.classList.add('a-crumbs')
    findOrCreateAndUpdateText(AV_SPAN_ID, 'av' + window.aid)
    findOrCreateAndUpdateText(BV_SPAN_ID, window.bvid)
  }

  // Monitor on hydration
  function setupBodyObserver() {
    const body = document.body
    Log('Monitoring changes of #app')
    const observer = new MutationObserver((muts) => {
      muts.map((x) => {
        if (x.addedNodes) {
          const nodes = [...x.addedNodes].filter((y) => y.id === 'app')
          if (nodes.length > 0) {
            Log('#app has changed, re-observing')
            setupObserver(nodes[nodes.length - 1])
          }
        }
      })
    })
    observer.observe(body, {
      childList: true,
    })
  }

  async function setupObserver(app) {
    let tries = 0
    let vbr = null
    while (vbr === null && tries < VBR_TRY_COUNT) {
      await sleep(800)
      vbr = app.querySelector('#viewbox_report')
      tries++
      if (tries > 0) Log('Still waiting for VBR')
    }
    if (tries > VBR_TRY_COUNT) {
      Log('Cannot find VBR, giving up')
      return
    }

    appendAvBv()

    const observer = new MutationObserver((muts) => {
      muts.map((x) => {
        if (x.target.tagName === 'H1') {
          appendAvBv()
          Log(x)
        }
      })
    })

    observer.observe(vbr, {
      subtree: true,
      attributes: true,
    })

    Log('Observing VBR:', vbr)
  }

  nowOrReady(() => {
    Log('Setting up...')
    setupObserver(document.querySelector('#app'))
    setupBodyObserver()
  })
})()
