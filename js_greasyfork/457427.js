// ==UserScript==
// @name         极致净化简书文章页
// @namespace    https://evgo2017.com/purify-page
// @version      0.12
// @description  完美阅读体验，去除广告、推荐等一系列和阅读无关的内容
// @author       evgo2017
// @license      GNU GPLv2
// @match        https://www.jianshu.com/p/*
// @icon         https://cdn2.jianshu.io/assets/favicons/favicon-e743bfb1821442341c3ab15bdbe804f7ad97676bd07a770ccc9483473aa76f06.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457427/%E6%9E%81%E8%87%B4%E5%87%80%E5%8C%96%E7%AE%80%E4%B9%A6%E6%96%87%E7%AB%A0%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/457427/%E6%9E%81%E8%87%B4%E5%87%80%E5%8C%96%E7%AE%80%E4%B9%A6%E6%96%87%E7%AB%A0%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const maxRetryCount = 5; // 最大重试次数

    setTimeout(() => {

        // 移除区域
        remove('顶部导航栏', `header`,{ repeat: true })
        remove('边栏', `aside`,{ repeat: true })
        remove('左侧分享', `._3Pnjry`,{ repeat: true })

        remove('下方点赞、文章分类', `._1kCBjS`)
        remove('更多精彩内容，就在简书APP、赞赏支持', `._13lIbp`)
        remove('下方作者信息', `.d0hShY`, { getDom: (dom) => { if (dom) { dom.innerHTML = ''; dom.style.padding = 0 } } })

        remove('下方广告', `._3VRLsv ._11TSfs`, { getDom: (dom) => { if (dom) { return dom.parentElement } }} )
        remove('下方广告', `._3VRLsv .adad_container`, { repeat: true })

        remove('好文要顶、关注我、收藏该文、文章分享', `footer`)
        remove('分类、上一篇下一篇', `#blog_post_info_block`)
        remove('专栏收入、推荐阅读', `#note-page-comment`, { getDom: (dom) => dom ? dom.nextSibling : null })
        remove('回到顶部', `.ant-back-top`, { repeat: true })

        removes('广告供应商', `.adModule`)

        remove('下方广告', `._3VRLsv`, { repeat: true, getDom: (dom) => {
            if (dom) {
                return [...dom.querySelectorAll('_gp-ck>.ouvJEz')].slice(1)
            }
        }})

        remove('悬浮广告窗', `html`, { repeat: true, getDom: (dom) => {
            if (dom) {
                return [...dom.querySelectorAll('body>div'), ...dom.querySelectorAll('body>div>div')].filter(d => {
                    return window.getComputedStyle(d, null).zIndex > 2147483640
                })
            }
        }})

        // 最大化阅读区域
        const mainArea = $('._3VRLsv')
        mainArea.style.boxSizing = 'border-box'
        mainArea.style.margin = '0'
        mainArea.style.width = '100%'
        $('._gp-ck').style.width = '100%'

        $('._2xr8G8').style.position = 'static'; // 评论点赞固定在最后，不 fixed
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
       const option = Object.assign({ repeat: false, getDom: (dom) => dom, }, userOption)
       const dom = option.getDom($(selector))
       if (dom && (Array.isArray(dom) ? dom.length > 0 : true )) {
          if (Array.isArray(dom)) {
              dom.forEach(d => d.remove())
          } else {
              dom.remove()
          }
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