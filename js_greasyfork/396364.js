// ==UserScript==
// @name         百度网盘视频播放器网页全屏播放
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  将开关灯的按钮的功能换为开启和关闭网页全屏播放，并在视频加载完成时自动关闭超级会员开通提示
// @author       jzh123s
// @match        https://pan.baidu.com/play*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396364/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%99%A8%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/396364/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%99%A8%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

let player

const targets = () => [
  document.querySelector('.video-main'),
  document.getElementById('video-wrap-outer'),
  document.getElementById('video-wrap'),
  window.videojs.getPlayers('video-player').html5player.children_[0].parentNode.parentNode
]

const hiddenElements = [
  document.querySelector('.header-box'),
  document.querySelector('.video-title')
]

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const changeButton = () => {
  const button = document.querySelector('.video-functions-last')
  document.querySelector('ul.tips-ul').removeChild(button)

  button.className = 'video-web-fullscreen'
  button.querySelector('span').innerText = '网页全屏'
  button.addEventListener('click', function () {
    event.stopPropagation()
    this.enable = !this.enable
    if (this.enable) {
      button.querySelector('span').innerText = '恢复默认'
    } else {
      button.querySelector('span').innerText = '网页全屏'
    }
    webFullscreen(this.enable)
  })
  document.querySelector('ul.tips-ul').appendChild(button)
}

const webFullscreen = enable => {
  if (enable) {
    for (const item of targets()) {
      item.originStyle = {
        height: item.style.height,
        width: item.style.width
      }
      item.style.height = '100vh'
      item.style.width = '100%'
    }

    for (const item of hiddenElements) {
      item.style.display = 'none'
    }

    window.scrollTo(0, 0)
    document.querySelector('html').style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
  } else {
    for (const item of targets()) {
      item.style.height = item.originStyle.height
      item.style.width = item.originStyle.width
    }

    for (const item of hiddenElements) {
      item.style.display = 'inherit'
    }

    document.querySelector('html').style.overflow = 'auto'
    document.body.style.overflow = 'auto'
  }
}

const tryAndGetPlayer = async () => {
  const tryAndGetDOM = async player => {
    if (player && player.children_ && player.children_[0]) {
      return player.children_[0].parentNode.parentNode
    }
    return false
  }
  if (window.videojs && window.videojs.getPlayers('video-player') && window.videojs.getPlayers('video-player').html5player) {
    const p = window.videojs.getPlayers('video-player').html5player
    let v
    while (!(v = await tryAndGetDOM(p))) {
      await delay(1000)
    }
    return v
  }
  return false
}

(function() {
  'use strict';
  window.onload = async () => {
    changeButton()
    while (!(player = await tryAndGetPlayer())) {
      await delay(1000)
    }
    console.log('HTML5 player loaded finish')
    const poster = player.parentNode.parentNode.parentNode.querySelector('#werbung-info-container')
    poster.style.display = 'hidden'
  }
})();