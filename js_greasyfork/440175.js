// ==UserScript==
// @name         值得买云学堂视频自动播放
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  云学堂自动校验在线状态
// @author       Lucius_1010
// @match        https://zhidemai.yunxuetang.cn/kng/course/package/video/*
// @match        https://zhidemai.yunxuetang.cn/kng/plan/video/*
// @icon         https://zhidemai.yunxuetang.cn/favicon.ico
// @license      The MIT License (MIT); http://opensource.org/licenses/MIT
// @downloadURL https://update.greasyfork.org/scripts/440175/%E5%80%BC%E5%BE%97%E4%B9%B0%E4%BA%91%E5%AD%A6%E5%A0%82%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/440175/%E5%80%BC%E5%BE%97%E4%B9%B0%E4%BA%91%E5%AD%A6%E5%A0%82%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
    let autoPlay = false
    let autoPlayInterval = null
    let isPlay = false
    let li = document.createElement('li')
    let videoEl
    (function getVideo () {
        videoEl = document.querySelector('#vjs_video_3_html5_api')
        if (videoEl) {
            console.log(11111, videoEl)
            videoEl.addEventListener('play', function () {
                isPlay = true
            })
            videoEl.addEventListener('pause', function () {
                isPlay = false
            })
            li.click()
        } else {
            setTimeout(getVideo, 1000);
        }
    })()
    li.innerHTML =
        `<span>
            <span id="praiseNum" class="hidden">0</span>
            <span class="el-icon-praise"></span>
            <div id="autoTxt">
            </div>
        </span>`
    li.onclick = function () {
        autoPlay = !autoPlay
        if (autoPlay) {
            span.innerText = '开启'
            if (autoPlayInterval) clearInterval(autoPlayInterval)
            autoPlayInterval = setInterval(autoPlayStart, 1000)
        } else {
            span.innerText = '关闭'
            autoPlayCancel()
        }
    }
    let span = document.createElement('span')
    span.dataset.localize="kng_lbl_like"
    span.innerText = '关闭'
    function autoPlayStart() {
        let mobEl = document.querySelector('#dvWarningView')
        if (mobEl) mobEl.style.display = 'none'
        if (!isPlay) videoEl.play()
    }
    function autoPlayCancel() {
        clearInterval(autoPlayInterval)
        let mobEl = document.querySelector('#dvWarningView')
        if (mobEl) {
            mobEl.style.display = ''
            videoEl.pause()
        }
    }
    document.querySelector('.el-play-page-bar').insertBefore(li, document.querySelector('#li1'))
    document.querySelector('#autoTxt').appendChild(span)
})()