// ==UserScript==
// @name         wolai 视频变速
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  wolai 视频变速 简陋版
// @author       ch3cknull
// @match        https://www.wolai.com/*
// @icon         https://www.google.com/s2/favicons?domain=wolai.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/439274/wolai%20%E8%A7%86%E9%A2%91%E5%8F%98%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/439274/wolai%20%E8%A7%86%E9%A2%91%E5%8F%98%E9%80%9F.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  const rewriteComponentBase = () => {
    const template = `

<select class="my-set-rate">
  <option value="0.5">0.5</option>
  <option value="0.8">0.8</option>
  <option value="1" selected>1.0</option>
  <option value="1.25">1.25</option>
  <option value="1.5">1.5</option>
  <option value="2">2.0</option>
</select>
<style>
.my-set-rate {
  position:fixed;
  right: 20px;
  top: 100px;
}
</style>`

    const video = document.querySelector('video')

    console.log('active')

    const element = document.createElement('div')
    element.innerHTML = template
    document.body.append(element)

    setTimeout(() => {
      element
        .querySelector('.my-set-rate')
        .addEventListener('change', function () {
          video.playbackRate = this.value
          console.log(video)
          console.log(`set rate: ${this.value}`)
        })
    }, 0)
  }
  window.onload = setTimeout(rewriteComponentBase, 3000)
})()
