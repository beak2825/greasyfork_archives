// ==UserScript==
// @name          录屏
// @namespace     https://blog.csdn.net/mukes
// @version       0.0.1
// @description  点击页面捕获和录制按钮，进行录屏
// @author       zhansheng
// @include      *.100bm.cn
// @include      *.blog.csdn.net/article/details/*
// @downloadURL https://update.greasyfork.org/scripts/445576/%E5%BD%95%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/445576/%E5%BD%95%E5%B1%8F.meta.js
// ==/UserScript==
(function() {
    'use strict';
    let videoBuffer = []
  let mediaRecorder
  let recording = false

  async function getMediaStream(stream) {
    window.$stream = stream
  }

  async function startCapture(displayMediaOptions) {
    let captureStream = null;
    try {
      captureStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
    } catch (err) {
      console.error("Error: " + err);
    }
    return captureStream;
  }

  async function start() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
      console.log('getUserMedia is not supported')
    } else {
      const displayMediaOptions = {
        video: true,
        audio: false,
      }

      let captureStream = await startCapture(displayMediaOptions)
      await getMediaStream(captureStream)
    }

  }

  function handleDataAvailable(e) {
    if (e && e.data && e.data.size > 0) {
      videoBuffer.push(e.data)
    }
  }

  async function record(even) {
    let $target = even.target
    if (recording) {
      stopRecord()
      $target.innerText = '录制'
    } else {
      startRecord()
    }
  }

  function startRecord() {
    videoBuffer = []
    const options = {
      mimeType: 'video/webm; codecs = vp8',
    }

    if(!window.$stream){
        alert('请先捕获屏幕')
        return
    }

    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      console.error('${options.mimeType} is not supported!')
      return
    }

    try {
      mediaRecorder = new MediaRecorder(window.$stream, options)
    } catch (e) {
      console.error('Failed to create MediaRecorder:', e)
      return
    }
    
    mediaRecorder.ondataavailable = handleDataAvailable
    mediaRecorder.start(10)
    recording = true
    document.querySelector("#luzhi").innerText = '结束'
  }

  function stopRecord() {
    mediaRecorder.stop()
    recording = false
    downRecord()
  }

  // 下载录制
  function downRecord() {
    const blob = new Blob(videoBuffer, { type: 'video/webm' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    const fileName = new Date().toLocaleString()
    a.href = url
    a.style.display = 'none'
    a.download = `${fileName}.mp4`
    a.click()
  }

  function init() {
    // js 构造相关按钮
    // 构造 开始捕获屏幕按钮
    let button_start = document.createElement('div')
    button_start.style.position = 'absolute'
    button_start.style.top = '0px'
    button_start.style.left = '0px'
    button_start.style.zIndex = 999
    button_start.style.width = '50px'
    button_start.style.height = '50px'
    button_start.style.borderRadius = '50%'
    button_start.style.background = 'pink'
    button_start.innerText = '捕获'
    button_start.style.textAlign = 'center'
    button_start.style.lineHeight = '50px'
    button_start.style.fontSize = '15px'
    button_start.setAttribute('id', 'start')

    // 构造 录制(结束)按钮
    let button_luzhi = document.createElement('div')
    button_luzhi.style.position = 'absolute'
    button_luzhi.style.top = '80px'
    button_luzhi.style.left = '0px'
    button_luzhi.style.zIndex = 999
    button_luzhi.style.width = '50px'
    button_luzhi.style.height = '50px'
    button_luzhi.style.borderRadius = '50%'
    button_luzhi.style.background = 'blue'
    button_luzhi.innerText = '录制'
    button_luzhi.style.textAlign = 'center'
    button_luzhi.style.lineHeight = '50px'
    button_luzhi.style.fontSize = '15px'
    button_luzhi.setAttribute('id', 'luzhi')

    document.body.appendChild(button_start)
    document.body.appendChild(button_luzhi)


    document.querySelector("#start").addEventListener('click', start)
    document.querySelector("#luzhi").addEventListener("click", record)
  }

  init()
    
})(); //(function(){})() 表示该函数立即执行
