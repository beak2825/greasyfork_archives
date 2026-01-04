// ==UserScript==
// @name         instapaper显示公众号防盗链图片
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Load original image of wechat artical on instapaper
// @author       https://github.com/techmovie
// @match        https://www.instapaper.com/read/*
// @match        https://www.instapaper.com/u*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419374/instapaper%E6%98%BE%E7%A4%BA%E5%85%AC%E4%BC%97%E5%8F%B7%E9%98%B2%E7%9B%97%E9%93%BE%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/419374/instapaper%E6%98%BE%E7%A4%BA%E5%85%AC%E4%BC%97%E5%8F%B7%E9%98%B2%E7%9B%97%E9%93%BE%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==
/* jshint esversion:6 */
(function () {
  showImage()
  function showImage () {
    const imglist = document.querySelectorAll('#story img')
    for (let i = 0; i < imglist.length; i++) {
      const imageSrc = imglist[i].getAttribute('src')
      if (imageSrc) {
        if (imageSrc.includes('mmbiz.qpic.cn')) {
          imglist[i].setAttribute('src', 'http:///localhost:3000?url=' + imageSrc)
        }
      }
    }
  }
})()
