// ==UserScript==
// @name         录屏工具
// @namespace    arale
// @version      0.2
// @description  浏览器原生录屏支持
// @author       Gj
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=0.1
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445702/%E5%BD%95%E5%B1%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/445702/%E5%BD%95%E5%B1%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
        // 录屏代码网上有很多，稍微加了点交互，用作自己日常使用
        const body = document.querySelector("body")
        // 创建一个button
        const btn = document.createElement('button')
        btn.innerText = '开始录制'
        btn.id = 'test_btn'
        btn.style.cssText = `
            width: 60px;
            height: 30px;
            position: fixed;
            z-index: 999999;
            top: 10px;
            left: -55px;
            background-color: #d9534f;
            border-color: #d43f3a;
            border: none;
            padding: 4px 5px;
            border-radius: 5px;
            color: #fff;
            cursor: pointer;
            transition: all 0.1s;
            font-size: 12px;`
        // 设置hover样式
        btn.onmouseover = function () {
            this.style.left = '0px'
        }
        btn.onmouseout = function () {
            this.style.left = '-55px'
        }
        body.appendChild(btn)

        btn.addEventListener("click", async function () {
            let stream = await navigator.mediaDevices.getDisplayMedia({ video: true })
            // 需要更好的浏览器支持
            const mime = MediaRecorder.isTypeSupported("video/webm; codecs=vp9")
                ? "video/webm; codecs=vp9"
                : "video/webm"
            let mediaRecorder = new MediaRecorder(stream, {
                mimeType: mime
            })
            let chunks = []
            mediaRecorder.addEventListener('dataavailable', function (e) {
                chunks.push(e.data)
            })
            mediaRecorder.addEventListener('stop', function () {
                let blob = new Blob(chunks, {
                    type: chunks[0].type
                })
                let url = URL.createObjectURL(blob)

                let a = document.createElement('a')
                a.href = url
                a.download = `video_${Date.now()}.mp4`
                a.click()
            })
            // 必须手动启动
            mediaRecorder.start()
        })
})();