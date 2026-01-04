// ==UserScript==
// @name        去除 bilibili 专栏防复制,去除小尾巴
// @description 去除 bilibili 专栏防复制, 去除小尾巴,去除来源后缀,去除出处信息
// @namespace   userjs.cn
// @match       *://www.bilibili.com/read/*
// @match       *://www.bilibili.com/opus/*
// @grant       none
// @version     1.11
// @author      zio
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/414871/%E5%8E%BB%E9%99%A4%20bilibili%20%E4%B8%93%E6%A0%8F%E9%98%B2%E5%A4%8D%E5%88%B6%2C%E5%8E%BB%E9%99%A4%E5%B0%8F%E5%B0%BE%E5%B7%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/414871/%E5%8E%BB%E9%99%A4%20bilibili%20%E4%B8%93%E6%A0%8F%E9%98%B2%E5%A4%8D%E5%88%B6%2C%E5%8E%BB%E9%99%A4%E5%B0%8F%E5%B0%BE%E5%B7%B4.meta.js
// ==/UserScript==

;(function() {
  var $ = document.querySelector.bind(document)
  var $$ = document.querySelectorAll.bind(document)
  window.onload = function() {
      var unreprint = $('.unable-reprint')
      if (unreprint) {
        unreprint.style.userSelect = 'auto'
        unreprint.style['-webkit-user-select'] = 'auto'
      }

      // var article = $('div.article-holder')
      
      $$('*').forEach(item=> item.oncopy = e => e.stopPropagation())
  }
})()
