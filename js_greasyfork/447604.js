// ==UserScript==
// @name            B站URL清理（掩耳盗铃）
// @version         1.1.1.20230314
// @namespace       laster2800
// @author          Laster2800
// @description     清理B站 URL 中多余的内容——这种清理只是将 URL 中多余的部分简单隐藏起来，不会过分阻止其完成自身的使命
// @note            提供真实清理的脚本有很多，但本人认为不能以最坏的恶意来推测每一种设计（尽管 vd_source 确实已经被证实是会暴露分享者信息的邪恶设计），只不过在 URL 上添加各种奇奇怪怪的内容实在是太难看了，让 URL 在显示上更简洁才是该脚本的本意。
// @icon            https://www.bilibili.com/favicon.ico
// @homepageURL     https://greasyfork.org/zh-CN/scripts/447604
// @supportURL      https://greasyfork.org/zh-CN/scripts/447604/feedback
// @license         LGPL-3.0
// @noframes
// @include         *://*.bilibili.com/*
// @grant           none
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/447604/B%E7%AB%99URL%E6%B8%85%E7%90%86%EF%BC%88%E6%8E%A9%E8%80%B3%E7%9B%97%E9%93%83%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/447604/B%E7%AB%99URL%E6%B8%85%E7%90%86%EF%BC%88%E6%8E%A9%E8%80%B3%E7%9B%97%E9%93%83%EF%BC%89.meta.js
// ==/UserScript==

(function() {
  'use strict'

  let busy = false
  const rm = ['vd_source', 'spm_id_from']
  initUrlchangeEvent()

  clean()
  window.addEventListener('urlchange', clean)

  function clean() {
    if (busy) return
    busy = true
    let r = false
    const url = new URL(location.href)
    for (const k of rm) {
      r |= tryClean(url, k) // |= 不会短路
    }
    r && history.replaceState({}, null, url.href)
    busy = false
  }

  function tryClean(url, k) {
    const m = new RegExp(`^\\?((.*)&)?((?<=[?&])${k}(=[^&]*)?)(&(.+))?$`).exec(url.search)
    if (!m) return false
    let a = m[2] ?? ''
    const b = m[6] ?? ''
    if (a && b) {
      a += `&${b}`
    } else if (a || b) {
      a += b
    }
    url.search = a ? `?${a}` : ''
    return true
  }

  /**
   * @see UserscriptAPI.base.initUrlchangeEvent
   */
  function initUrlchangeEvent() {
    if (window[Symbol.for('onurlchange')] === undefined) {
      let url = new URL(location.href)
      const dispatchEvent = () => {
        const event = new CustomEvent('urlchange', {
          detail: { prev: url, curr: new URL(location.href) },
          bubbles: true,
        })
        url = event.detail.curr
        if (typeof window.onurlchange === 'function') {
          window.addEventListener('urlchange', window.onurlchange, { once: true })
        }
        document.dispatchEvent(event)
      }

      history.pushState = (f => (...args) => {
        const ret = Reflect.apply(f, history, args)
        dispatchEvent()
        return ret
      })(history.pushState)
      history.replaceState = (f => (...args) => {
        const ret = Reflect.apply(f, history, args)
        dispatchEvent()
        return ret
      })(history.replaceState)
      window.addEventListener('popstate', () => {
        dispatchEvent()
      })
      window[Symbol.for('onurlchange')] = true
    }
  }
})()

