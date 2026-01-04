// ==UserScript==
// @name         去他喵的大会员彩色弹幕
// @description  将大会员彩色弹幕改回默认颜色或彻底屏蔽，由于屏蔽失效且原作者qianxu长时间未更新，故修改一版暂时使用，版权归原作者所有
// @author       shy0511
// @license MIT
// @version      1.1.1
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/list/*
// @match        https://www.bilibili.com/bangumi/play/*
// @icon         https://www.bilibili.com/favicon.ico
// @namespace    https://greasyfork.org/scripts/501945
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/501945/%E5%8E%BB%E4%BB%96%E5%96%B5%E7%9A%84%E5%A4%A7%E4%BC%9A%E5%91%98%E5%BD%A9%E8%89%B2%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/501945/%E5%8E%BB%E4%BB%96%E5%96%B5%E7%9A%84%E5%A4%A7%E4%BC%9A%E5%91%98%E5%BD%A9%E8%89%B2%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  // 读取配置
  const blockVipDm = GM_getValue('blockVipDm') // 是否彻底屏蔽大会员彩色弹幕
  const playerProfile = localStorage.getItem('bpx_player_profile') // 播放器配置

  // 注册菜单
  GM_registerMenuCommand(`${blockVipDm ? '"彻底屏蔽大会员彩色弹幕"' : '"保留大会员彩色弹幕内容"'} `, () => {
    if (blockVipDm) {
      GM_deleteValue('blockVipDm')
    } else {
      GM_setValue('blockVipDm', true)
    }
    location.reload()
  })

  // 配置样式
  const strokeType = JSON.parse(playerProfile)?.dmSetting?.fontborder || 0

  // 根据描边类型设置文本阴影
  const textShadow = (() => {
      if (strokeType === 1) return '0 0 1px #000,0 0 1px #000,0 0 1px #000' // 描边

      if (strokeType === 2) return '1px 1px 2px #000,0 0 1px #000' // 45° 投影

      return '1px 0 1px #000,0 1px 1px #000,0 -1px 1px #000,-1px 0 1px #000' // 重墨

  })()

  // 创建样式元素
  const styleElement = document.createElement('style')

  // 根据配置设置样式内容
  if (blockVipDm) {
    // 彻底屏蔽
    styleElement.innerHTML = '.bili-danmaku-x-dm-vip, .bili-dm-vip, .bili-danmaku-x-high-text {display:none} '
  } else {
    // 改回默认颜色
    styleElement.innerHTML = `.bili-danmaku-x-dm, .bili-dm, .bili-danmaku-x-high-text {--textShadow:${textShadow}}.bili-danmaku-x-dm-vip, .bili-dm-vip, .bili-danmaku-x-high-text {background-image:none !important;text-shadow:inherit !important}`
  }

  // 将样式元素添加到页面中
  document.body.appendChild(styleElement)
})()