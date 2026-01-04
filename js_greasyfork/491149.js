// ==UserScript==
// @name         抖音提取无水印视频
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  抖音提取无水印视频，最后需要自己在网页ctrl + s下载
// @author       bbbyqq
// @match        *://www.douyin.com/*
// @match        *://douyin.com/*
// @grant        GM_addStyle
// @license      bbbyqq
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/491149/%E6%8A%96%E9%9F%B3%E6%8F%90%E5%8F%96%E6%97%A0%E6%B0%B4%E5%8D%B0%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/491149/%E6%8A%96%E9%9F%B3%E6%8F%90%E5%8F%96%E6%97%A0%E6%B0%B4%E5%8D%B0%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function () {
  'use strict'

  $('#sliderVideo')

  // 创建 div 元素
  let div = `<div class="btn_opt">提取视频</div>`

  let css = `
  .btn_opt {
    padding: 5px 10px;
    position: fixed;
    top: 2%;
    left: 8%;
    z-index: 99999;
    background-color: #1890ff;
    color: #ffffff;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
  }
  .btn_opt:hover {
    background-color: #79bbff;
  }`
  GM_addStyle(css)

  $('body').append(div)

  // 绑定按键点击功能
  $(`.btn_opt`).unbind("click").bind("click", function () {
    const videos = document.getElementsByTagName('video')
    // 遍历每个 video 标签并暂停播放
    for (const v of videos) {
      v.pause()
    }
    if (document.querySelectorAll('#sliderVideo').length) { // 抖音可鼠标滚轮滚动播放页面
      // 获取具有指定 data-e2e 属性的元素中 data-e2e-vid 属性的值
      const vid = document.querySelector('[data-e2e="feed-active-video"]').getAttribute('data-e2e-vid')
      window.open(`https://www.douyin.com/video/${vid}`)
    } else { // 抖音单个视频页面
      window.open(document.querySelectorAll('.xg-video-container video source')[0].getAttribute("src"))
    }
  })
})()
