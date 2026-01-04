// ==UserScript==
// @name         京东页内跳转
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  京东在非商品详情页面打开超链接时在当前窗口显示,不打开新窗口，减少购物时打开的页面数量
// @author       Zkerhcy
// @include      *//*.jd.com/*
// @exclude      *//passport.jd.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371375/%E4%BA%AC%E4%B8%9C%E9%A1%B5%E5%86%85%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/371375/%E4%BA%AC%E4%B8%9C%E9%A1%B5%E5%86%85%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

;(function() {
  'use strict'
  $(function() {
    var url = window.location.host
    if (url.indexOf('item.jd.com') === -1) {
      $('a').each(function(index, element) {
        $(this).removeAttr('target')
      })
    }
  })
})()
