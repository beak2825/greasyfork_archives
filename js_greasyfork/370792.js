// ==UserScript==
// @name         WEB前端开发博客 清爽特别版
// @namespace    https://greasyfork.org/zh-CN/scripts/370792
// @version      0.8
// @author       zhenhappy<q505507538@gmail.com>
// @description  最可恶的就是这个了, 整个页面全他妈的都是广告, 正文内容就那么一小丁点, 你让我是来看广告还是学习的, 果断都干掉
// @match        http*://www.css88.com/*
// @require      https://unpkg.com/jquery/dist/jquery.slim.min.js
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/370792/WEB%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91%E5%8D%9A%E5%AE%A2%20%E6%B8%85%E7%88%BD%E7%89%B9%E5%88%AB%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/370792/WEB%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91%E5%8D%9A%E5%AE%A2%20%E6%B8%85%E7%88%BD%E7%89%B9%E5%88%AB%E7%89%88.meta.js
// ==/UserScript==

document.documentElement.style.display = 'none'

$(document).ready(() => {
  const doc = $('a[href="http://www.css88.com/tags"]').parent()
  doc.empty()
  doc.attr('class', 'menu-item menu-item-type-taxonomy menu-item-object-category menu-item-has-children')
  doc.append('<a href="http://www.css88.com/nav/">前端中文文档</a>')
  doc.append('<ul class="sub-menu"></ul>')
  const subMenu = doc.children('.sub-menu')
  Array.prototype.forEach.call($('.container-tool > ul > li'), li => {
    const a = $(li).children().first()
    subMenu.append(`
      <li class="menu-item menu-item-type-taxonomy menu-item-object-category">
        <a href="${a.attr('href')}" style="width: 300px;">${a.text()}</a>
      </li>
    `)
  })
  subMenu.children().last().remove()
  $('#threebar, #secondary, .top-yideng-link, .basebreadcrumb, #home-page-widgets, .my-wallet, .related-wrap, .follow-wrap, .top-post-top-link, #site-navigation > ul > li:last-child').remove()
  document.documentElement.style.display = ''
})
