// ==UserScript==
// @name         爱奇艺,优酷,腾讯视频 简洁画面，logo水印移除
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  删除元素，logo，达到极简效果
// @license      MIT
// @author       ByXian
// @match        https://www.iqiyi.com/*.html*
// @match        https://v.qq.com/*
// @match        https://v.youku.com/v_show/*.html*
// @match        https://y.qq.com/n/yqq/mv/v/*.html
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/404926/%E7%88%B1%E5%A5%87%E8%89%BA%2C%E4%BC%98%E9%85%B7%2C%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%20%E7%AE%80%E6%B4%81%E7%94%BB%E9%9D%A2%EF%BC%8Clogo%E6%B0%B4%E5%8D%B0%E7%A7%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/404926/%E7%88%B1%E5%A5%87%E8%89%BA%2C%E4%BC%98%E9%85%B7%2C%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%20%E7%AE%80%E6%B4%81%E7%94%BB%E9%9D%A2%EF%BC%8Clogo%E6%B0%B4%E5%8D%B0%E7%A7%BB%E9%99%A4.meta.js
// ==/UserScript==

;(function () {
  'use strict'
    // 代码在 https://gitee.com/xian09/ity
  if (location.href === 'https://xian09.gitee.io/ity/') return
  var script = document.createElement('script')
  script.src = 'https://xian09.gitee.io/ity/app.bundle.js'
  document.body.appendChild(script)
})()
