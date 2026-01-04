// ==UserScript==
// @name         极致净化 CSDN 社区
// @namespace    https://evgo2017.com/purify-page
// @version      0.1
// @description  完美阅读体验，去除广告、推荐等一系列和阅读无关的内容
// @author       evgo2017
// @license      GNU GPLv2
// @match        https://bbs.csdn.net/topics/*
// @icon         https://g.csdnimg.cn/static/logo/favicon32.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457428/%E6%9E%81%E8%87%B4%E5%87%80%E5%8C%96%20CSDN%20%E7%A4%BE%E5%8C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/457428/%E6%9E%81%E8%87%B4%E5%87%80%E5%8C%96%20CSDN%20%E7%A4%BE%E5%8C%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const maxRetryCount = 5; // 最大重试次数

    // 移除区域
    remove('顶部导航栏', `.ccloud-tool-bar`)
    remove('右侧导航栏', `#right-floor-user-content_562`)
    remove('下方悬浮评论条', `.commentToolbar`)
    remove('右侧二维码、客服、返回顶部', `.csdn-side-toolbar`)
    remove('给本贴投票', `.rates-outer`)
    remove('下一篇', `.upDownPage`)
    remove('相关推荐', `.recommendList`)
    remove('页面底部', `.public_pc_right_footer2020`)

    // 最大化阅读区域
    setTimeout(() => {
      $(`.home_wrap`).style.paddingTop = '0'
      $(`.cloud-maintainer`).style.margin = '0'
      $(`.cloud-maintainer`).style.setProperty('width', '100%', 'important')
      $(`.detail-container`).style.setProperty('width', '100%', 'important')
      $(`html`).style.paddingRight = '17px'
    }, 1000)

    // Helper
    function remove(label, selector, userOption = {}, count = 1) {
       const option = Object.assign({ repeat: false, getDom: (dom) => dom, }, userOption)
       const dom = option.getDom($(selector))
       if (dom) {
          dom.remove()
          console.log(`${label}，%c已移除%c。（第 ${count} 次处理）`, "color: red; font-weight: bold", "color: black")
          if (option.repeat) {
            setTimeout(() => { remove(label, selector, option, count + 1) }, 1000)
          }
       } else {
         if (count < maxRetryCount) {
           console.log(`${label}，未找到。（第 ${count} 次处理）`)
           setTimeout(() => { remove(label, selector, option, count + 1) }, 1000)
         } else {
           console.log(`${label}，%c停止查找%c。（第 ${count} 次处理）`, "color: orange; font-weight: bold", "color: black")
         }
       }
    }
    function $ (selector) {
        return document.querySelector(selector)
    }
})();