// ==UserScript==
// @name         极致净化百度文库页
// @namespace    https://evgo2017.com/purify-page
// @version      0.1.3
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

    const maxRetryCount = 10; // 最大重试次数

    switch (window.location.hostname) {
      case 'wenku.baidu.com': {
        console.log('匹配到 百度文库 页面')
        remove("上方 header", `.new-header`, { isRemove: true })
        remove("左侧推荐文档集", `#app-left`, { isRemove: true })
        remove("右侧开通 VIP、排行榜、原创作者招募", `#app-right`, { isRemove: true })
        remove("阅读器右上角工具栏 - 阅读页换肤", `.top-bar-right`, { isRemove: true })
        remove("右上角工具栏 - 阅读页换肤", `.menubar`, { isRemove: true })
        remove("下方下载区域", `.tool-bar-wrap`, { isRemove: true })
        remove("阅读器内 - 内容推荐", `.hx-warp`, { isRemove: true, isRepeat: true });
        remove("下方广告区域", `.hx-recom-wrapper`, { isRemove: true })
        remove("开通 VIP ", `.pc-cashier-card`, { isRemove: true })
        remove("下一篇", `.page-icon`, { isRemove: true })
        remove("版权信息", `.copyright-wrap`, { isRemove: true })
        remove("vip 弹出内容", `.vip-member-pop-content`, { isRemove: true })
        remove("全屏按钮", `.full-screen-icon`, { isRemove: true })
        remove('下一篇推荐', `.pcstep-foot-pagination`, { isRemove: true })
        remove('文章推荐', `.contract-wrap`, { isRemove: true })
        // 最大化阅读区域，style 有被重新设置，所以延迟执行
        setTimeout(() => {
            const bodyDom = $(`#body`)
            let currentDom = $(`.reader-wrap`)
            while (currentDom !== bodyDom) {
              currentDom.style.width = '100%'
              currentDom.style.height = '100%'
              currentDom = currentDom.parentElement
            }
        }, 1000);
        break
      }
    }

    // Helper
    function remove(label, selector, option, count = 1) {
       const dom = document.querySelector(selector)
       if (dom) {
          option = Object.assign({ isClick: false, isRemove: false, isRepeat: false }, option)
          if (option.isClick) {
            dom.click()
          } else if (option.isRemove) {
            dom.remove()
          } else {
            dom.style.display = 'none'
          }
          if (option.isRepeat && count <= maxRetryCount) {
           setTimeout(() => { remove(label, selector, option, count + 1) }, 1000)
          }
          console.log(`${label}，%c已移除%c。（第 ${count} 次处理）`, "color: red; font-weight: bold", "color: black")
       } else {
         if (count <= maxRetryCount) {
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