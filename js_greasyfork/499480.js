// ==UserScript==
// @name         bilibili-哔哩哔哩禁止首页视频自动预览
// @namespace    http://tampermonkey.net/
// @version      2024-06-27
// @description  哔哩哔哩禁止首页鼠标悬停时自动预览视频
// @author       v
// @match        https://www.bilibili.com/*
// @match        https://search.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499480/bilibili-%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%A6%81%E6%AD%A2%E9%A6%96%E9%A1%B5%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/499480/bilibili-%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%A6%81%E6%AD%A2%E9%A6%96%E9%A1%B5%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==

(function() {
  'use strict'
  document.addEventListener('mouseenter', function(event) {
    // div class="bili-video-card__image--wrap" mouseenter
    if (event.target.classList.contains('bili-video-card__image--wrap')) {
      event.stopPropagation()
      event.stopImmediatePropagation()
      return
    }
  }, true)
})()