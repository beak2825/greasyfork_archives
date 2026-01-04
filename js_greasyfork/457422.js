// ==UserScript==
// @name         极致净化稀土掘金文章页
// @namespace    https://evgo2017.com/purify-page
// @version      0.11
// @description  完美阅读体验，去除广告、推荐等一系列和阅读无关的内容
// @author       evgo2017
// @match        https://juejin.cn/post/*
// @icon         https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/static/favicons/apple-touch-icon.png
// @license      GNU GPLv2
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457422/%E6%9E%81%E8%87%B4%E5%87%80%E5%8C%96%E7%A8%80%E5%9C%9F%E6%8E%98%E9%87%91%E6%96%87%E7%AB%A0%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/457422/%E6%9E%81%E8%87%B4%E5%87%80%E5%8C%96%E7%A8%80%E5%9C%9F%E6%8E%98%E9%87%91%E6%96%87%E7%AB%A0%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const maxRetryCount = 5; // 最大重试次数

    // 移除区域
    // 得逆向来，否则部分组件加载不出来
    remove("顶部导航条", `.main-header-box`, { repeat: true, remove: (dom) => { dom.style.display = "none" } }) // 移除后部分组件加载错误
    remove("右侧作者信息", `.author-block`, { repeat: true, remove: (dom) => { dom.innerHTML = ''; dom.style.padding = '0' } })
    remove("左侧点赞、推荐", `.article-suspended-panel`, { repeat: true })
    remove("右侧掘金会员广告", `img.banner`, { getDom: (dom) => dom ? dom.parentElement : null })
    remove("右侧广告", `.sidebar-bd-entry`)
    remove("右侧相关文章", `.related-entry-sidebar-block`)
    remove("右侧下一篇", `.next-article`)
    remove("页面固定掘金浏览器插件", `.extension`)
    remove("下方安装掘金浏览器插件", `.extension-banner`, { repeat: true })
    remove("下方课程推荐", `.category-course-recommend`)
    remove("下方相关推荐", `.recommended-area`)
    remove("下方友情链接", `.recommended-links`)
    remove("回到顶部、反馈", `.suspension-panel`)

    // Helper
    function remove(label, selector, userOption = {}, count = 1) {
       const option = Object.assign({ repeat: false, getDom: (dom) => dom, remove: (dom) => dom.remove() }, userOption)
       const dom = option.getDom(document.querySelector(selector))
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