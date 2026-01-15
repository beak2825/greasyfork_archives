// ==UserScript==
// @name         极致净化 CSDN 文章页
// @namespace    https://evgo2017.com/purify-page
// @version      0.15.3
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

    const maxRetryCount = 10; // 最大重试次数

    switch (window.location.hostname) {
      default: {
        if (window.location.hostname.includes('blog.csdn.net')) {
            console.log('匹配到 CSDN 页面')
            remove('顶部导航', `#toolbarBox`)
            remove('边栏', `.blog_container_aside`, { isRemove: true })
            remove('右方广告', `#recommendAdBox`)
            remove('右方广告', `.gitcode-work-space`, { isRepeat: true })
            remove('右方广告', `#kp_box_530`)
            remove('右方分类专栏', `#recommend-right .kind_person`, { isRemove: true })
            remove('右方最新文章', `#asideArchive`)
            remove('下方推荐文章', `.recommend-box`, { isRemove: true, isRepeat: true })
            remove('新手引导、客服、举报、返回顶部', `.csdn-side-toolbar`, { isRemove: true })
            remove('觉得还不错？一键收藏', `.tool-active-list`, { isRemove: true })
            remove('登录弹窗', `.passport-login-tip-container`)
            // 最大化阅读区域
            $(`#mainBox`).style.width = 'calc(100% - 320px)'
            const mainArea = $(`main`)
            mainArea.style.float = 'none'
            mainArea.style.width = '100%'
            // 加载更多代码
            Array.from(document.querySelectorAll(`.look-more-preCode`)).forEach(i => i.click())
            // 加载更多评论
            const maxCount = 5
            lookMoreComment(maxCount)
            function lookMoreComment(count) {
              const dom =$('#lookGoodComment')
              if (dom != null && dom.style.display != 'none') {
                if (count < maxCount) { // 修复评论重复问题
                  $('.look-more-comment').click()
                }
                if (count > 0) { // 避免评论过多，一直加载
                  count--
                  setTimeout(() => { lookMoreComment(count) }, 1000)
                }
              } else {
                Array.from(document.querySelectorAll(`.second-look-more`)).forEach(i => i.click())
              }
            }
            // // 移动评论到下方
            $('#pcCommentBox').append($('.comment-list-container'))
        }
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