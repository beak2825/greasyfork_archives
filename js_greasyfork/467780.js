// ==UserScript==
// @name         抖音直播精简
// @namespace    https://github.com/komomoo/dylive-prune
// @version      0.40
// @description  移除相关直播、移除礼物栏、移除用户进入直播间消息、移除粉丝牌&礼物弹幕、移除点赞动画、自动屏蔽礼物特效、移除顶栏客户端&快捷访问按钮、自动网页全屏、自动切原画画质。源代码https://github.com/komomoo/dylive-prune，欢迎pr👏
// @author       komo
// @match        https://live.douyin.com/*
// @icon         https://lf1-cdn-tos.bytegoofy.com/goofy/ies/douyin_web/public/favicon.ico
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/467780/%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E7%B2%BE%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/467780/%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E7%B2%BE%E7%AE%80.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  const css = `
  /* 移除礼物栏 */
  #BottomLayout{display: none !important;}
  .xg-inner-controls{bottom: 8px !important;}
  /* 移除相关直播 */
  .evLAq21m{display: none !important;}
  /* 网页全屏：全屏高度 */
  .EDvjMGPs.FKQqfehj{height:100% !important;}
  /* 弹幕区用户进入直播间消息 */
  .YqmICJp1, .webcast-chatroom___bottom-message{opacity:0 !important;}
  .Mv2estbj{display:none !important;}
  .Y0sC3Fms{display:none !important;}
  /* 粉丝牌&礼物弹幕 */
  .ZUGMpBcb{display:none !important;}
  /* 点赞动画 */
  #flutterLike{display:none !important;}
  /* 礼物特效栏 */
  .VLPIYL3T{display:none !important;}
  .gpFFz2G_{display:none !important;}
  /* 小黄车 */
  .x5oLQRf4{display:none !important;}
  `
  const style = document.createElement('style')
  style.appendChild(document.createTextNode(css))
  document.querySelector('head').append(style)

  // 点击关闭礼物按钮
  // function giftClickClose() {
  //   const giftBtnDom = '.xg-inner-controls > xg-right-grid > xg-icon:nth-child(5) > div > div:nth-child(2)'
  //   const target = document.querySelector('.basicPlayer')
  //   const observer = new MutationObserver((records) => {
  //     const giftBtn = document.querySelector(giftBtnDom)
  //     const giftBtnTxt = document.querySelector(
  //       '.xg-inner-controls > xg-right-grid > xg-icon:nth-child(5) div.WoNKVQmY.Z20k_Nsy'
  //     )
  //     if (giftBtn && giftBtnTxt?.textContent === '屏蔽礼物特效') {
  //       // console.log('---', giftBtn)
  //       giftBtn.click()
  //     } else if (giftBtnTxt?.textContent === '开启礼物特效') {
  //       observer.disconnect()
  //     }
  //   })
  //   observer.observe(target, { childList: true })
  // }
  // setTimeout(giftClickClose, 50)

  // 点击关闭礼物按钮
  function giftClick() {
    const giftBtn = document.querySelector(
      'div.douyin-player-controls > div > div.douyin-player-controls-right > slot:nth-child(5) > div > div:nth-child(2)'
    )
    const giftBtnTxt = document.querySelector(
      'div.douyin-player-controls > div > div.douyin-player-controls-right > slot:nth-child(5) > div > div.OwaHUR7p.M3rvLCL0'
    )
    console.log('------', giftBtnTxt?.textContent)
    if (giftBtn && giftBtnTxt?.textContent === '屏蔽礼物特效') {
      giftBtn.click()
    } else {
      setTimeout(giftClick, 1000)
    }
  }
  giftClick()

  // 网页全屏
  function fullClick() {
    const btn = document.querySelector(
      'div.douyin-player-controls > div > div.douyin-player-controls-right > slot:nth-child(2)'
    )
    if (btn) {
      btn.click()
    } else {
      setTimeout(fullClick, 1000)
    }
  }
  // fullClick()

  // 切原画
  function qualityClick() {
    const btnWrap = document.querySelector(
      'div.douyin-player-controls > div > div.douyin-player-controls-right > slot:nth-child(8) > div > div > div > div.N16rDtOa.vOEJT9B5 > div'
    )
    if (btnWrap) {
      btnWrap.querySelectorAll('.xMYYJi25').forEach((el) => {
        if (el.textContent.includes('原画')) el.click()
      })
    } else {
      setTimeout(qualityClick, 1000)
    }
  }
  setTimeout(qualityClick, 5000)
})()
