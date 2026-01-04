/* eslint-disable no-undef */
// ==UserScript==
// @name         力扣隐藏会员、面试、竞赛、剑指offer题
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  力扣隐藏会员、面试、竞赛(LCP)、剑指offer(LCR)题
// @author       jzh
// @match        https://leetcode.cn/problemset/all/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @require      http://code.jquery.com/jquery-3.x-git.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480501/%E5%8A%9B%E6%89%A3%E9%9A%90%E8%97%8F%E4%BC%9A%E5%91%98%E3%80%81%E9%9D%A2%E8%AF%95%E3%80%81%E7%AB%9E%E8%B5%9B%E3%80%81%E5%89%91%E6%8C%87offer%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/480501/%E5%8A%9B%E6%89%A3%E9%9A%90%E8%97%8F%E4%BC%9A%E5%91%98%E3%80%81%E9%9D%A2%E8%AF%95%E3%80%81%E7%AB%9E%E8%B5%9B%E3%80%81%E5%89%91%E6%8C%87offer%E9%A2%98.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  const button = $('<button id="filter" type="button"></button>').text('筛选')
  $('.min-w-full').prepend(button)
  $('#filter').click(function () {
    const list = document.getElementsByClassName('min-w-full')[0].children[2]
    for (let i = list.children.length - 1; i >= 0; i--) {
      const item = list.children[i]
      if (item.children[0].hasChildNodes()) {
        item.style.display = 'none'
      } else {
        const text = item.children[1].children[0].getElementsByTagName('a')[0].innerText
        if (text.startsWith('LCR') || text.startsWith('LCP') || text.startsWith('面试题')) {
          item.style.display = 'none'
        }
      }
    }
  })
})()
