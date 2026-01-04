// ==UserScript==
// @author       Lete114
// @version      0.4
// @license      MIT License
// @name         CSDN 文章页绿化
// @description  (自用脚本) 绿化 CSDN 文章页面、支持手机端 CSDN 文章页绿化
// @match        https://blog.csdn.net/*/article/details/*
// @icon         https://g.csdnimg.cn/static/logo/favicon32.ico
// @namespace    https://github.com/Lete114/my-tampermonkey-scripts
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/464472/CSDN%20%E6%96%87%E7%AB%A0%E9%A1%B5%E7%BB%BF%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/464472/CSDN%20%E6%96%87%E7%AB%A0%E9%A1%B5%E7%BB%BF%E5%8C%96.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  const $ = (Selector, el) => (el || document).querySelector(Selector)
  const $$ = (Selector, el) => (el || document).querySelectorAll(Selector)
  const nullSpan = document.createElement('span')

  GM_addStyle(`
    /* 过滤文章页面的垃圾信息 */
    #asideHotArticle,
    #asideCategory,
    #asideNewComments,
    #asideNewNps,
    #asideArchive,
    #recommendNps,
    #treeSkill,
    .toolbar-advert,
    .programmer1Box,
    .hide-article-box,
    .weixin-shadowbox,
    .feed-Sign-weixin,
    span[data-href^='csdnapp://'],
    #operate,
    .readall_box,
    .btn_open_app_prompt_div { 
        display: none !important
    }
    /* 解除文章内容可读限制 */
    .article_content {
        height: unset !important
    }
    /* 解除代码块无法自由选中 */
    #content_views pre,
    #content_views pre>code { 
        -webkit-touch-callout: auto !important;
        -webkit-user-select: auto !important;
        -khtml-user-select: auto !important;
        -moz-user-select: auto !important;
        -ms-user-select: auto !important;
        user-select: auto !important;
    }
    `)

  // 优化文章侧边栏
  try {
    const aside = $('.blog_container_aside')
    if (aside) {
      // 重排侧边栏顺序
      aside.appendChild($('#asideSearchArticle') || nullSpan)
      aside.appendChild($('#asideProfile') || nullSpan)
      aside.appendChild($('#asidedirectory') || nullSpan)
      aside.appendChild($('#asideArchive') || nullSpan)
    }
  } catch (error) {
    console.log('优化文章侧边栏失败', error)
  }

  // 关闭登录弹窗
  try {
    const style = document.createElement('style')
    style.textContent = '.passport-login-container{display:none}'
    document.head.appendChild(style)
    const timer = setInterval(() => {
      const closeLogin = $('#passportbox>span')
      if (closeLogin) {
        clearInterval(timer)
        closeLogin.click()
        style.remove()
      }
    }, 500)
  } catch (error) {
    console.log('关闭登录弹窗失败', error)
  }

  // 免登录复制
  try {
    $$('pre').forEach((el) => {
      const code = $('code', el)
      code.setAttribute('onclick', 'mdcp.copyCode(event)')

      const attrKey = 'data-title'
      const attrValue = '免登录复制'
      // 修改复制按钮文字
      const observer = new MutationObserver((mutationList) => {
        mutationList.forEach((mutation) => {
          const target = mutation.target
          if (
            mutation.type === 'attributes' &&
            target.getAttribute(attrKey) === '登录后复制'
          )
            target.setAttribute(attrKey, attrValue)
        })
      })
      const btn = $('.hljs-button', el)
      btn.setAttribute(attrKey, attrValue)
      observer.observe(btn, { attributes: true })
    })
  } catch (error) {
    console.log('免登录复制失败', error)
  }

  // 链接跳转(避免打开 link.csdn.net)
  try {
    const content_views = $('#content_views')
    const clone = content_views.cloneNode()
    while (content_views.firstChild) clone.appendChild(content_views.firstChild)
    content_views.parentNode.replaceChild(clone, content_views)
    $$('#content_views a[href]').forEach((el) => {
      el.setAttribute('target', '_blank')
    })
  } catch (error) {
    console.log('链接跳转(避免打开 link.csdn.net)失败', error)
  }
})()
