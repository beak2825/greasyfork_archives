// ==UserScript==
// @name         xhs no watermark
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  需要先登录
// @author       You
// @match        https://www.xiaohongshu.com/explore/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xiaohongshu.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/470149/xhs%20no%20watermark.user.js
// @updateURL https://update.greasyfork.org/scripts/470149/xhs%20no%20watermark.meta.js
// ==/UserScript==

; (function () {
    'use strict'
    function downloadFile(fileUrl, fileName) {
        var link = document.createElement('a')
        link.href = fileUrl
        link.download = fileName
        link.click()
    }
    window.onload = function () {
        Array.from(document.getElementsByTagName('script')).some((item) => {
            if (item.innerText.startsWith('window.__INITIAL_STATE__')) {
                eval(item.innerHTML)
                return true
            }
        })
        const noteId = window.__INITIAL_STATE__.note.firstNoteId
        const imageList = window.__INITIAL_STATE__.note.noteDetailMap[noteId].note.imageList
        const result = []
        imageList.forEach((item) => {
            const strArr = item.url.split('/')
            strArr.pop()
            strArr.push(item.traceId)
            const url = strArr.join('/') + '?imageView2/2/h/1920/format/jpg|imageMogr2/strip'
            result.push(url)
            item.url = url
        })
        console.log('result:', result)
        document.getElementsByClassName(
            'swiper-wrapper',
        )[0].children[1].style.backgroundImage = `url("${result[0]}")`

        const btn1 = document.createElement('button')
        btn1.setAttribute('class', 'download-btn')
        GM_addStyle(
            '.download-btn{    padding: 5px;border: 1px solid #eee;border-radius: 5px;cursor: pointer;}',
        )
        btn1.innerText = '下载这张'

        const btn2 = btn1.cloneNode()
        btn2.innerText = '下载全部'

        btn1.onclick = function () {
            // fraction
            const index = document.querySelector('.fraction').innerText.split('/')[0] - 1
            const url = result[index]
            window.open(url)
        }

        btn2.onclick = function () {
            result.forEach(item => {
                window.open(item)
            })
        }
        document.querySelector('.author-container .author').append(btn1)
        document.querySelector('.author-container .author').append(btn2)
    }
})()