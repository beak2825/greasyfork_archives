// ==UserScript==
// @name         哔哩哔哩移除播放后推荐, 看视频自动宽屏
// @namespace    http://tampermonkey.net/
// @version      2024.11.28.6
// @description  移除播放后推荐, 看视频自动宽屏
// @author       太阳照常升起
// @license      MIT
// @match        http://*.bilibili.com/*
// @match        https://*.bilibili.com/*
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519047/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%A7%BB%E9%99%A4%E6%92%AD%E6%94%BE%E5%90%8E%E6%8E%A8%E8%8D%90%2C%20%E7%9C%8B%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E5%AE%BD%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/519047/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%A7%BB%E9%99%A4%E6%92%AD%E6%94%BE%E5%90%8E%E6%8E%A8%E8%8D%90%2C%20%E7%9C%8B%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E5%AE%BD%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
  'use strict'
  const $ = jQuery.noConflict(true)

  // 循环检查广告元素
  let adblockTipsInterval = setInterval(() => {
    const adblock_tips = $('.adblock-tips')
    if (adblock_tips.length > 0) {
      adblock_tips.remove()
      clearInterval(adblockTipsInterval)
    }
  }, 20)

  // 移除播放结束之后的推荐
  let bpxPlayerEndingWrapInterval = setInterval(() => {
    let bpx_player_ending_wrap = $('.bpx-player-ending-wrap')
    if (bpx_player_ending_wrap.length > 0) {
      bpx_player_ending_wrap.remove()
      clearInterval(bpxPlayerEndingWrapInterval)
    }
  }, 20)

  let lastSingleScroll = ''
  let lastCollaborationScroll = ''
  let widescreenPage = ''
  let widescreenAndScrollingInterval = setInterval(() => {
    if (!isVideoPage()) return

    // 单人视频滚动位置
    if (lastSingleScroll !== window.location.href && isSingleVideo()) {
      ScrollToTheAppropriatePosition()
      lastSingleScroll = window.location.href
    }

    // 合作视频滚动位置
    if (lastCollaborationScroll !== window.location.href && isCollaborationVideo()) {
      ScrollToTheAppropriatePosition()
      lastCollaborationScroll = window.location.href
    }

    // 点击宽屏
    let stateEntered = $('div[aria-label="宽屏"]')
    if (widescreenPage !== window.location.href && !stateEntered.hasClass('bpx-state-entered')) {
      stateEntered.click()
      setTimeout(ScrollToTheAppropriatePosition, 100)
    }

    // 开启成功
    if (stateEntered.hasClass('bpx-state-entered')) {
      widescreenPage = window.location.href
    }
  }, 100)

  /** 判断是否在视频页面 */
  function isVideoPage() {
    return window.location.href.startsWith('https://www.bilibili.com/video')
    // return /^https?:\/\/www.bilibili.com\/video/.test(window.location.href)
  }

  /** 提取 BV 号 */
  function extractBV(url) {
    const match = url.match(/\/(BV\w{10})\/?/)
    return match ? match[1] : null
  }

  /** 合作视频 */
  function isCollaborationVideo() {
    return $('div.members-info-container').length > 0
  }

  /** 单人视频 */
  function isSingleVideo() {
    return $('div.up-info-container').length > 0
  }

  /** 滚动到适当位置 */
  function ScrollToTheAppropriatePosition() {
    let scrollDistance = isCollaborationVideo() ? 120 : 80
    $(window).scrollTop(scrollDistance)
  }
})()