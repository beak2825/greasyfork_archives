// ==UserScript==
// @name         Queue-it-script
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  需要自定义检测刷新时间，以及自定义链接，延时默认为 0 ms。
// @author       cc
// @match        https://*.coinlist.co/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425156/Queue-it-script.user.js
// @updateURL https://update.greasyfork.org/scripts/425156/Queue-it-script.meta.js
// ==/UserScript==

(function() {
  'use strict';
  // 开始检测和刷新的时间，需要自定义
  var start_time = 'yyyy-mm-dd HH:MM:SS.zzz'
  // 要跳转重载的链接，需要自定义
  var target_url = 'the target url'
  // 每次重载需要延迟的时间，默认为 0 ms
  var delay_time = 0

  // 下面不用改
  function inform (msg) {
    console.log(`%c[${msg}]`, 'background-color: #16bd7f; color: #ffffff; font-size: 16px; font-weight: bold;')
  }
  function time_is_vaild (time) {
    return Boolean(time.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}$/))
  }
  function target_url_is_valid (url) {
    return target_url.indexOf('http') >= 0
  }
  function task () {
    var paragraph = document.getElementById('headerparagraph')
    if (paragraph && paragraph.innerText.indexOf('you are in line to visit CoinList.') > 0) {
      inform(`${delay_time} ms 后开始重载`)
      setTimeout(() => {
        location.href = target_url
      }, delay_time)
    } else if (paragraph && paragraph.innerText.indexOf('you are in line to visit CoinList token sales.') > 0) {
      inform(`匹配成功`)
      alert('匹配成功')
    } else {
      inform(`匹配成功`)
      alert('该页面不符合任何匹配模式')
    }
  }
  window.onload = function () {
    inform('Queue-it-script 准备运行')
    var h2 = document.getElementById('lbHeaderH2')
    if (h2 && h2.innerText == 'You are now in line') {
      if (target_url_is_valid(target_url)) {
        if (time_is_vaild(start_time)) {
          var delta_time = new Date(start_time).getTime() - Date.now()
          delta_time = delta_time > 0 ? delta_time : 0
          inform(`${delta_time} ms 后开始任务`)
          setTimeout(task, delta_time)
        } else {
          alert('请前往脚本编辑页修改 start_time 为合适的格式')
        }
      } else {
        alert('请前往脚本编辑页修改 target_url 为合适的链接')
      }
    } else {
      inform('该页面不是 COINLIST 页面')
    }
  }
})();