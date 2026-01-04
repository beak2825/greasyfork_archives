// ==UserScript==
// @name         虎扑楼中图片缩小
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  把图片的最大宽度缩小50%
// @author       Rod
// @match        https://bbs.hupu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418380/%E8%99%8E%E6%89%91%E6%A5%BC%E4%B8%AD%E5%9B%BE%E7%89%87%E7%BC%A9%E5%B0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/418380/%E8%99%8E%E6%89%91%E6%A5%BC%E4%B8%AD%E5%9B%BE%E7%89%87%E7%BC%A9%E5%B0%8F.meta.js
// ==/UserScript==

(function () {
  'use strict';

  window.addEventListener('scroll', () => {
    imgsmall()
  })

  function imgsmall() {
    let arr = document.querySelectorAll("[class*=reply-list-content] img,.main-post-info img")
    for (let item of arr) {
      if (isVisible(item)) item.style.maxWidth = '50%'
    }
  }

  function isVisible(elem) {
    let coords = elem.getBoundingClientRect();

    let windowHeight = document.documentElement.clientHeight;

    // 顶部元素边缘可见或底部元素边缘可见
    let topVisible = coords.top > -250 && coords.top < windowHeight;
    let bottomVisible = coords.bottom < windowHeight + 250 && coords.bottom > 0;
    

    return topVisible || bottomVisible;
  }
})();