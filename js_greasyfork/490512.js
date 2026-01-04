// ==UserScript==
// @name         禅道附件视频播放
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  为禅道的视频附件添加播放功能，无需下载
// @author       GreenBoy0526
// @match        http://chandao.iwhere.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490512/%E7%A6%85%E9%81%93%E9%99%84%E4%BB%B6%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/490512/%E7%A6%85%E9%81%93%E9%99%84%E4%BB%B6%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let fileList = document.querySelectorAll('.files-list li>a')
    if (!fileList.length) return

    let video = null
    let videoBox = null
    createVideoDom()

    // 添加点击事件
    for (let index = 0; index < fileList.length; index++) {
        const element = fileList[index];
        element.onclick = player
    }

    function createVideoDom() {
        videoBox = document.createElement('div')
        videoBox.style.position = 'fixed'
        videoBox.style.top = '50%'
        videoBox.style.left = '50%'
        videoBox.style.transform = 'translate(-50%, -50%)'
        videoBox.style.height = '100vh'

        let relativeBox = document.createElement('div')
        relativeBox.style.position = 'relative'
        relativeBox.style.width = '100%'
        relativeBox.style.height = '100%'

        video = document.createElement('video')
        video.style.maxHeight = '100%'
        video.src = ''
        video.controls = 'controls'
        video.autoplay = 'autoplay'

        let closeBtn = document.createElement('span')
        closeBtn.style.position = 'absolute'
        closeBtn.style.top = '0px'
        closeBtn.style.right = '0px'
        closeBtn.style.color = 'red'
        closeBtn.style.width = '40px'
        closeBtn.style.fontSize = '30px'
        closeBtn.style.lineHeight = '40px'
        closeBtn.style.textAlign = 'center'
        closeBtn.style.cursor = 'pointer'
        closeBtn.style.background = '#eee'
        closeBtn.innerHTML = 'X'
        closeBtn.onclick = function () {
            videoBox.style.display = 'none'
            video.src = ''
        }

        relativeBox.appendChild(video)
        relativeBox.appendChild(closeBtn)
        videoBox.appendChild(relativeBox)
        document.body.appendChild(videoBox)

        videoBox.style.display = 'none'
    }

    function player(e) {
        let videoUrl = e.target.href
        if (!videoUrl) return

        // 判断是否为视频格式
        let fileName = e.target.innerText
        if (!fileName.match(/\.(mp4|avi|wmv|mkv|MP4|AVI|WMV|MKV)/)) return

        video.src = videoUrl
        videoBox.style.display = 'block'

        // 取消默认下载事件
        return false
    }
})();