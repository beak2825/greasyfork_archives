// ==UserScript==
// @name               bilibili直播默认最高画质
// @name:zh-CN         bilibili直播默认最高画质
// @name:zh-TW         bilibili直播默認最高畫質
// @name:zh-HK         bilibili直播默認最高畫質
// @description        bilibili直播默认切换为最高画质
// @description:zh-CN  bilibili直播默认切换为最高画质
// @description:zh-TW  bilibili直播默認切換為最高畫質
// @description:zh-HK  bilibili直播默認切換為最高畫質
// @namespace          https://github.com/linkwanggo
// @version            2.2.0
// @author             linkwanggo
// @match              *://live.bilibili.com/*
// @exclude            *://live.bilibili.com/p/*
// @icon               https://www.bilibili.com//favicon.ico
// @run-at             document-start
// @compatible         chrome
// @compatible         firefox
// @compatible         edge
// @downloadURL https://update.greasyfork.org/scripts/458957/bilibili%E7%9B%B4%E6%92%AD%E9%BB%98%E8%AE%A4%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/458957/bilibili%E7%9B%B4%E6%92%AD%E9%BB%98%E8%AE%A4%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8.meta.js
// ==/UserScript==

;(function () {
  function process() {
    try {
      const livePlayer = document.querySelector('#live-player')
      livePlayer.dispatchEvent(new Event('mousemove'))
      const qualityWrap = livePlayer.querySelector('.quality-wrap')
      const observer = new MutationObserver(mutations => {
        mutations.some(mutation => {
          try {
            const qualities = mutation.target.querySelectorAll('.list-it')
            if (qualities.length) {
              qualities[0].click()
              livePlayer.dispatchEvent(new Event('mouseleave'))
              return true
            }
            return false
          } catch (e) {
            console.error(e)
            return false
          } finally {
            observer.disconnect()
          }
        })
      })
      observer.observe(qualityWrap, { childList: true, subtree: true })
      qualityWrap.dispatchEvent(new Event('mouseenter'))
    } catch (e) {
      console.error(e)
    }
  }

  function live() {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeName === 'VIDEO') {
            window.setTimeout(process, 600)
            observer.disconnect()
          }
        })
      })
    })
    observer.observe(document, { childList: true, subtree: true })
  }

  live()
})()
