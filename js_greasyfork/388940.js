// ==UserScript==
// @name         虎牙直播最高画质
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  虎牙直播自动选择最高画质
// @author       睿智的河水
// @match        *://*.huya.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388940/%E8%99%8E%E7%89%99%E7%9B%B4%E6%92%AD%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/388940/%E8%99%8E%E7%89%99%E7%9B%B4%E6%92%AD%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8.meta.js
// ==/UserScript==

(function () {
  'use strict'

  $(document).ready(() => {
    if (!$('#chatRoom').length) {
      return
    }
    setTimeout(() => {
      $('.player-videotype-list').find('li').eq(0).trigger('click')
      setTimeout(() => {
        $('.player-play-btn').trigger('click')
      }, 500)
    }, 1000)
  })
})()