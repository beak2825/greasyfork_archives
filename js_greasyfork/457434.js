// ==UserScript==
// @name         极致净化 360 文档页
// @namespace    https://evgo2017.com/purify-page
// @version      0.11
// @description  完美阅读体验，去除广告、推荐等一系列和阅读无关的内容
// @author       evgo2017
// @license      GNU GPLv2
// @match        http://www.360doc.com/content/*
// @icon         http://www.360doc.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457434/%E6%9E%81%E8%87%B4%E5%87%80%E5%8C%96%20360%20%E6%96%87%E6%A1%A3%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/457434/%E6%9E%81%E8%87%B4%E5%87%80%E5%8C%96%20360%20%E6%96%87%E6%A1%A3%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const maxRetryCount = 5; // 最大重试次数

    // 移除区域
    remove('顶部导航', `.header`)
    remove('顶部浮窗导航', `.atfixednav`)
    remove('左侧微信扫一扫关注', `#floatqrcode_1`)
    remove('右侧导航', `#divad5`, { remove: (dom) => { if (dom) { dom.innerHTML = '' } } })
    remove('右侧导航', `.user_info`)
    remove('右侧导航', `.his_her`)
    remove('右侧导航', `#outerdivifartad1`)
    remove('右侧导航', `#recommendArt`)
    remove('右侧导航', `#recommendArtHot`)
    remove('右侧导航', `#recommendArtOrg`)
    remove('上一篇下一篇', `.zcomdiv`, { repeat: true })
    remove('用户公约', `#plgyDIV`)
    remove('底部推荐', `#divyoulikeadtitle`, { repeat: true, remove: (dom) => { if (dom) { dom.innerHTML = ''; } } })
    remove('底部推荐', `.ul-similar`, { repeat: true, remove: (dom) => { if (dom) { dom.innerHTML = ''; } } })
    remove('微信扫一扫', `#floatqrcode_2`)
    remove('顶部空白', `#arttopbdad`)
    remove('回到顶部', `#goTop2`)

    // 最大化阅读区域
    setTimeout(() => {
      $('.Question-mainColumn').style.minWidth = '1000px'

      const style = document.createElement('style')
      style.innerHTML = `.AnswerItem-authorInfo{ max-width: 100% }`
      $('head').appendChild(style);
    }, 1000)

    // Helper
    function removes(label, selector, userOption = {}, count = 1) {
       const option = Object.assign({ repeat: false }, userOption)
       const doms = document.querySelectorAll(selector)
       if (doms.length > 0) {
          for (let i = 0, len = doms.length; i < len; i++) {
              doms[i].remove()
              console.log(`${label}，%c已移除%c。（第 ${count} 次处理）`, "color: red; font-weight: bold", "color: black")
          }
          if (option.repeat) {
            setTimeout(() => { remove(label, selector, option, count + 1) }, 1000)
          }
       } else {
         if (count < maxRetryCount) {
           console.log(`${label}，未找到。（第 ${count} 次处理）`)
           setTimeout(() => { removes(label, selector, option, count + 1) }, 1000)
         } else {
           console.log(`${label}，%c停止查找%c。（第 ${count} 次处理）`, "color: orange; font-weight: bold", "color: black")
         }
       }
    }
    function remove(label, selector, userOption = {}, count = 1) {
       const option = Object.assign({ repeat: false, getDom: (dom) => dom, remove: (dom) => dom.remove() }, userOption)
       const dom = option.getDom($(selector))
       if (dom) {
          option.remove(dom)
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