// ==UserScript==
// @name         微博看h图
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://weibo.com/fangge617/home?wvr=5
// @grant        none
// @include           http://www.weibo.com/*
// @include           http://weibo.com/*
// @include           http://d.weibo.com/*
// @include           http://s.weibo.com/*
// @include           https://www.weibo.com/*
// @include           https://weibo.com/*
// @include           https://d.weibo.com/*
// @include           https://s.weibo.com/*
// @exclude           http://weibo.com/a/bind/*
// @exclude           http://weibo.com/nguide/*
// @exclude           http://weibo.com/
// @exclude           https://weibo.com/a/bind/*
// @exclude           https://weibo.com/nguide/*
// @exclude           https://weibo.com/
// @downloadURL https://update.greasyfork.org/scripts/403590/%E5%BE%AE%E5%8D%9A%E7%9C%8Bh%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/403590/%E5%BE%AE%E5%8D%9A%E7%9C%8Bh%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
      let canvas = document.createElement('canvas')
  let ctx = canvas.getContext('2d')

  function invertImg (originImg) {
    if (!(originImg instanceof window.Image)) {
      return
    }

    // 跨域
    let img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.onerror = () => window.alert('载入图片失败，可能是跨域问题？')
    img.onload = () => {
      [canvas.width, canvas.height] = [img.width, img.height]
      ctx.drawImage(img, 0, 0)

      // 反色
      let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < imgData.data.length; i += 4) {
        imgData.data[i] = ~imgData.data[i] & 0xFF
        imgData.data[i + 1] = ~imgData.data[i + 1] & 0xFF
        imgData.data[i + 2] = ~imgData.data[i + 2] & 0xFF
      }
      ctx.putImageData(imgData, 0, 0)
      originImg.src = canvas.toDataURL()
    }

    if (originImg.src.startsWith('data:')) {
      img.src = originImg.src
    } else {
      // 防缓存
      img.src = originImg.src + (originImg.src.indexOf('?') === -1 ? '?_t=' : '&_t=') + new Date().getTime()
    }
  }

  // 监听右键菜单
  document.addEventListener('contextmenu', event => {
    if (event.target instanceof window.Image) {
      event.preventDefault()
      invertImg(event.target)
    }
  })
})();