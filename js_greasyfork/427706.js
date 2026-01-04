// ==UserScript==
// @name         视频相关
// @include      *://*
// @version      1.1.2
// @description  进入视频后,自动开始,自动静音，移除自动暂停，倍速播放
// @author       sndcyp
// @match        *://*
// @grant        none
// @namespace    
// @downloadURL https://update.greasyfork.org/scripts/427706/%E8%A7%86%E9%A2%91%E7%9B%B8%E5%85%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/427706/%E8%A7%86%E9%A2%91%E7%9B%B8%E5%85%B3.meta.js
// ==/UserScript==
$(document).ready(function () {
    // (function () {
    // 'use strict';
    window.onfocus = function () { console.log('原始事件已被替换') };
    window.onblur = function () { console.log('原始事件已被替换') };
    var tmp = setInterval(function () {
        if (player) {
            player.addListener('loadedmetadata', function () {
                player.videoPlay();
                player.videoMute();
                clearInterval(tmp);
            });
        }
    }, 500);
});
(function () {
  'use strict';
  let rate = 1
  let selectors = []
  if (/bilibili/.test(location.hostname)) {
    selectors = [
      'div.bilibili-player-video-top-title',
      'span.tit'
    ]
  } else if (/netflix/.test(location.hostname)) {
    selectors = ['.ellipsize-text h4']
  } else if (/youtube/.test(location.hostname)) {
    selectors = [
      '.ytp-title-link.yt-uix-sessionlink.ytp-title-fullerscreen-link',
      'h1 > yt-formatted-string.style-scope.ytd-video-primary-info-renderer'
    ]
  }
 
  window.addEventListener('keydown', (e) => {
    if (e.key === '`') {
      rate = 0.5
    } else {
      if ((/youtube/.test(location.hostname))) {
        if (e.key === ']' && rate < 16) {
          rate += 0.5
        } else if (e.key === '[' && rate > 0.25) {
          rate -= 0.5
        } else {
          return
        }
      } else {
        if (e.key === ']' && rate < 16) {
          rate += 0.25
        } else if (e.key === '[' && rate > 0.25) {
          rate -= 0.25
        } else if (e.key === '=' && rate < 16) {
          rate += 0.5
        } else if (e.key === '-' && rate > 0.5) {
          rate -= 0.5
        } else if (e.key === '1') {
          rate = 1
        } else if (e.key === '2') {
          rate = 2
        } else if (e.key === '3') {
          rate = 3
        } else if (e.key === '4') {
          rate = 4
        } else {
          return
        }
      }
    }
    setVideoRate()
    setVideoTitle()
  })
 
  function getTitle() {
    return selectors
             .map(selector => document.querySelector(selector))
             .filter(el => el && el.innerText)
             .map(el => el.innerText)[0]
  }
 
  function setVideoRate() {
    console.debug(`rate: ${rate}x`)
    document.querySelector('video').playbackRate = rate
  }
 
  function setVideoTitle() {
    const title = (getTitle() || '').replace(/^\[.*\] /, '')
    for (const selector of selectors) {
      const el = document.querySelector(selector)
      if (el) {
        el.innerHTML = `[${rate}x] ${title}`
      }
    }
  }
})();