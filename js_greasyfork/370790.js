// ==UserScript==
// @name         张鑫旭博客 清爽特别版
// @namespace    https://greasyfork.org/zh-CN/scripts/370790
// @version      0.8
// @author       zhenhappy<q505507538@gmail.com>
// @description  张鑫旭这小子上面广告各种动态生成, 相比一般的广告技术来说还是贼牛逼的, 一般的ADBlocker去不掉, 所以通过脚本一个个去掉了, 并且将正文宽度调整到最佳适合观看阅读的角度, 让你心无旁骛的投入到愉快学习当中
// @run-at       document-start
// @match        http*://www.zhangxinxu.com/**
// @require      https://unpkg.com/jquery/dist/jquery.slim.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/370790/%E5%BC%A0%E9%91%AB%E6%97%AD%E5%8D%9A%E5%AE%A2%20%E6%B8%85%E7%88%BD%E7%89%B9%E5%88%AB%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/370790/%E5%BC%A0%E9%91%AB%E6%97%AD%E5%8D%9A%E5%AE%A2%20%E6%B8%85%E7%88%BD%E7%89%B9%E5%88%AB%E7%89%88.meta.js
// ==/UserScript==

document.documentElement.style.display = 'none'

$(document).ready(() => {
  'use strict'

  $('#sidebar, .da_title, .da_col2, .link, .ins_txt, #daITxz2, .hd_remind, .description').remove()

  $('#content').css({
    'margin-left': '0',
    'margin-right': '0',
  })
  $('#content, #respond, .commentlist').css({
    'padding-left': '0',
    'padding-right': '0'
  })
  $('#content > .post, #respond, .commentlist').css({
    'margin-left': 'auto',
    'margin-right': 'auto',
    'width': '1440px',
    'max-width': '90%'
  })
  $('#entryNav').css('top', '150px')
  $(window).bind('scroll', () => {
    if ($(window).scrollTop() > 130) $('#entryNav').css('top', '20px')
    else $('#entryNav').css('top', (150 - $(window).scrollTop()) + 'px')
  })

  document.documentElement.style.display = ''
})
