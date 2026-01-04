// ==UserScript==
// @name         蓝奏直接打开下载直链
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://pc.woozooo.com/mydisk.php
// @grant        none
// @icon         https://pc.woozooo.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/401492/%E8%93%9D%E5%A5%8F%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%E4%B8%8B%E8%BD%BD%E7%9B%B4%E9%93%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/401492/%E8%93%9D%E5%A5%8F%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%E4%B8%8B%E8%BD%BD%E7%9B%B4%E9%93%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let win = window.frames.mainframe;

    win.onload = function() {
        let dom = win.document

        console.log(dom.querySelector('#f_sha1'))
        let box = dom.getElementById('f_sha')
        let shareUrl = dom.querySelector('#f_sha1')
        let downBtn = dom.createElement('a');
        downBtn.style.cssText = `
            display: flex;
            justify-content: center;
            align-items: center;
            background: linear-gradient(to right, #f6d365, #fda085);
            width: 180px;
            height: 40px;
            color: #fff;
            border-radius: 20px;
            margin: 0 auto 10px;
        `
        downBtn.href = 'javascript:'
        downBtn.onclick = function() {
            console.log(shareUrl.innerText)
            window.open(`https://v1.alapi.cn/api/lanzou?url=${shareUrl.innerText}`)
        }


        let downBtnImg = dom.createElement('img')
        downBtnImg.src = 'https://gitee.com/lixuewen9/picture_bed/raw/master/download.svg'
        downBtnImg.style.width = '20px'
        downBtn.appendChild(downBtnImg)

        let downBtnSpan = dom.createElement('span')
        downBtnSpan.innerText = 'Download'
        downBtnSpan.style.marginLeft = '5px'
        downBtn.appendChild(downBtnSpan)

        box.insertBefore(downBtn, shareUrl.nextSibling)
    }
})();