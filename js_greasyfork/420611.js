// ==UserScript==
// @name         Quora添加回到顶部按钮
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       夏2同学
// @match        https://www.quora.com/*
// @grant        none
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/420611/Quora%E6%B7%BB%E5%8A%A0%E5%9B%9E%E5%88%B0%E9%A1%B6%E9%83%A8%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/420611/Quora%E6%B7%BB%E5%8A%A0%E5%9B%9E%E5%88%B0%E9%A1%B6%E9%83%A8%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

;(function () {
  // Your code here...
  'use strict'
  // 以 HTML 创建新元素
  let topBtn = '<button class="topBtn" id="gotoTop">↑</button>'
  $('body').append(topBtn)
  $('.topBtn').css({
    position: 'fixed',
    bottom: '40px',
    right: '10%',
    'font-size':'20px',
    'z-index': '1000',
  })

  function gotoTop(minHeight) {
    // 获取页面的最小高度，无传入值则默认为600像素
    minHeight ? (minHeight = minHeight) : (minHeight = 600)
    // 为窗口的scroll事件绑定处理函数
    $(window).scroll(function () {
      // 获取窗口的滚动条的垂直滚动距离
      var s = $(window).scrollTop()
      // 当窗口的滚动条的垂直距离大于页面的最小高度时，让返回顶部图标渐现，否则渐隐
      if (s > minHeight) {
        $('#gotoTop').fadeIn(500)
      } else {
        $('#gotoTop').fadeOut(500)
      }
    })
  }
  gotoTop()

  // 点击回到顶部按钮
  $(document).on('click', '#gotoTop', function () {
    $('html,body').animate({ scrollTop: '0px' }, 'normal')
  })
})()
