// ==UserScript==
// @name         移除 Bilibili 推广广告卡片
// @description  移除 Bilibili 首页的左上角 banner、信息流里的推广卡片、视频播放页面右上角的推广卡片等广告
// @author       xuejianxianzun
// @version      1.8
// @namespace    saber.love
// @run-at       document-body
// @match        https://www.bilibili.com/*
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539675/%E7%A7%BB%E9%99%A4%20Bilibili%20%E6%8E%A8%E5%B9%BF%E5%B9%BF%E5%91%8A%E5%8D%A1%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/539675/%E7%A7%BB%E9%99%A4%20Bilibili%20%E6%8E%A8%E5%B9%BF%E5%B9%BF%E5%91%8A%E5%8D%A1%E7%89%87.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 对于有标记的广告元素，通过样式表隐藏，体验更好
  function addStyle () {
    const selectors = [
      // 移除左上角的切换 banner
      'div.recommended-swipe',
      // 首页推流的直播间
      'div.bili-live-card',
      // 卡片下方有几层阴影的，都是推流
      '.floor-single-card',
      // 视频页面里，评论区上方的广告横幅
      '.ad-floor-cover',
      '.ad-report',
      '.strip-ad',
      // 视频页面里，右侧弹幕列表下方的广告，会标注“广告”字样
      '#slide_ad',
      // 视频页面里，右侧弹幕列表下方的广告，有小火箭图标，经常看到些逆天的玩意
      '.video-card-ad-small',
      // 视频页面里，混在右侧视频列表里的游戏广告
      '.video-page-game-card-small',
    ]

    const style = document.createElement('style')
    style.textContent = `${selectors.join(',')}{display:none !important;}`
    document.body.append(style)
  }

  // 对于本身没有标记的广告，先查找子元素，再查找父元素（它所在的卡片）
  function removeAD () {
    if (document.hidden) {
      return
    }

    const childrenSelectors = [
      // 1. 小火箭图标
      'svg.bili-video-card__info--creative-ad',
      // 2. 小火箭图标
      'svg.vui_icon.bili-video-card__stats--icon',
      // 3. 标题前面带“广告”的，其“广告”二字的图标
      '.bili-video-card__info--ad',
      // 4. 图片右下角带“广告”二字的，看起来都是游戏。点击会尝试打开小程序
      // 它和视频卡片的不同之处在于：正常的视频卡片这里是一个 a 标签，而这种是 div
      'div.bili-video-card__image--link',
      // 5. 图片右下角带“广告”二字的，看起来都是游戏。点击会跳转到外部链接
      'a.bili-video-card__info--owner.disable-hover',
    ]
    childrenSelectors.forEach(selector => {
      const array = document.querySelectorAll(selector)
      for (const el of array) {
        const card = el.closest('.feed-card') || el.closest('.bili-video-card')
        if (card) {
          // console.log(card)
          // 使用定时器进入事件队列，等到页面上的同步代码执行完之后再移除这个卡片，否则会出现问题
          // 特别是首页第四个卡片固定是广告，如果不使用定时器（立即移除它），会导致从它开始显示错乱，每个卡片的图片和标题都对不上
          // 这应该是因为脚本先移除了卡片，之后 b 站渲染内容时会出错。所以延迟执行，等 b 站渲染完了再移除卡片，就不会出现问题了
          // 延迟时间目前是 100,。如果设置为 0 的话依然可能会出问题：虽然第四个卡片不会出问题，但如果后续又有广告卡片的话可能又会出现同样的问题
          // 目前用 100 延迟测试没问题
          window.setTimeout(() => {
            card.remove()
          }, 100)
          // card.style.border = "2px solid #f00"
        }
      }
    })
  }

  // 监听页面变化
  let timer
  function ob () {
    const observer = new MutationObserver(() => {
      window.clearTimeout(timer)
      timer = window.setTimeout(removeAD, 0)
    })
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  }

  addStyle()
  removeAD()
  ob()

})()
