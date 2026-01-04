// ==UserScript==
// @name         极致净化 CSDN 文章页
// @namespace    https://evgo2017.com/purify-page
// @version      0.15
// @description  完美阅读体验，去除广告、推荐等一系列和阅读无关的内容。优化评论，在文章下方全部显示。
// @author       evgo2017
// @license      GNU GPLv2
// @match        https://blog.csdn.net/*/article/details/*
// @match        https://*.blog.csdn.net/article/details/*
// @icon         https://g.csdnimg.cn/static/logo/favicon32.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457426/%E6%9E%81%E8%87%B4%E5%87%80%E5%8C%96%20CSDN%20%E6%96%87%E7%AB%A0%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/457426/%E6%9E%81%E8%87%B4%E5%87%80%E5%8C%96%20CSDN%20%E6%96%87%E7%AB%A0%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const maxRetryCount = 5; // 最大重试次数

    // 移除区域
    remove('顶部导航条', `#csdn-toolbar`)
    removes('专栏收录', `#blogColumnPayAdvert`)
    removes('内容广告', `.ad-wrap`)
    removes('右方推荐', `#recommendAdBox`)
    removes('右方最新文章', `#asideArchive`)
    removes('下方推荐文章', `.recommend-box`)
    removes('右方上方推广', `#recommend-right .programmer1Box`)
    removes('右方分类专栏', `#recommend-right .kind_person`)
    removes('下方广告', `.ad-box`)
    remove('下方相关推荐是否有帮助', `#recommendNps`)
    remove('下方主题信息', `.template-box`)
    remove('下方技能树', `#treeSkill`)
    remove('页面底部', `.blog-footer-bottom`)
    remove('边栏', `.blog_container_aside`)
    remove('新手引导、客服、举报、返回顶部', `.csdn-side-toolbar`)
    remove('社区收录', `#blogHuaweiyunAdvert`)
    remove('博客扩展', `#blogExtensionBox`)
    remove('下方广告', `#dmp_ad_58`)

    // 最大化阅读区域
    setTimeout(() => {
      $(`#mainBox`).style.width = 'calc(100% - 320px)'

      const mainArea = $(`main`)
      mainArea.style.float = 'none'
      mainArea.style.width = '100%'

      // 点赞取消 fixed
      const leftToolboxArea = $(`#toolBarBox .left-toolbox`)
      leftToolboxArea.style.position = 'relative'
      leftToolboxArea.style.left = 0
      leftToolboxArea.style.width = '100%'
      $(`#toolBarBox .left-toolbox .profile-box`).remove(); // 信息重复
      $(`#toolBarBox`).style.marginTop = '10px'
      $(`#toolBarBox`).id = ''

      lookMoreComment()

      // 加载所有需要更多代码
      Array.from(document.querySelectorAll(`.look-more-preCode`)).forEach(i => i.click())

      // 移动评论到下方
      $('#pcCommentBox').append($('.comment-list-container'))
      lookMoreComment()

    }, 1000)

    // Helper
    function lookMoreComment() {
      const dom =$('#lookGoodComment')
      if (dom != null && dom.style.display != 'none') {
        $('.look-more-comment').click()
        setTimeout(() => { lookMoreComment() }, 1000)
      } else {
        Array.from(document.querySelectorAll(`.second-look-more`)).forEach(i => i.click())
      }
    }
    function removes(label, selector, userOption = {}, count = 1) {
       const option = Object.assign({ repeat: false }, userOption)
       const doms = document.querySelectorAll(selector)
       console.log(doms)
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