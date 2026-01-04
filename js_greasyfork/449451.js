// ==UserScript==
// @name         虎牙极简界面
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  简单又优雅的界面，去除不必要的元素和广告，增加空格快捷键：按空格即可控制播放与暂停
// @author       You
// @match        https://www.huya.com/*
// @icon         https://www.google.com/s2/favicons?domain=huya.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449451/%E8%99%8E%E7%89%99%E6%9E%81%E7%AE%80%E7%95%8C%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/449451/%E8%99%8E%E7%89%99%E6%9E%81%E7%AE%80%E7%95%8C%E9%9D%A2.meta.js
// ==/UserScript==
  // player-videotype-list
  // player-box-stat3
(function() {
  'use strict';

  const selector = value => document.querySelector(value)
  const selectotAll = value => document.querySelectorAll(value)

  // 增加播放快捷键
  window.onkeydown = (event) => {
    if (event.keyCode === 32) {
      selector('#player-btn').click()
      event.preventDefault();
    }
  }

  // 移除不必要的页面元素
  const removeNodesFunc = (nodes) => {
    nodes.forEach(node => {
      document.querySelector(node)?.remove()
    })
  }

  // 移除广告弹窗
  const removeAds = () => {
    const removeNodes = ['.room-gg-chat', '.room-mod-ggTop', '.banner-ab-warp']
    removeNodesFunc(removeNodes)
    // 移除所有的iframe
    selectotAll('iframe').forEach(iframe => iframe.remove())
  }
  
  setInterval(() => {
    removeAds()
  }, 1000);

  // 切换最高清晰度
  const swtichQuality = () => {
    const ul = document.querySelector('.player-videotype-list')
    if (ul) {
      const firstLi = ul.firstElementChild
      // 切换到最高清画质
      firstLi.click()
    }
  }

  // 将header以及播放室移到body中，删除#root元素
  const purify = () => {
    document.body.setAttribute('style', 'overflow: auto')
    document.body.appendChild(selector('#duya-header'))
    document.body.appendChild(selector('.room-core'))
    selector('.room-core').
    setAttribute('style', 'position: absolute; top: 60px !important; overflow: auto;')
    selector('#root').remove()
    setTimeout(() => {
      clearTool()
    }, 3000)
  }

  // 清除不必要的工具
  const clearTool = () => {
    const unUseTool = [
      // 工具栏右边工具
      '.player-gift-right',
      '#player-face',
      '#week-star-btn',
      '#diy-pet-icon',
      // 工具栏左边魔法学院
      '#diy-activity-icon-13833',
      // 秘法寻宝
      '#front-4a0mhq51_web_video_com',
      // 贵族周福利
      '#diy-activity-icon-13889',
      // 更多悬浮窗箭头
      '.player-arrow-down',
    ]
    removeNodesFunc(unUseTool)
     selector('.more-attivity-panel').
     setAttribute('style', 'left: -64px !important; width: 240px !important;')
  }

  setTimeout(() => {
    swtichQuality()
    purify()
    onVideoPlay()
  }, 2000);

})();