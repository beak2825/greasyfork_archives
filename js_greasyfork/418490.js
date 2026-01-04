// ==UserScript==
// @name         对github面试题顺序进行倒置
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  fe-interview的面试题是按照发布顺序排列的，新的在最上面。一般来说最先发布的是最常见的面试题，我们在复习时想要从最先发布的面试题开始复习，于是该脚本对面试题进行了倒序排列。
// @author       You
// @match        https://github.com/haizlin/fe-interview/blob/master/lib/**
// @match        https://github.com/haizlin/fe-interview/blob/master/category/**
// @grant        none
// @require    http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/418490/%E5%AF%B9github%E9%9D%A2%E8%AF%95%E9%A2%98%E9%A1%BA%E5%BA%8F%E8%BF%9B%E8%A1%8C%E5%80%92%E7%BD%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/418490/%E5%AF%B9github%E9%9D%A2%E8%AF%95%E9%A2%98%E9%A1%BA%E5%BA%8F%E8%BF%9B%E8%A1%8C%E5%80%92%E7%BD%AE.meta.js
// ==/UserScript==

(function() {
  'use strict'

  const waitTime = 500;//执行等待时间,单位ms，如果你网速比较慢就调高点

  setTimeout(() => {
    const uls = $('article.markdown-body ul')
    uls.each(function() {
      const ul = $(this)
      const lis = $(this).children()
      ul.empty()
      lis.each(function() {
        const li = $(this);
        ul.prepend(li)
      })
    })
  }, waitTime)
})()