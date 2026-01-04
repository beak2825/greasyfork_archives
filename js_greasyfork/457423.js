// ==UserScript==
// @name         极致净化百度文库页
// @namespace    https://evgo2017.com/purify-page
// @version      0.1
// @description  完美阅读体验，去除广告、推荐等一系列和阅读无关的内容
// @author       evgo2017
// @match        https://wenku.baidu.com/view/*
// @icon         https://edu-wenku.bdimg.com/v1/pc/2020%E6%96%B0%E9%A6%96%E9%A1%B5/wenku-header-icon.svg
// @license      GNU GPLv2
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457423/%E6%9E%81%E8%87%B4%E5%87%80%E5%8C%96%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/457423/%E6%9E%81%E8%87%B4%E5%87%80%E5%8C%96%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const maxRetryCount = 5; // 最大重试次数

    // 移除区域
    remove("上方 header", `.new-header`)
    remove("左侧推荐文档集", `#app-left`)
    remove("右侧开通 VIP、排行榜、原创作者招募", `#app-right`)
    remove("阅读器右上角工具栏 - 阅读页换肤", `.top-bar-right`)
    remove("右上角工具栏 - 阅读页换肤", `.menubar`)
    remove("下方下载区域", `.tool-bar-wrap`)
    remove("阅读器内 - 内容推荐", `.hx-warp`, { repeat: true });
    remove("下方广告区域", `.hx-recom-wrapper`)
    remove("开通 VIP ", `.pc-cashier-card`)
    remove("下一篇", `.page-icon`)
    remove("版权信息", `.copyright-wrap`)
    remove("vip 弹出内容", `.vip-member-pop-content`)
    remove("全屏按钮", `.full-screen-icon`)

    setTimeout(() => {
      // 最大化阅读区域，style 有被重新设置，所以延迟执行
      const bodyDom = $(`#body`)
      let currentDom = $(`.reader-wrap`)
      while (currentDom !== bodyDom) {
        currentDom.style.width = '100%'
        currentDom.style.height = '100%'
        currentDom = currentDom.parentElement
      }
    }, 1000)

    addEventListener("展开全文 - 文字", `.read-all`, 'click', () => {
       removeHexWarps()
    })
    addEventListener("展开全文 - 图标", `.arrow`, 'click', () => {
       removeHexWarps()
    })
    function removeHexWarps() {
        console.log('已点开展开全文')
        setTimeout(() => {
            var doms = document.querySelectorAll(`.hx-warp`)
            console.log(doms)
            for (let i = 0, len = doms.length; i < len; i++) {
                doms[i].remove()
            }
        }, 1000);
    }

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
    function addEventListener(label, selector, event, callback = () => {}, userOption = {}, count = 1) {
       const option = Object.assign({ getDom: (dom) => dom }, userOption)
       const dom = option.getDom($(selector))
       if (dom) {
          dom.addEventListener(event, () => callback());
          console.log(`${label}，%c已添加 ${event} 事件%c。（第 ${count} 次处理）`, "color: red; font-weight: bold", "color: black")
       } else {
         if (count < maxRetryCount) {
           console.log(`${label}，未找到。（第 ${count} 次处理）`)
           setTimeout(() => { addEventListener(label, selector, event, callback, option, count + 1) }, 1000)
         } else {
           console.log(`${label}，%c停止查找%c。（第 ${count} 次处理）`, "color: orange; font-weight: bold", "color: black")
         }
       }
    }
    function $ (selector) {
        return document.querySelector(selector)
    }
})();