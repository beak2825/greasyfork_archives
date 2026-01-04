// ==UserScript==
// @name         免费一键录屏
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  在网页添加一个“回到录制”的按钮，可以快速回到页面录制。
// @author       www.techwb.cn
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481598/%E5%85%8D%E8%B4%B9%E4%B8%80%E9%94%AE%E5%BD%95%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/481598/%E5%85%8D%E8%B4%B9%E4%B8%80%E9%94%AE%E5%BD%95%E5%B1%8F.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  // 创建按钮元素
  var scrollButton = document.createElement('button')
  scrollButton.textContent = '录制'
  scrollButton.id = 'scroll-top-button'
  var body = document.body

  // 添加按钮样式
  scrollButton.style.background = 'red' // 将背景颜色改为红色
  scrollButton.style.border = 'none' // 去掉边框
  scrollButton.style.color = 'white' // 文字颜色为白色
  scrollButton.style.padding = '10px 10px' // 设定按钮的内边距
  scrollButton.style.textAlign = 'center' // 文字居中
  scrollButton.style.textDecoration = 'none' // 去掉下划线
  scrollButton.style.display = 'block' // 默认不显示
  scrollButton.style.borderRadius = '10px' // 设定圆角
  scrollButton.style.boxShadow = '2px 2px 3px rgba(0, 0, 0, 0.3)' // 添加阴影效果
  scrollButton.style.cursor = 'pointer' // 设定鼠标样式为手型
  scrollButton.style.position = 'fixed' // 设定固定定位
  scrollButton.style.bottom = '20%' // 设定距离结束的距离
  scrollButton.style.right = '20px' // 设定距离右侧的距离
  scrollButton.style.zIndex = '9999' // 设定 z-index

  // 添加鼠标悬停效果
  scrollButton.addEventListener('mouseenter', function () {
    scrollButton.style.backgroundColor = '#ff6347' // 鼠标悬停时的背景颜色
  })

  scrollButton.addEventListener('mouseleave', function () {
    if (scrollButton.textContent === '录制') {
      scrollButton.style.backgroundColor = 'red' // 鼠标离开时的背景颜色
    } else {
      scrollButton.style.backgroundColor = 'blue' // 鼠标离开时的背景颜色
    }
  })

  // 添加按钮到页面
  body.appendChild(scrollButton)
  // 视频流
  // 录制视频模块
  async function mediaRecorderAction() {
    var stream = await navigator.mediaDevices.getDisplayMedia({ video: true })
    var mime = MediaRecorder.isTypeSupported('video/webm; codecs=vp9') ? 'video/webm; codecs=vp9' : 'video/webm'
    var mediaRecorder = new MediaRecorder(stream, { mimeType: mime })
    var chunks = []

    //录制
    mediaRecorder.addEventListener('dataavailable', function (e) {
      chunks.push(e.data)
    })

    //停止
    mediaRecorder.addEventListener('stop', function () {
      var blob = new Blob(chunks, { type: chunks[0].type })
      var url = URL.createObjectURL(blob)
      var a = document.createElement('a')
      a.href = url
      a.download = formatDateTime(new Date()) + 'video.webm'
      a.click()
    })

    //手动启动
    mediaRecorder.start()
  }

  // 点击按钮时，回到页面录制或结束
  scrollButton.addEventListener('click', async function () {
    if (scrollButton.textContent === '录制') {
      await mediaRecorderAction()
    }
  })
  function formatDateTime(time, format = 'yyyy-MM-dd_HH-mm-ss') {
    let t = new Date(time)
    let tf = function (i) {
      return (i < 10 ? '0' : '') + i
    }
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
      switch (a) {
        case 'yyyy':
          return tf(t.getFullYear())
        case 'MM':
          return tf(t.getMonth() + 1)
        case 'mm':
          return tf(t.getMinutes())
        case 'dd':
          return tf(t.getDate())
        case 'HH':
          return tf(t.getHours())
        case 'ss':
          return tf(t.getSeconds())
      }
    })
  }
})()
