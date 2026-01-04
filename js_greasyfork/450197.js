// ==UserScript==
// @name         下载淘宝主图视频
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  保存淘宝主图视频
// @author       tuiu
// @license.     MIT
// @match        https://detail.tmall.com/item.htm*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tmall.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450197/%E4%B8%8B%E8%BD%BD%E6%B7%98%E5%AE%9D%E4%B8%BB%E5%9B%BE%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/450197/%E4%B8%8B%E8%BD%BD%E6%B7%98%E5%AE%9D%E4%B8%BB%E5%9B%BE%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const btn = document.createElement("button")
    btn.innerText = "下载视频"
    btn.style.position = "fixed"
    btn.style.top = "20%"
    btn.style.right = "0"
    btn.style.border = "none"
    btn.style.backgroundColor = "white"
    btn.style.paddingLeft = 20
    btn.style.paddingTop = 20
    btn.style.paddingBottom = 20
    btn.style.zIndex = 999
    document.body.append(btn)
    btn.addEventListener("click", function() {
        const src = document.querySelector("#mainPicVideoEl > div > video").src
        const fileName = `${document.title}.mp4`
        let x = new XMLHttpRequest()
        x.open('GET', src, true)
        x.responseType = 'blob'
        x.onload = (e) => {
            let url = window.URL.createObjectURL(x.response)
            let a = document.createElement('a')
            a.href = url
            a.download = fileName
            a.click()
        }
        x.send()
    })
})();