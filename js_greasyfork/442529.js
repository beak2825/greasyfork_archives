// ==UserScript==
// @name         哔哩哔哩B站播放结束自动跳过充电鸣谢
// @namespace    https://greasyfork.org/zh-CN/scripts
// @version      0.0.1
// @description  b站(bilibili)自动跳过充电鸣谢
// @author       cooper1x
// @match        *://*.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico?v=1
// @grant        none
// @license      cooper1x
// @downloadURL https://update.greasyfork.org/scripts/442529/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9B%E7%AB%99%E6%92%AD%E6%94%BE%E7%BB%93%E6%9D%9F%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%E5%85%85%E7%94%B5%E9%B8%A3%E8%B0%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/442529/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9B%E7%AB%99%E6%92%AD%E6%94%BE%E7%BB%93%E6%9D%9F%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%E5%85%85%E7%94%B5%E9%B8%A3%E8%B0%A2.meta.js
// ==/UserScript==

(function () {
  const bv = document.querySelector('bwp-video') || document.querySelector('video');
  if (bv) {
    bv.onended = () => {
      setTimeout(() => {
        document.querySelector('.bilibili-player-electric-panel-jump').click()
      }, 100)
    }
  }
})();