// ==UserScript==
// @name               bilibili直播默认最高画质（自定义延迟执行时间）
// @description        bilibili直播默认切换为最高画质（自定义延迟执行时间）
// @namespace          https://github.com/PieJEed
// @version            1.0.2
// @author             PieJEed
// @match              *://live.bilibili.com/*
// @exclude            *://live.bilibili.com/p/*
// @icon               https://www.bilibili.com//favicon.ico
// @run-at             document-start
// @compatible         chrome
// @compatible         firefox
// @compatible         edge
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486988/bilibili%E7%9B%B4%E6%92%AD%E9%BB%98%E8%AE%A4%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8%EF%BC%88%E8%87%AA%E5%AE%9A%E4%B9%89%E5%BB%B6%E8%BF%9F%E6%89%A7%E8%A1%8C%E6%97%B6%E9%97%B4%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/486988/bilibili%E7%9B%B4%E6%92%AD%E9%BB%98%E8%AE%A4%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8%EF%BC%88%E8%87%AA%E5%AE%9A%E4%B9%89%E5%BB%B6%E8%BF%9F%E6%89%A7%E8%A1%8C%E6%97%B6%E9%97%B4%EF%BC%89.meta.js
// ==/UserScript==

//延迟加载时间：修改“delay”的值（单位为ms，默认4000）
const delay = 4000;

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
            window.setTimeout(process, delay)
            observer.disconnect()
          }
        })
      })
    })
    observer.observe(document, { childList: true, subtree: true })
  }

  live()
})()

// 此脚本是基于 [bilibili直播默认最高画质] 修改而来，遵循 MIT 协议。
// 原始脚本地址：[https://greasyfork.org/zh-CN/scripts/458957-bilibili%E7%9B%B4%E6%92%AD%E9%BB%98%E8%AE%A4%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8]

// 修改者：[PieJEed]
// 修改日期：[20240110]
// 修改内容：[为延迟加载时间添加变量；增加代码协议为 MIT ；修改脚本描述]