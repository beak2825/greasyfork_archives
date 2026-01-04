// ==UserScript==
// @name         游民星空-"你已经点过赞!"alert弹窗样式重写
// @namespace    http://tampermonkey.net/
// @version      2025-05-20 18:22
// @description  重复点赞后会alert弹窗提示"你已经点过赞!", 需要点击"确认"才能关闭, 现将其修改为持续3s的浮窗, 到期后自动消失无需点击
// @author       Ted19
// @match        *://*.gamersky.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamersky.com
// @grant        none
// @run-at      document-start
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/536596/%E6%B8%B8%E6%B0%91%E6%98%9F%E7%A9%BA-%22%E4%BD%A0%E5%B7%B2%E7%BB%8F%E7%82%B9%E8%BF%87%E8%B5%9E%21%22alert%E5%BC%B9%E7%AA%97%E6%A0%B7%E5%BC%8F%E9%87%8D%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/536596/%E6%B8%B8%E6%B0%91%E6%98%9F%E7%A9%BA-%22%E4%BD%A0%E5%B7%B2%E7%BB%8F%E7%82%B9%E8%BF%87%E8%B5%9E%21%22alert%E5%BC%B9%E7%AA%97%E6%A0%B7%E5%BC%8F%E9%87%8D%E5%86%99.meta.js
// ==/UserScript==

(function () {
  'use strict'

  // 创建浮窗容器
  const container               = document.createElement('div')
  container.style.position      = 'fixed'
  container.style.top           = '10px'
  container.style.left          = '50%'
  container.style.transform     = 'translateX(-50%)'
  container.style.display       = 'flex'
  container.style.flexDirection = 'column'
  container.style.alignItems    = 'center'
  container.style.zIndex        = '9999'
  container.style.pointerEvents = 'none'
  document.body.appendChild(container)

  // 当前浮窗列表
  const activePopups = []

  // 判断当前是否为暗色模式
  function isDarkMode () {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  // 创建单个浮窗
  function createPopup (message) {
    const popup       = document.createElement('div')
    popup.textContent = message

    // 基础样式
    popup.style.padding       = '4px 10px' // 缩小边距：上下4px，左右10px
    popup.style.marginTop     = '8px' // 紧凑垂直间距
    popup.style.borderRadius  = '4px'
    popup.style.boxShadow     = '0 2px 6px rgba(0,0,0,0.2)'
    popup.style.fontSize      = '12px' // 更小字体
    popup.style.transition    = 'all 0.3s ease-in-out'
    popup.style.opacity       = '0'
    popup.style.pointerEvents = 'auto'

    // 根据颜色模式设置背景和字体颜色
    if (isDarkMode()) {
      popup.style.background = '#000'
      popup.style.color      = '#fff'
    } else {
      popup.style.background = '#fff'
      popup.style.color      = '#000'
      popup.style.border     = '1px solid rgba(0, 0, 0, 0.1)'
    }

    // 插入浮窗并触发动画
    container.appendChild(popup)
    activePopups.push(popup)
    void popup.offsetWidth // 强制重绘
    popup.style.opacity = '1'

    // 定时销毁浮窗
    setTimeout(() => {
      popup.style.opacity   = '0'
      popup.style.marginTop = '0px'
      setTimeout(() => {
        container.removeChild(popup)
        const index = activePopups.indexOf(popup)
        if (index !== -1) {
          activePopups.splice(index, 1)
        }
        rearrangePopups()
      }, 300)
    }, 3000)
  }

  // 重新排列浮窗
  function rearrangePopups () {
    activePopups.forEach((popup, i) => {
      popup.style.marginTop = i === 0 ? '8px' : '8px'
    })
  }

  // 重写原生 alert 函数
  window.alert = function (message) {
    createPopup(String(message))
  }

  console.log('针对游民星空重写alert函数')
})()