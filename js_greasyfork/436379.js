// ==UserScript==
// @name         B站页面跳转+自动网页宽屏
// @namespace    https://www.iplaysoft.com
// @version      0.16
// @description  B站搜索页面跳转+自动网页宽屏
// @author       You
// @match        https://www.bilibili.com/*video/*
// @match        https://www.bilibili.com/*/play/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @license GNU GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436379/B%E7%AB%99%E9%A1%B5%E9%9D%A2%E8%B7%B3%E8%BD%AC%2B%E8%87%AA%E5%8A%A8%E7%BD%91%E9%A1%B5%E5%AE%BD%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/436379/B%E7%AB%99%E9%A1%B5%E9%9D%A2%E8%B7%B3%E8%BD%AC%2B%E8%87%AA%E5%8A%A8%E7%BD%91%E9%A1%B5%E5%AE%BD%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = window.location.href;
    if(url.indexOf("/s/") != -1){
        var newUrl = url.replace(/\/\/www\.bilibili\.com\/s\/video\//, "//www.bilibili.com/video/");
        window.location.href = newUrl;
    }
    /*window.addEventListener('load', function() {
        document.getElementsByClassName("bilibili-player-video-btn-widescreen")[0].click();
    }, false);
    */
})();


//自动宽屏代码
//来自：https://greasyfork.org/zh-CN/scripts/393151-b%E7%AB%99%E8%87%AA%E5%8A%A8%E5%AE%BD%E5%B1%8F/code
(async function () {
  // prevent space bar from scrolling page
  window.addEventListener('keydown', function (e) {
    if (e.code === 'Space' && e.target == document.body) {
      e.preventDefault()
    }
  })

  const sleep = function * (sec) {
    while (true) {
      yield new Promise(res => setTimeout(res, sec * 1000))
    }
  }

  for await (const __ of sleep(0.5)) {
    const box = document.querySelector(
      '.bpx-player-control-bottom-right',
    )
    const btn = box.querySelector('.bpx-player-ctrl-wide')
    if (btn) {
      btn.click()
      break
    }
  }
})();